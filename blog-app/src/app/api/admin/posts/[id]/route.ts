import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const postUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(200),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  featured: z.boolean().optional(),
  authorId: z.string().min(1, 'Author is required'),
  categoryIds: z.array(z.string()).optional().default([]),
  tagIds: z.array(z.string()).optional().default([]),
})

// GET /api/admin/posts/[id] - Get specific post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true, color: true }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true, slug: true }
            }
          }
        },
        comments: {
          select: { id: true, content: true, createdAt: true }
        },
        likes: {
          select: { id: true }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = postUpdateSchema.parse(body)

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Check if slug is taken by another post
    if (validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.post.findUnique({
        where: { slug: validatedData.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { success: false, error: 'Slug already taken by another post' },
          { status: 400 }
        )
      }
    }

    // Check if author exists
    const author = await prisma.user.findUnique({
      where: { id: validatedData.authorId }
    })

    if (!author) {
      return NextResponse.json(
        { success: false, error: 'Author not found' },
        { status: 400 }
      )
    }

    // Update post with transaction to handle categories and tags
    const post = await prisma.$transaction(async (tx) => {
      // Delete existing categories and tags
      await tx.postCategory.deleteMany({
        where: { postId: id }
      })
      
      await tx.postTag.deleteMany({
        where: { postId: id }
      })

      // Update post and create new categories and tags
      return await tx.post.update({
        where: { id },
        data: {
          title: validatedData.title,
          slug: validatedData.slug,
          excerpt: validatedData.excerpt,
          content: validatedData.content,
          status: validatedData.status,
          featured: validatedData.featured,
          authorId: validatedData.authorId,
          categories: {
            create: validatedData.categoryIds.map(categoryId => ({
              category: { connect: { id: categoryId } }
            }))
          },
          tags: {
            create: validatedData.tagIds.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        },
        include: {
          author: {
            select: { id: true, name: true, email: true }
          },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, slug: true, color: true }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true, slug: true }
              }
            }
          },
          comments: {
            select: { id: true }
          },
          likes: {
            select: { id: true }
          }
        }
      })
    })

    return NextResponse.json({
      success: true,
      data: post,
      message: 'Post updated successfully'
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

    console.error('Error updating post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: {
        comments: { select: { id: true } },
        likes: { select: { id: true } }
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    // Delete post and all related data using transaction
    await prisma.$transaction(async (tx) => {
      // Delete related data
      await tx.postCategory.deleteMany({ where: { postId: id } })
      await tx.postTag.deleteMany({ where: { postId: id } })
      await tx.comment.deleteMany({ where: { postId: id } })
      await tx.like.deleteMany({ where: { postId: id } })
      
      // Delete the post
      await tx.post.delete({ where: { id } })
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}
