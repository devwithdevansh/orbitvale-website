'use client';

import { useState, type FormEvent } from 'react';

const PROJECT_TYPES = [
  'Web App',
  'Mobile',
  'AI / ML',
  'Platform',
  'Design System',
  'Consultation',
];

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage: string | null;
  successMessage: string | null;
}

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({
    status: 'idle',
    errorMessage: null,
    successMessage: null,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [body, setBody] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const toggleType = (t: string) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side quick checks
    if (!name.trim()) {
      setFormState({
        status: 'error',
        errorMessage: 'Please enter your name.',
        successMessage: null,
      });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormState({
        status: 'error',
        errorMessage: 'Please enter a valid email address.',
        successMessage: null,
      });
      return;
    }

    if (body.trim().length < 10) {
      setFormState({
        status: 'error',
        errorMessage: 'Please describe your project (at least 10 characters).',
        successMessage: null,
      });
      return;
    }

    setFormState({ status: 'submitting', errorMessage: null, successMessage: null });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          budget: budget || 'Not specified',
          projectTypes: selectedTypes,
          body: body.trim(),
          website: honeypot, // Honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setFormState({
        status: 'success',
        errorMessage: null,
        successMessage: data.message || "Thank you. We've received your inquiry and will respond within 24 hours.",
      });

      // Clear fields only on confirmed success
      setName('');
      setEmail('');
      setCompany('');
      setBudget('');
      setSelectedTypes([]);
      setBody('');
      setHoneypot('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network failure. Please email hello@orbitvale.com directly.';
      setFormState({
        status: 'error',
        errorMessage: message,
        successMessage: null,
      });
    }
  };

  const handleReset = () => {
    setFormState({ status: 'idle', errorMessage: null, successMessage: null });
  };

  if (formState.status === 'success') {
    return (
      <div className="py-12 text-center flex flex-col items-center">
        <div className="h-16 w-16 rounded-full border border-accent/60 bg-accent/15 flex items-center justify-center text-accent mb-6 shadow-[0_0_30px_rgba(127,243,208,0.3)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink mb-3">
          Transmission Received
        </h3>
        <p className="text-muted max-w-md text-sm leading-relaxed mb-8">
          {formState.successMessage}
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-accent/50 bg-accent/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent hover:text-[#07080a] transition-all"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Error Banner */}
      {formState.status === 'error' && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-200 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-red-400">
            <span>⚠ Transmission Error:</span>
          </div>
          <p>{formState.errorMessage}</p>
          <p className="text-xs text-red-300/80">
            You can also email us directly at{' '}
            <a href="mailto:hello@orbitvale.com" className="text-accent underline font-mono">
              hello@orbitvale.com
            </a>
          </p>
        </div>
      )}

      {/* Honeypot field (hidden from real users) */}
      <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Row: Name + Email */}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Your name <span className="text-accent">*</span>
          </span>
          <input
            type="text"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Rivera"
            disabled={formState.status === 'submitting'}
            className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Email address <span className="text-accent">*</span>
          </span>
          <input
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@company.com"
            disabled={formState.status === 'submitting'}
            className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
          />
        </label>
      </div>

      {/* Row: Company + Budget */}
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Company (optional)
          </span>
          <input
            type="text"
            name="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corp"
            disabled={formState.status === 'submitting'}
            className="w-full rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
          />
        </label>
        <label className="block">
          <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Budget range
          </span>
          <select
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            disabled={formState.status === 'submitting'}
            className="w-full cursor-pointer appearance-none rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm text-ink outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
            style={{ color: 'var(--ink)' }}
          >
            <option value="" style={{ background: '#0f1013' }}>Select range…</option>
            <option value="lt10k" style={{ background: '#0f1013' }}>Under $10k</option>
            <option value="10-25k" style={{ background: '#0f1013' }}>$10k – $25k</option>
            <option value="25-50k" style={{ background: '#0f1013' }}>$25k – $50k</option>
            <option value="50k+" style={{ background: '#0f1013' }}>$50k+</option>
            <option value="discuss" style={{ background: '#0f1013' }}>Let&apos;s discuss</option>
          </select>
        </label>
      </div>

      {/* Project Type Pills */}
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
          Project type
        </span>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((t) => {
            const isChecked = selectedTypes.includes(t);
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleType(t)}
                disabled={formState.status === 'submitting'}
                className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all focus-visible:ring-1 focus-visible:ring-accent outline-none ${
                  isChecked
                    ? 'border-accent bg-accent/15 text-accent shadow-[0_0_12px_rgba(127,243,208,0.2)]'
                    : 'border-line bg-panel-2 text-muted hover:border-line-2 hover:text-ink'
                }`}
                aria-pressed={isChecked}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Message */}
      <label className="block">
        <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
          Tell us about your project <span className="text-accent">*</span>
        </span>
        <textarea
          name="body"
          rows={5}
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={formState.status === 'submitting'}
          placeholder="Describe what you're building, what problem you're solving, and your timeline…"
          className="w-full resize-y rounded-xl border border-line bg-panel-2 px-4 py-3.5 text-sm leading-relaxed text-ink placeholder:text-dim/60 outline-none transition-all focus:border-accent/60 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
        />
      </label>

      {/* Submit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={formState.status === 'submitting'}
          className="inline-flex items-center justify-center gap-3 rounded-full border border-accent/60 bg-accent/15 px-8 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-accent transition-all hover:bg-accent hover:text-[#07080a] hover:border-accent hover:shadow-[0_0_24px_rgba(127,243,208,0.35)] focus-visible:ring-2 focus-visible:ring-accent outline-none disabled:opacity-50"
        >
          {formState.status === 'submitting' ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
              <span>Transmitting…</span>
            </>
          ) : (
            <>
              <span>Send inquiry</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7h10M8 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
          Direct secure transmission · 24h response guarantee
        </p>
      </div>
    </form>
  );
}

export default ContactForm;
