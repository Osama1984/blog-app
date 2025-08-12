'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Have a question or want to get in touch? We&rsquo;d love to hear from you.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="lg:pr-8 animate-slide-in-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start hover-float">
                  <EnvelopeIcon className="h-6 w-6 text-primary mt-1" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">hello@blogapp.com</p>
                  </div>
                </div>
                
                <div className="flex items-start hover-float">
                  <PhoneIcon className="h-6 w-6 text-primary mt-1" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start hover-float">
                  <MapPinIcon className="h-6 w-6 text-primary mt-1" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      123 Blog Street<br />
                      Content City, CC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Office Hours</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1 animate-slide-in-right">
              <div className="glass rounded-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-white">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm transition-colors"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="rounded-md bg-green-500/20 p-4 animate-fade-in">
                    <div className="text-sm text-green-700 dark:text-green-300">
                      Thank you for your message! We will get back to you soon.
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-md bg-red-500/20 p-4 animate-fade-in">
                    <div className="text-sm text-red-700 dark:text-red-300">
                      There was an error sending your message. Please try again.
                    </div>
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
