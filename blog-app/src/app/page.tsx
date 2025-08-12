import Link from 'next/link'
import { NewsletterSignup } from '@/components/ui/NewsletterSignup'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-indigo-600/10"></div>
        <div className="relative px-6 pt-20 pb-32 lg:px-8 lg:pt-32 lg:pb-40">
          <div className="mx-auto max-w-4xl text-center">
            <AnimatedSection delay={0}>
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl lg:text-8xl mb-8">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Welcome to</span>
                <br />
                <span className="text-slate-900 dark:text-white">Our Blog</span>
              </h1>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <p className="mx-auto max-w-2xl text-xl leading-8 text-slate-600 dark:text-slate-300 mb-12">
                Discover amazing stories, insights, and ideas from our community of writers.
                Join us on a journey of learning and inspiration.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.4} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/blog"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-8 py-4 rounded-lg inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <span>Explore Articles</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link 
                href="/about" 
                className="bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-400 hover:bg-purple-50 dark:hover:bg-slate-700 font-semibold text-lg px-8 py-4 rounded-lg inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
              >
                <span>Learn More</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-purple-600 mb-4">Latest Posts</h2>
            <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl mb-6">
              Featured Articles
            </h3>
            <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">
              Check out our most recent and popular blog posts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article 
                key={item} 
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100 dark:border-slate-700"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-t-xl"></div>
                <div className="p-8">
                  <div className="flex items-center gap-x-4 text-xs mb-4">
                    <time className="text-slate-500 dark:text-slate-400">Mar 16, 2025</time>
                    <span className="relative z-10 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 font-medium text-purple-600 dark:text-purple-400">
                      Technology
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold leading-6 text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Sample Blog Post {item}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 line-clamp-3">
                    This is a placeholder for a blog post excerpt. It will be replaced with actual content that provides readers with a compelling preview.
                  </p>
                  <Link
                    href={`/blog/sample-post-${item}`}
                    className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-3 transition-all duration-300"
                  >
                    <span>Read more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section>
        <NewsletterSignup />
      </section>
    </div>
  )
}
