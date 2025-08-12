import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Pagination from '@/components/ui/Pagination'

// Simple date formatting function
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const postsPerPage = 12
  const skip = (currentPage - 1) * postsPerPage

  const [posts, totalPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
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
      orderBy: {
        publishedAt: 'desc',
      },
      skip,
      take: postsPerPage,
    }),
    prisma.post.count({
      where: {
        status: 'PUBLISHED',
      },
    })
  ])

  const totalPages = Math.ceil(totalPosts / postsPerPage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Our</span> Blog
          </h2>
          <p className="mt-6 text-xl leading-8 text-slate-600 dark:text-slate-300">
            Learn about the latest trends in technology, design, and business.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 p-6 border border-purple-100 dark:border-slate-700 flex flex-col justify-between h-full"
            >
              <div className="flex items-center gap-x-4 text-sm mb-4">
                <time dateTime={post.publishedAt?.toISOString()} className="text-slate-500 dark:text-slate-400">
                  {post.publishedAt && formatDate(new Date(post.publishedAt))}
                </time>
                {post.categories.map(({ category }) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                    className="relative z-10 rounded-full px-3 py-1.5 font-medium text-white text-xs transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: category.color || '#8B5CF6' }}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              {/* Cover Image */}
              {post.coverImage && (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={240}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              
              <div className="group relative flex-grow">
                <h3 className="text-xl font-bold leading-7 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 mb-3">
                  <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="line-clamp-3 text-base leading-6 text-slate-600 dark:text-slate-300">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-x-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    {post.author?.image ? (
                      <Image
                        src={post.author.image}
                        alt={post.author.name || 'Author'}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">
                        {post.author?.name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {post.author?.name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-x-4 text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post._count.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {post._count.likes}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.slug}`}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full transition-colors duration-200 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/blog"
        />
      </div>
    </div>
  )
}
