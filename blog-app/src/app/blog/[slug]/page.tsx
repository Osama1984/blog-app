import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import PostGallery from '@/components/blog/PostGallery'
import CoverImage from '@/components/blog/CoverImage'
import CommentSection from '@/components/CommentSection'

// Simple date formatting function
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          bio: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      images: {
        orderBy: {
          order: 'asc',
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Process markdown content
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(post.content)
  
  const contentHtml = processedContent.toString()

  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <div className="mb-8">
          <div className="flex items-center gap-x-4 text-xs mb-4">
            <time dateTime={post.publishedAt?.toISOString()} className="text-gray-500">
              {post.publishedAt && formatDate(new Date(post.publishedAt))}
            </time>
            {post.categories.map(({ category }) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="relative z-10 rounded-full px-3 py-1.5 font-medium text-white text-xs"
                style={{ backgroundColor: category.color || '#6b7280' }}
              >
                {category.name}
              </Link>
            ))}
          </div>
          
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="mt-6 text-xl leading-8 text-gray-600">
              {post.excerpt}
            </p>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <CoverImage
              src={post.coverImage}
              alt={post.title}
              title={post.title}
            />
          )}

          <div className="mt-8 flex items-center gap-x-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              {post.author?.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name || 'Author'}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <span className="text-lg font-medium text-gray-600">
                  {post.author?.name?.charAt(0) || 'A'}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {post.author?.name || 'Anonymous'}
              </p>
              {post.author?.bio && (
                <p className="text-sm text-gray-600">{post.author.bio}</p>
              )}
              <div className="flex items-center gap-x-4 text-sm text-gray-600 mt-1">
                <span>{post._count.comments} comments</span>
                <span>{post._count.likes} likes</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="prose prose-lg prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Additional Post Images Gallery */}
        <PostGallery images={post.images} postTitle={post.title} />

        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments and Likes Section */}
        <CommentSection postId={post.id} />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/blog"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </div>
  )
}
