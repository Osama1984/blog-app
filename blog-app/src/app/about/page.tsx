import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">About Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Welcome to Our Blog
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We&apos;re passionate about sharing knowledge, insights, and stories that inspire and educate our community.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Our Mission</h3>
              <p className="mt-4 text-gray-600">
                Our mission is to create a platform where ideas flourish, knowledge is shared freely, 
                and communities can come together to learn from one another. We believe in the power 
                of storytelling and the impact that well-crafted content can have on people&apos;s lives.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">What We Do</h3>
              <p className="mt-4 text-gray-600">
                We publish high-quality articles on technology, design, business, and more. Our content 
                is created by industry experts and passionate writers who want to share their expertise 
                with the world. From tutorials to thought leadership pieces, we cover it all.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Our Values</h3>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="h-6 w-6 flex-shrink-0 text-blue-600">•</span>
                  <span className="ml-2">Quality content that adds real value</span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 flex-shrink-0 text-blue-600">•</span>
                  <span className="ml-2">Inclusive and welcoming community</span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 flex-shrink-0 text-blue-600">•</span>
                  <span className="ml-2">Continuous learning and improvement</span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 flex-shrink-0 text-blue-600">•</span>
                  <span className="ml-2">Transparency and authenticity</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">Join Our Community</h3>
              <p className="mt-4 text-gray-600">
                Whether you&apos;re a seasoned professional or just starting your journey, there&apos;s a place 
                for you in our community. Subscribe to our newsletter, engage with our content, and 
                connect with like-minded individuals.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
          <div className="text-center">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Our Story</h3>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Founded in 2024, our blog started as a simple idea: create a space where quality content 
              meets passionate readership. What began as a small project has grown into a thriving 
              community of writers, readers, and learners who share a common goal of continuous growth 
              and knowledge sharing.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Today, we continue to evolve, always listening to our community and adapting to meet 
              their needs. Our commitment to excellence remains unwavering as we look toward the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
