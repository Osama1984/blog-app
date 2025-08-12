'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/ui/FileUpload'
import { 
  XMarkIcon,
  PlusIcon,
  CheckIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

interface CategoryFormProps {
  category?: {
    id: string
    name: string
    slug: string
    description?: string | null
    color?: string | null
    image?: string | null
  }
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function CategoryForm({ category, isOpen, onClose, onSuccess }: CategoryFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#6366f1',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string, name: string}>>([])

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      const formDataUpload = new FormData()
      files.forEach(file => formDataUpload.append('files', file))
      formDataUpload.append('type', 'categories')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const result = await response.json()
      if (result.success && result.files.length > 0) {
        const uploadedFile = result.files[0]
        setFormData(prev => ({ ...prev, image: uploadedFile.url }))
        setUploadedFiles([{ url: uploadedFile.url, name: uploadedFile.name }])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload category image')
    }
  }

  const handleFileRemove = () => {
    setFormData(prev => ({ ...prev, image: '' }))
    setUploadedFiles([])
  }

  // Reset form when category or isOpen changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: category?.name || '',
        slug: category?.slug || '',
        description: category?.description || '',
        color: category?.color || '#6366f1',
        image: category?.image || ''
      })
      // Set existing image if available
      if (category?.image) {
        setUploadedFiles([{ url: category.image, name: 'Category Image' }])
      } else {
        setUploadedFiles([])
      }
      setError('')
      setSuccess('')
    }
  }, [category, isOpen])

  // Auto-generate slug from name (only for new categories)
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-generate slug for new categories and if slug is empty
      slug: !category && !prev.slug ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const url = category 
        ? `/api/admin/categories/${category.id}`
        : '/api/admin/categories'
      
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(result.message)
        router.refresh()
        
        // Close form after a brief success message
        setTimeout(() => {
          onClose()
          onSuccess?.()
        }, 1000)
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Error submitting form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category ? 'Edit Category' : 'Create New Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-700 dark:text-red-400">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckIcon className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm text-green-700 dark:text-green-400">{success}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Category name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="category-slug"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="h-10 w-16 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="#6366f1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Image
            </label>
            <FileUpload
              onFilesSelected={handleFileUpload}
              onFilesRemoved={handleFileRemove}
              existingFiles={uploadedFiles}
              accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
              maxFiles={1}
              maxSize={5 * 1024 * 1024}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {category ? <CheckIcon className="h-4 w-4 mr-2" /> : <PlusIcon className="h-4 w-4 mr-2" />}
                  {category ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
