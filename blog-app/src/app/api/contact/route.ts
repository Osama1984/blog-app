import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'

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
    
    // Create a transporter (using environment variables for email configuration)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@blogapp.com',
      to: process.env.CONTACT_EMAIL || 'contact@blogapp.com',
      subject: `Contact Form: ${validatedData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Subject:</strong> ${validatedData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>This message was sent from the contact form on your blog.</small></p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Subject: ${validatedData.subject}
        
        Message:
        ${validatedData.message}
        
        ---
        This message was sent from the contact form on your blog.
      `,
    }

    // Send auto-reply to the user
    const autoReplyOptions = {
      from: process.env.EMAIL_FROM || 'noreply@blogapp.com',
      to: validatedData.email,
      subject: 'Thank you for contacting us',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${validatedData.name},</p>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p><em>"${validatedData.message}"</em></p>
        <p>Best regards,<br>The Blog App Team</p>
      `,
      text: `
        Thank you for your message!
        
        Dear ${validatedData.name},
        
        We have received your message and will get back to you as soon as possible.
        
        Your message:
        "${validatedData.message}"
        
        Best regards,
        The Blog App Team
      `,
    }

    // Send emails (only if email configuration is available)
    if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
      try {
        await transporter.sendMail(mailOptions)
        await transporter.sendMail(autoReplyOptions)
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue without failing the request
      }
    }

    // For development, log the contact form submission
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
