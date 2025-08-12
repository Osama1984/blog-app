import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for settings update (using existing User fields)
const settingsSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  zipCode: z.string().optional(),
  state: z.string().optional()
})

// GET /api/user/settings - Get user settings
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      },
      select: {
        name: true,
        email: true,
        bio: true,
        phone: true,
        address: true,
        zipCode: true,
        state: true,
        profileImage: true,
        image: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/user/settings - Update user settings
export async function PUT(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = settingsSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: validatedData,
      select: {
        name: true,
        email: true,
        bio: true,
        phone: true,
        address: true,
        zipCode: true,
        state: true,
        profileImage: true,
        image: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
