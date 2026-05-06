// Supabase Edge Function: send-enquiry-email
// Triggered by a Database Webhook on INSERT to public.landlord_enquiries.
// Sends a formatted notification email via Resend.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;

const FROM_EMAIL = 'TIFA Property <enquiries@tifa.co.uk>';
const TO_EMAILS = ['hello@tifa.co.uk'];
const SUPABASE_TABLE_URL = 'https://supabase.com/dashboard/project/xbmnhhrggqkbwaowyxtw/editor';
const SITE_URL = 'https://tifa-property.com';

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const e = payload.record;

    if (!e) {
      return new Response(JSON.stringify({ error: 'No record in payload' }), { status: 400 });
    }

    const submittedUk = new Date(e.created_at).toLocaleString('en-GB', {
      timeZone: 'Europe/London',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const subject = `New landlord enquiry: ${e.first_name} ${e.last_name}${e.locations ? ` (${e.locations})` : ''}`;

    const html = `
<!DOCTYPE html>
<html><body style="font-family: -apple-system, Segoe UI, Helvetica, Arial, sans-serif; color: #1a2b3c; max-width: 600px; margin: 0 auto; padding: 24px;">
  <div style="border-bottom: 3px solid #3a8a7e; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="margin: 0; color: #1a2b3c; font-size: 22px;">New landlord enquiry</h1>
    <p style="margin: 6px 0 0; color: #555; font-size: 14px;">Submitted ${submittedUk}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
    <tr><td style="padding: 8px 0; color: #555; width: 35%;">Name</td><td style="padding: 8px 0;"><strong>${e.first_name} ${e.last_name}</strong></td></tr>
    <tr><td style="padding: 8px 0; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${e.email}" style="color: #3a8a7e;">${e.email}</a></td></tr>
    <tr><td style="padding: 8px 0; color: #555;">Phone</td><td style="padding: 8px 0;">${e.phone ? `<a href="tel:${e.phone}" style="color: #3a8a7e;">${e.phone}</a>` : '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #555;">Location(s)</td><td style="padding: 8px 0;">${e.locations || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #555;">Preferred model</td><td style="padding: 8px 0;">${e.letting_model || '—'}</td></tr>
    <tr><td style="padding: 8px 0; color: #555;">Properties</td><td style="padding: 8px 0;">${e.property_count || '—'}</td></tr>
  </table>

  ${e.message ? `
  <div style="margin-top: 20px; background: #f5f5f0; padding: 14px 16px; border-radius: 6px;">
    <div style="color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">Message</div>
    <div style="font-size: 14px; white-space: pre-wrap;">${e.message}</div>
  </div>` : ''}

  <div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
    <p style="margin: 0 0 6px;">Reply to this email to respond directly to the landlord.</p>
    <p style="margin: 0;">
      <a href="${SUPABASE_TABLE_URL}" style="color: #3a8a7e;">View in Supabase</a>
      &nbsp;·&nbsp;
      <a href="${SITE_URL}" style="color: #3a8a7e;">Open the site</a>
    </p>
  </div>
</body></html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAILS,
        reply_to: e.email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: err }), { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
