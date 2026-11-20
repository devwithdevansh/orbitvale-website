'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AmbientSound — Lusion-class audio layer.
 *
 * Generates a soft ambient drone using the Web Audio API (no file needed).
 * Two detuned oscillators + filtered noise = space atmosphere.
 *
 * - Muted by default (browser autoplay policy)
 * - Visible mute toggle button in bottom-left corner
 * - Volume fades in/out smoothly (no clicks)
 * - Respects prefers-reduced-motion (hides button if no motion)
 * - Only initialises AudioContext on first user interaction
 */
export function AmbientSound() {
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<{
    ctx: AudioContext;
    gain: GainNode;
    oscs: OscillatorNode[];
    noise: AudioBufferSourceNode;
  } | null>(null);

  useEffect(() => {
    // Don't show on reduced-motion preference
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    setReady(true);
  }, []);

  function buildAudio() {
    if (audioRef.current) return;

    const ctx = new AudioContext();

    // Master gain (starts at 0, fades in when unmuted)
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.connect(ctx.destination);

    // Low-pass filter to soften everything
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.connect(gain);

    // Two detuned sine oscillators — creates subtle beating
    const freqs = [55, 55.5]; // A1 — sub-bass hum
    const oscs = freqs.map((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.18;
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    // Layered harmonic at 2× frequency
    const harmOsc = ctx.createOscillator();
    harmOsc.type = 'sine';
    harmOsc.frequency.value = 110;
    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.06;
    harmOsc.connect(harmGain);
    harmGain.connect(filter);
    harmOsc.start();
    oscs.push(harmOsc);

    // Brown noise (space hiss)
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // amplify
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 200;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(gain);
    noise.start();

    audioRef.current = { ctx, gain, oscs, noise };
  }

  function toggle() {
    if (!audioRef.current) {
      buildAudio();
    }
    const audio = audioRef.current;
    if (!audio) return;

    const { ctx, gain } = audio;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    if (muted) {
      // Fade in over 1.5s
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0.6, now + 1.5);
    } else {
      // Fade out over 1s
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(0, now + 1);
    }

    setMuted((v) => !v);
  }

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={muted ? 'Enable ambient sound' : 'Mute ambient sound'}
      title={muted ? 'Enable ambient sound' : 'Mute'}
      className="fixed bottom-6 left-6 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-line/60 bg-bg/80 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-panel"
    >
      {muted ? (
        // Sound off icon
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 5H4L7 2V12L4 9H2V5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" className="text-dim"/>
          <line x1="10" y1="5" x2="13" y2="9" stroke="#5c5e66" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="13" y1="5" x2="10" y2="9" stroke="#5c5e66" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ) : (
        // Sound on icon — animated bars
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 5H4L7 2V12L4 9H2V5Z" stroke="#7ff3d0" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M9.5 4.5C10.5 5.3 10.5 8.7 9.5 9.5" stroke="#7ff3d0" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M11.5 3C13.2 4.5 13.2 9.5 11.5 11" stroke="#7ff3d0" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
        </svg>
      )}
    </button>
  );
}
