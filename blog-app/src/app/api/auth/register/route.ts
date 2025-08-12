import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        zipCode: validatedData.zipCode || null,
        state: validatedData.state || null,
        bio: validatedData.bio || null,
        profileImage: validatedData.profileImage || null,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        zipCode: true,
        state: true,
        bio: true,
        profileImage: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      success: true,
      user,
      message: 'User created successfully'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
