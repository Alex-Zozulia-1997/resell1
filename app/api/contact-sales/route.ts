import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, phone, traffic, message } = body;

    // Validate required fields
    if (!name || !email || !traffic || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email content
    const emailContent = `
New Contact Sales Form Submission

Name: ${name}
Email: ${email}
Company: ${company || 'Not provided'}
Phone: ${phone || 'Not provided'}
Monthly Traffic: ${traffic}

Message:
${message}

Submitted on: ${new Date().toISOString()}
    `.trim();

    // For now, we'll use a simple email service
    // You can replace this with your preferred email service (Resend, SendGrid, etc.)
    
    // Option 1: Using fetch to send to a webhook service
    // Option 2: Using Resend API
    // Option 3: Using your SMTP service
    
    // Using Resend API (you'll need to add RESEND_API_KEY to your .env)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      // Send email to sales team
      const salesEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@ipden.io',
          to: ['sales@ipden.io'],
          subject: `New Contact Sales Request from ${name}`,
          text: emailContent,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Contact Sales Form Submission</h2>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Monthly Traffic:</strong> ${traffic}</p>
              </div>
              <div style="margin: 20px 0;">
                <h3 style="color: #333;">Message:</h3>
                <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #666; font-size: 12px;">Submitted on: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `,
        }),
      });

      if (!salesEmailResponse.ok) {
        const errorData = await salesEmailResponse.text();
        console.error('Resend API error (sales email):', errorData);
        throw new Error('Failed to send sales notification email');
      }

      // Send confirmation email to the person who submitted the form
      const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'noreply@ipden.io',
          to: [email],
          subject: 'Thank you for contacting IPden - We received your inquiry',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; background: #e5e7eb; border-radius: 8px; padding: 8px 4px;">
                  <span style="font-size: 24px; font-weight: bold; color: #f3f4f6; background: #111827; border-radius: 4px; padding: 2px 8px; letter-spacing: 2px;">IP</span>
                  <span style="font-size: 24px; font-weight: bold; color: #374151; padding-left: 2px;">den</span>
                </div>
              </div>
              
              <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Thank You for Your Inquiry!</h2>
              
              <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
                <p style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Hi ${name},</p>
                <p style="margin: 0 0 15px 0; color: #4b5563; line-height: 1.6;">
                  We have successfully received your contact request and appreciate your interest in IPden's enterprise proxy solutions.
                </p>
                <p style="margin: 0; color: #4b5563; line-height: 1.6;">
                  Our sales team will review your requirements and get back to you within <strong>24 hours</strong> with a customized solution for your needs.
                </p>
              </div>

              <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">Your Submission Details:</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Company:</strong> ${company || 'Not provided'}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Monthly Traffic:</strong> ${traffic}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
              </div>

              <div style="margin: 30px 0; text-align: center;">
                <p style="color: #6b7280; margin-bottom: 15px;">In the meantime, you can:</p>
                <div style="display: inline-block;">
                  <a href="https://ipden.io/documentation" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin: 0 5px; font-weight: 500;">View Documentation</a>
                  <a href="https://ipden.io/products/residential-proxies" style="display: inline-block; background: #6b7280; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; margin: 0 5px; font-weight: 500;">Learn More</a>
                </div>
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

              <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 6px; text-align: center;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  This is an automated confirmation email. Please do not reply to this message.
                </p>
              </div>
            </div>
          `,
        }),
      });

      if (!confirmationEmailResponse.ok) {
        const errorData = await confirmationEmailResponse.text();
        console.error('Resend API error (confirmation email):', errorData);
        // Don't throw here - sales email was sent successfully
        console.warn('Sales notification sent, but confirmation email failed');
      }

      const salesEmailResult = await salesEmailResponse.json();
      const confirmationEmailResult = confirmationEmailResponse.ok ? await confirmationEmailResponse.json() : null;
      
      console.log('Sales email sent successfully:', salesEmailResult);
      if (confirmationEmailResult) {
        console.log('Confirmation email sent successfully:', confirmationEmailResult);
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Contact request sent successfully',
        salesEmailId: salesEmailResult.id,
        confirmationEmailId: confirmationEmailResult?.id 
      });
    }
    
    // Fallback: Log to console (for development)
    console.log('📧 NEW CONTACT SALES FORM SUBMISSION:');
    console.log('=====================================');
    console.log(emailContent);
    console.log('=====================================');
    
    // Return success even without email service configured
    return NextResponse.json({ 
      success: true, 
      message: 'Contact request received and logged' 
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}