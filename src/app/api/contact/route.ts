import { NextResponse } from 'next/server';

interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  budget?: string;
  projectTypes?: string[];
  body?: string;
  website?: string; // Honeypot field for bot detection
}

// In-memory rate limiting map for basic spam suppression
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (now - entry.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  entry.count += 1;
  return entry.count > maxRequests;
}

function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    const data: ContactPayload = await req.json();

    // 1. Honeypot check
    if (data.website && data.website.trim().length > 0) {
      return NextResponse.json(
        { success: true, transport: 'honeypot', message: 'Message submitted successfully.' },
        { status: 200 }
      );
    }

    // 2. Validation
    const name = data.name?.trim() || '';
    const email = data.email?.trim() || '';
    const company = data.company?.trim() || '';
    const budget = data.budget?.trim() || 'Not specified';
    const projectTypes = Array.isArray(data.projectTypes) ? data.projectTypes : [];
    const body = data.body?.trim() || '';

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!body || body.length < 10) {
      return NextResponse.json(
        { error: 'Please describe your project (at least 10 characters).' },
        { status: 400 }
      );
    }

    if (body.length > 3000) {
      return NextResponse.json(
        { error: 'Message is too long (maximum 3000 characters).' },
        { status: 400 }
      );
    }

    const cleanSubmission = {
      name: sanitize(name),
      email: email.toLowerCase(),
      company: sanitize(company),
      budget: sanitize(budget),
      projectTypes: projectTypes.map((t) => sanitize(String(t))),
      body: body.replace(/<[^>]*>/g, '').trim(),
      timestamp: new Date().toISOString(),
      ip,
    };

    let deliveredViaResend = false;

    // 3. Provider Integration (Resend API)
    if (process.env.RESEND_API_KEY) {
      try {
        const targetEmail = process.env.CONTACT_EMAIL || 'hello@orbitvale.com';
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM || 'Orbitvale Inquiries <inquiries@orbitvale.com>',
            to: [targetEmail],
            reply_to: cleanSubmission.email,
            subject: `New Project Inquiry from ${cleanSubmission.name}`,
            text: `Name: ${cleanSubmission.name}\nEmail: ${cleanSubmission.email}\nCompany: ${cleanSubmission.company}\nBudget: ${cleanSubmission.budget}\nTypes: ${cleanSubmission.projectTypes.join(', ')}\n\nMessage:\n${cleanSubmission.body}`,
          }),
        });

        if (resendRes.ok) {
          deliveredViaResend = true;
        } else {
          const resendErr = await resendRes.text();
          console.error('[Resend Error]', resendErr);
        }
      } catch (sendErr) {
        console.error('[Email Dispatch Error]', sendErr);
      }
    }

    // Always log to server console
    console.log('─── [ORBITVALE INQUIRY CAPTURED] ───');
    console.log(JSON.stringify(cleanSubmission, null, 2));
    console.log('Transport status:', deliveredViaResend ? 'Delivered via Resend' : 'Logged to server (No RESEND_API_KEY)');
    console.log('────────────────────────────────────');

    if (deliveredViaResend) {
      return NextResponse.json(
        {
          success: true,
          transport: 'email',
          message: "Thank you for reaching out. We've received your inquiry and will respond within 24 hours.",
        },
        { status: 200 }
      );
    }

    // Honest reporting when no live transport is configured
    return NextResponse.json(
      {
        success: true,
        transport: 'logged',
        message: 'Inquiry validated and recorded in our studio server log. Note: External email transport is not configured in this environment; for active proposals, please email hello@orbitvale.com directly.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[Contact API Error]', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your message. Please email hello@orbitvale.com directly.' },
      { status: 500 }
    );
  }
}
