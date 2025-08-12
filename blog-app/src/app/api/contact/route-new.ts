import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { sendEmailWithAzure, isAzureEmailConfigured } from '@/lib/azure-email'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)

    // Prepare email content
    const emailSubject = `Contact Form: ${validatedData.subject}`;
    const htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${validatedData.name}</p>
      <p><strong>Email:</strong> ${validatedData.email}</p>
      <p><strong>Subject:</strong> ${validatedData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>This message was sent from the contact form on your blog.</small></p>
    `;
    const textContent = `
      New Contact Form Submission
      
      Name: ${validatedData.name}
      Email: ${validatedData.email}
      Subject: ${validatedData.subject}
      Message: ${validatedData.message}
    `;

    const recipientEmail = process.env.CONTACT_EMAIL || 'contact@marmil.co';

    // Try Azure Communication Services first
    if (isAzureEmailConfigured()) {
      try {
        await sendEmailWithAzure({
          to: recipientEmail,
          subject: emailSubject,
          htmlContent,
          textContent
        });

        // Also send confirmation email to user
        const confirmationHtml = `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${validatedData.name},</p>
          <p>We have received your message and will get back to you soon.</p>
          <p><strong>Your message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p>Best regards,<br>The Blog Team</p>
        `;
        
        await sendEmailWithAzure({
          to: validatedData.email,
          subject: "Thank you for your message",
          htmlContent: confirmationHtml
        });

        return NextResponse.json({ 
          success: true, 
          message: 'Message sent successfully using Azure Communication Services!' 
        });
      } catch (azureError) {
        console.error('Azure email failed, falling back to SMTP:', azureError);
        // Fall through to SMTP fallback
      }
    }

    // Fallback to SMTP if Azure is not configured or failed
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      })

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@marmil.co',
        to: recipientEmail,
        subject: emailSubject,
        html: htmlContent,
        text: textContent
      }

      const confirmationMailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@marmil.co',
        to: validatedData.email,
        subject: "Thank you for your message",
        html: `
          <h2>Thank you for contacting us!</h2>
          <p>Dear ${validatedData.name},</p>
          <p>We have received your message and will get back to you soon.</p>
          <p><strong>Your message:</strong></p>
          <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p>Best regards,<br>The Blog Team</p>
        `
      }

      // Send both emails
      await transporter.sendMail(mailOptions)
      await transporter.sendMail(confirmationMailOptions)

      return NextResponse.json({ 
        success: true, 
        message: 'Message sent successfully via SMTP!' 
      });
    }

    // If no email service is configured
    return NextResponse.json({ 
      success: false, 
      error: 'Email service not configured. Please try again later.' 
    }, { status: 500 });

  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid form data',
        details: error.issues
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    }, { status: 500 })
  }
}
