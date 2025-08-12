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

interface AuthorPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params
  const author = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      posts: {
        where: {
          status: 'PUBLISHED',
        },
        include: {
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
        orderBy: {
          publishedAt: 'desc',
        },
      },
    },
  })

  if (!author) {
    notFound()
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Author Header */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="flex justify-center mb-6">
            <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
              {author.image ? (
                <img
                  src={author.image}
                  alt={author.name || 'Author'}
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-600">
                  {author.name?.charAt(0) || 'A'}
                </span>
              )}
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {author.name || 'Anonymous'}
          </h1>
          
          <div className="mt-4 flex justify-center items-center space-x-4 text-sm text-gray-600">
            <span className="capitalize bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {author.role.toLowerCase()}
            </span>
            <span>{author.posts.length} published posts</span>
          </div>
          
          {author.bio && (
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {author.bio}
            </p>
          )}
        </div>

        {/* Author's Posts */}
        {author.posts.length > 0 ? (
          <div className="mx-auto mt-16">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">
              Posts by {author.name}
            </h2>
            
            <div className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {author.posts.map((post) => (
                <article
                  key={post.id}
                  className="flex max-w-xl flex-col items-start justify-between"
                >
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.publishedAt?.toISOString()} className="text-gray-500">
                      {post.publishedAt && formatDate(new Date(post.publishedAt))}
                    </time>
                    {post.categories.map(({ category }) => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.slug}`}
                        className="relative z-10 rounded-full px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                        style={{ backgroundColor: (category.color || '#6366f1') + '20', color: category.color || '#6366f1' }}
                      >
                        {category.name}
                      </Link>
                    ))}
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
                  <div className="relative mt-8 flex items-center gap-x-4 text-sm text-gray-600">
                    <span>{post._count.comments} comments</span>
                    <span>{post._count.likes} likes</span>
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
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-2xl text-center">
            <p className="text-gray-500">This author has not published any posts yet.</p>
          </div>
        )}

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <Link
            href="/authors"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            ← Back to all authors
          </Link>
        </div>
      </div>
    </div>
  )
}
