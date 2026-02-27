import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, website, monthly_traffic, audience, promotion_method, message } = body;

    // Validate required fields
    if (!name || !email || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Send notification email to sales team
    const salesEmail = await resend.emails.send({
      from: 'IPden Partners <partners@ipden.io>',
      to: 'sales@ipden.io',
      subject: `New Partner Application - ${company}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">New Partner Application</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Website:</strong> ${website || 'Not provided'}</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Business Details</h3>
            <p><strong>Monthly Traffic:</strong> ${monthly_traffic || 'Not provided'}</p>
            <p><strong>Target Audience:</strong> ${audience || 'Not provided'}</p>
            <p><strong>Promotion Method:</strong> ${promotion_method || 'Not provided'}</p>
          </div>
          ${message ? `
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Additional Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          ` : ''}
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
            This partner application was submitted through the IPden website.
          </p>
        </div>
      `,
    });

    // Send confirmation email to the applicant
    const confirmationEmail = await resend.emails.send({
      from: 'IPden Partners <partners@ipden.io>',
      to: email,
      subject: 'Partner Application Received - IPden',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 40px 20px 20px;">
            <div style="display: inline-block; padding: 12px; background-color: #3b82f6; border-radius: 50%; margin-bottom: 20px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 style="color: #1f2937; margin: 0 0 10px 0; font-size: 28px;">Partner Application Received!</h1>
            <p style="color: #6b7280; font-size: 16px; margin: 0;">Thank you for your interest in partnering with IPden</p>
          </div>

          <div style="padding: 0 20px 20px;">
            <p style="margin-bottom: 20px;">Hello ${name},</p>
            
            <p style="margin-bottom: 20px;">
              We've successfully received your partner application for <strong>${company}</strong>. 
              Our partnerships team will review your application and get back to you within <strong>2-3 business days</strong>.
            </p>

            <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0;">
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px;">Application Summary:</h3>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Company:</strong> ${company}</p>
              <p style="margin: 4px 0; font-size: 14px;"><strong>Email:</strong> ${email}</p>
              ${website ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Website:</strong> ${website}</p>` : ''}
              ${monthly_traffic ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Monthly Traffic:</strong> ${monthly_traffic}</p>` : ''}
            </div>

            <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 12px 0; color: #0369a1;">What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #0369a1;">
                <li style="margin-bottom: 8px;">Our team will review your application details</li>
                <li style="margin-bottom: 8px;">We'll assess the partnership opportunity and fit</li>
                <li style="margin-bottom: 8px;">You'll receive a detailed response within 2-3 business days</li>
                <li>If approved, we'll schedule a call to discuss partnership terms</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://ipden.io/documentation" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 12px;">
                📚 View Documentation
              </a>
              <a href="https://ipden.io/dashboard" style="display: inline-block; background-color: transparent; color: #3b82f6; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; border: 1px solid #3b82f6;">
                🚀 Try Our Service
              </a>
            </div>

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0 0 10px 0;">
                Have urgent questions? Contact us directly:
              </p>
              <p style="margin: 0 0 5px 0;">
                <a href="mailto:sales@ipden.io" style="color: #3b82f6; text-decoration: none;">sales@ipden.io</a>
              </p>
              <p style="margin: 0;">
                <a href="https://t.me/IPden_proxies" target="_blank" style="color: #3b82f6; text-decoration: none;">📱 @IPden_proxies on Telegram</a>
              </p>
            </div>

            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This is an automated confirmation email. Please do not reply to this email.
                <br>© 2026 IPden. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    console.log('Sales email result:', salesEmail);
    console.log('Confirmation email result:', confirmationEmail);

    return NextResponse.json({ 
      success: true, 
      message: 'Partner application submitted successfully'
    });

  } catch (error) {
    console.error('Error processing partner application:', error);
    return NextResponse.json(
      { error: 'Failed to submit partner application' },
      { status: 500 }
    );
  }
}