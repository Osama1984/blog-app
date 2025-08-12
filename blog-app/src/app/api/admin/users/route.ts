import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
  bio: z.string().optional(),
  image: z.string().optional(),
})

// GET /api/admin/users - List all users (excluding soft deleted)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        // @ts-expect-error - deletedAt field exists in schema but not yet in types
        deletedAt: null // Only show non-deleted users
      },
      orderBy: { createdAt: 'desc' },
      include: {
        posts: {
          select: { id: true, title: true }
        },
        comments: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = userSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: validatedData,
      include: {
        posts: {
          select: { id: true, title: true }
        },
        comments: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('Error creating user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
