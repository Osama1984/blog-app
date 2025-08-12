import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const tagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  slug: z.string().min(1, 'Slug is required').max(50),
  description: z.string().optional(),
  color: z.string().optional(),
})

// GET /api/admin/tags - List all tags
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        posts: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = tagSchema.parse(body)

    // Check if slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag with this slug already exists' },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: validatedData,
      include: {
        posts: {
          select: { id: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag created successfully'
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating tag:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}
