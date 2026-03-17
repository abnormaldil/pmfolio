import nodemailer from 'nodemailer';

export async function POST(request) {
    // ── 1. Parse request body safely ──
    let body;
    try {
        body = await request.json();
    } catch {
        return Response.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }

    const { name, email, message } = body || {};

    // ── 2. Validate inputs ──
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
        return Response.json(
            { error: 'All fields are required' },
            { status: 400 }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return Response.json(
            { error: 'Invalid email address' },
            { status: 400 }
        );
    }

    // ── 3. Validate env vars ──
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('[Contact API] Missing EMAIL_USER or EMAIL_PASS environment variables');
        return Response.json(
            { error: 'Mail service is not configured. Please contact us directly.' },
            { status: 503 }
        );
    }

    // ── 4. Create transporter with timeout ──
    let transporter;
    try {
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            connectionTimeout: 10000, // 10s to connect
            greetingTimeout: 10000,   // 10s for greeting
            socketTimeout: 15000,     // 15s socket idle
        });
    } catch (err) {
        console.error('[Contact API] Transporter creation failed:', err.message);
        return Response.json(
            { error: 'Mail service is temporarily unavailable. Please try again later.' },
            { status: 503 }
        );
    }

    // ── 5. Send notification email to owner (CRITICAL) ──
    try {
        await transporter.sendMail({
            from: `"Pixelated Website" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_TO || process.env.EMAIL_USER,
            subject: `New Contact: ${name}`,
            replyTo: email,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #D00000; margin-bottom: 20px;">New Contact Form Submission</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Name</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
                            <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message</td>
                            <td style="padding: 10px;">${message.replace(/\n/g, '<br>')}</td>
                        </tr>
                    </table>
                </div>
            `,
        });
    } catch (err) {
        console.error('[Contact API] Failed to send notification email:', err.message);
        return Response.json(
            { error: 'Failed to send your message. Please try again later.' },
            { status: 500 }
        );
    }

    // ── 6. Send auto-reply (NON-CRITICAL — failure won't affect user) ──
    try {
        await transporter.sendMail({
            from: `"Pixelated Media" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Thanks for reaching out!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #fafafa;">
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
                        <h2 style="color: #D00000; margin-top: 0;">Thanks for reaching out!</h2>
                        <p style="color: #333; line-height: 1.7;">Hi ${name},</p>
                        <p style="color: #333; line-height: 1.7;">
                            Thank you for contacting us. We've received your message and truly appreciate you taking the time to reach out.
                        </p>
                        <p style="color: #333; line-height: 1.7;">
                            We'll review your inquiry and get back to you as soon as possible — usually within 24–48 hours.
                        </p>
                        <p style="color: #333; line-height: 1.7;">
                            If your matter is urgent, feel free to mention it in a follow-up email.
                        </p>
                        <p style="color: #333; line-height: 1.7;">Looking forward to connecting with you.</p>
                        <p style="color: #333; line-height: 1.7; margin-bottom: 0;">
                            Best regards,<br>
                            <strong style="color: #D00000;">Pixelated Media</strong>
                        </p>
                    </div>
                </div>
            `,
        });
    } catch (err) {
        // Auto-reply failed, but the owner still got notified — not a critical failure
        console.warn('[Contact API] Auto-reply failed (non-critical):', err.message);
    }

    return Response.json({ success: true });
}

