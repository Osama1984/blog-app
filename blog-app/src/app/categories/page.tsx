import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import Pagination from '@/components/ui/Pagination'

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const categoriesPerPage = 12
  const skip = (currentPage - 1) * categoriesPerPage

  const [categories, totalCategories] = await Promise.all([
    prisma.category.findMany({
      include: {
        posts: {
          where: {
            post: {
              status: 'PUBLISHED',
            },
          },
          select: {
            post: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
      skip,
      take: categoriesPerPage,
    }),
    prisma.category.count()
  ])

  const totalPages = Math.ceil(totalCategories / categoriesPerPage)

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Explore</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Categories
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover content organized by topics that interest you most.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="group relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                {/* Background Image or Color */}
                {'image' in category && category['image' as keyof typeof category] ? (
                  <Image
                    src={category['image' as keyof typeof category] as string}
                    alt={category.name}
                    fill
                    className="absolute inset-0 -z-20 h-full w-full object-cover"
                  />
                ) : (
                  <div 
                    className="absolute inset-0 -z-20"
                    style={{ backgroundColor: category.color || '#8B5CF6' }}
                  />
                )}
                
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900/80 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <div className="mr-8">
                    {category.posts.length} {category.posts.length === 1 ? 'post' : 'posts'}
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <span className="absolute inset-0" />
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-2 text-sm leading-6 text-gray-300">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center">
              <p className="text-gray-500">No categories found.</p>
            </div>
          )}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/categories"
          />
        </div>
      </div>
    </div>
  )
}
