import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const { email } = newsletterSchema.parse(body)
    
    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existingSubscription) {
      if (existingSubscription.status === 'SUBSCRIBED') {
        return NextResponse.json(
          { error: 'Email is already subscribed to the newsletter' },
          { status: 400 }
        )
      } else {
        // Resubscribe if previously unsubscribed
        await prisma.newsletter.update({
          where: { email },
          data: {
            status: 'SUBSCRIBED',
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        })
        
        return NextResponse.json(
          { message: 'Successfully resubscribed to newsletter' },
          { status: 200 }
        )
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: {
        email,
        status: 'SUBSCRIBED',
      },
    })

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const { email: validatedEmail } = newsletterSchema.parse({ email })
    
    // Find existing subscription
    const subscription = await prisma.newsletter.findUnique({
      where: { email: validatedEmail },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Email not found in newsletter list' },
        { status: 404 }
      )
    }

    if (subscription.status === 'UNSUBSCRIBED') {
      return NextResponse.json(
        { error: 'Email is already unsubscribed' },
        { status: 400 }
      )
    }

    // Update subscription status
    await prisma.newsletter.update({
      where: { email: validatedEmail },
      data: {
        status: 'UNSUBSCRIBED',
        unsubscribedAt: new Date(),
      },
    })

    return NextResponse.json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Newsletter unsubscription error:', error)
    return NextResponse.json(
      { error: 'Failed to unsubscribe from newsletter' },
      { status: 500 }
    )
  }
}
