'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import MDEditor from '@uiw/react-md-editor'
import FileUpload from '@/components/ui/FileUpload'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  image?: string
  posts: { id: string }[]
}

interface Tag {
  id: string
  name: string
  slug: string
  posts: { id: string }[]
}

interface FileUploadResult {
  url: string
  name: string
  size: number
}

interface UploadResponse {
  success: boolean
  files: FileUploadResult[]
}

export default function CreatePost() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryIds: [] as string[],
    tagIds: [] as string[],
    featured: false,
    status: 'DRAFT'
  })
  const [coverImageFiles, setCoverImageFiles] = useState<Array<{url: string, name: string}>>([])
  const [additionalImageFiles, setAdditionalImageFiles] = useState<Array<{url: string, name: string}>>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  // Fetch categories and tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/tags')
        ])
        
        const categoriesData = await categoriesRes.json()
        const tagsData = await tagsRes.json()
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
        
        if (tagsData.success) {
          setTags(tagsData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load categories and tags')
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  const handleTagChange = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const handleCoverImageUpload = async (files: File[]) => {
    const file = files[0]
    if (!file) return

    const formDataUpload = new FormData()
    formDataUpload.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const result: UploadResponse = await response.json()
      if (result.success) {
        setCoverImageFiles([{ url: result.files[0].url, name: result.files[0].name }])
        toast.success('Cover image uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading cover image:', error)
      toast.error('Failed to upload cover image')
    }
  }

  const handleAdditionalImagesUpload = async (files: File[]) => {
    if (files.length === 0) return

    const formDataUpload = new FormData()
    files.forEach(file => {
      formDataUpload.append('files', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const result: UploadResponse = await response.json()
      if (result.success) {
        setAdditionalImageFiles(prev => [
          ...prev, 
          ...result.files.map((f: FileUploadResult) => ({ url: f.url, name: f.name }))
        ])
        toast.success('Images uploaded successfully')
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      toast.error('Failed to upload images')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in the title and content')
      return
    }

    if (!session?.user?.id) {
      toast.error('User not authenticated')
      return
    }

    setIsSubmitting(true)

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      const submitData = {
        ...formData,
        slug,
        authorId: session.user.id,
        coverImage: coverImageFiles[0]?.url || null,
        images: additionalImageFiles.map((img, index) => ({
          url: img.url,
          alt: '',
          caption: '',
          order: index
        }))
      }

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Post created successfully!')
        router.push('/dashboard/posts')
      } else {
        toast.error(result.error || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Create New Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title..."
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the post..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <div className="mt-1">
              <MDEditor
                value={formData.content}
                onChange={(val?: string) => setFormData(prev => ({ ...prev, content: val || '' }))}
                preview="edit"
                height={400}
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <FileUpload
              onFilesSelected={handleCoverImageUpload}
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
              maxFiles={1}
              multiple={false}
              existingFiles={coverImageFiles}
              className="w-full"
            />
          </div>

          {/* Additional Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images
            </label>
            <FileUpload
              onFilesSelected={handleAdditionalImagesUpload}
              accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'] }}
              maxFiles={10}
              multiple={true}
              existingFiles={additionalImageFiles}
              className="w-full"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{tag.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Featured post
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
