import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Welcome to Our Blog
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover amazing stories, insights, and ideas from our community of writers.
              Join us on a journey of learning and inspiration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/blog"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Read Blog Posts
              </Link>
              <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Latest Posts</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Featured Articles
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Check out our most recent and popular blog posts.
            </p>
          </div>
          
          {/* Placeholder for featured posts */}
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sample Blog Post {item}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This is a placeholder for a blog post excerpt. It will be replaced with actual content.
                    </p>
                    <Link
                      href={`/blog/sample-post-${item}`}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
