'use client'

import { useState } from 'react'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus('idle')
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
            Stay in the Loop
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-8 text-white/90 mb-12">
            Get the latest blog posts, industry insights, and exclusive content delivered directly to your inbox.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border-0 bg-white/10 backdrop-blur-sm px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 placeholder:text-white/75 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-purple-600 hover:bg-white/90 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 font-semibold rounded-lg transition-all duration-200 ease-out hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transform hover:scale-105"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Subscribe
                  </div>
                )}
              </button>
            </div>
          </form>
          
          {status === 'success' && (
            <div className="mt-6 rounded-lg bg-green-500/20 backdrop-blur-sm p-4 border border-green-400/30">
              <div className="text-sm text-white font-medium">
                {message}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 rounded-lg bg-red-500/20 backdrop-blur-sm p-4 border border-red-400/30">
              <div className="text-sm text-white font-medium">
                {message}
              </div>
            </div>
          )}
          
          <p className="mt-8 text-sm leading-6 text-white/80">
            We care about your data. Read our{' '}
            <a href="/privacy" className="font-semibold text-white hover:text-white/90 transition-colors underline underline-offset-4">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
