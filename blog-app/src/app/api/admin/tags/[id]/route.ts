import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const tagUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
})

// GET /api/admin/tags/[id] - Get specific tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        posts: {
          include: {
            post: {
              select: { id: true, title: true, slug: true, createdAt: true }
            }
          }
        }
      }
    })

    if (!tag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: tag
    })
  } catch (error) {
    console.error('Error fetching tag:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = tagUpdateSchema.parse(body)

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    })

    if (!existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Check if slug is taken by another tag
    if (validatedData.slug !== existingTag.slug) {
      const slugExists = await prisma.tag.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already taken by another tag' },
          { status: 400 }
        )
      }
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: validatedData,
      include: {
        posts: {
          include: {
            post: {
              select: { id: true, title: true, slug: true, createdAt: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: tag,
      message: 'Tag updated successfully'
    })
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

    console.error('Error updating tag:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/tags/[id] - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id },
      include: {
        posts: { select: { id: true } }
      }
    })

    if (!existingTag) {
      return NextResponse.json(
        { success: false, error: 'Tag not found' },
        { status: 404 }
      )
    }

    // Check if tag has posts
    if (existingTag.posts.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete tag with ${existingTag.posts.length} posts. Please remove the tag from posts first.` 
        },
        { status: 400 }
      )
    }

    await prisma.tag.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}
