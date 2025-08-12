import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// Simple date formatting function
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await prisma.category.findUnique({
    where: {
      slug: slug,
    },
    include: {
      posts: {
        where: {
          post: {
            status: 'PUBLISHED',
          },
        },
        include: {
          post: {
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
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
              _count: {
                select: {
                  comments: true,
                  likes: true,
                },
              },
            },
          },
        },
        orderBy: {
          post: {
            publishedAt: 'desc',
          },
        },
      },
    },
  })

  if (!category) {
    notFound()
  }

  const posts = category.posts.map(({ post }) => post)

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: category.color || '#6366f1' }}
            >
              {category.name}
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {category.name} Posts
          </p>
          {category.description && (
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {category.description}
            </p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex max-w-xl flex-col items-start justify-between"
              >
                <div className="flex items-center gap-x-4 text-xs">
                  <time dateTime={post.publishedAt?.toISOString()} className="text-gray-500">
                    {post.publishedAt && formatDate(new Date(post.publishedAt))}
                  </time>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {post.author?.image ? (
                      <img
                        src={post.author.image}
                        alt={post.author.name || 'Author'}
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {post.author?.name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      {post.author?.name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-x-4 text-gray-600">
                      <span>{post._count.comments} comments</span>
                      <span>{post._count.likes} likes</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="text-xs text-gray-600 hover:text-gray-900 bg-gray-100 px-2 py-1 rounded"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <p className="text-gray-500">No posts found in this category yet.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-blue-600 hover:text-blue-500 font-medium"
            >
              Browse all posts →
            </Link>
          </div>
        )}

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <Link
            href="/categories"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to all categories
          </Link>
        </div>
      </div>
    </div>
  )
}
