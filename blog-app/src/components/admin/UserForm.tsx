'use client'

import React, { useState, useEffect } from 'react'
import { Role } from '@prisma/client'
import FileUpload from '@/components/ui/FileUpload'
import { US_STATES } from '@/lib/constants/states'

// Define extended user type to match our schema
interface ExtendedUser {
  id: string
  name: string | null
  email: string
  emailVerified: Date | null
  image: string | null
  profileImage: string | null
  bio: string | null
  phone: string | null
  address: string | null
  zipCode: string | null
  state: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

interface UserFormProps {
  user?: ExtendedUser | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

interface UserFormData {
  name: string
  email: string
  role: Role
  bio: string
  image: string
  profileImage: string
  phone: string
  address: string
  zipCode: string
  state: string
}

export default function UserForm({ user, isOpen, onClose, onSave }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'USER',
    bio: '',
    image: '',
    profileImage: '',
    phone: '',
    address: '',
    zipCode: '',
    state: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<Array<{url: string, name: string}>>([])

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('type', 'users')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success && result.files.length > 0) {
        const uploadedFile = result.files[0]
        setFormData(prev => ({ ...prev, profileImage: uploadedFile.url }))
        setUploadedFiles([{ url: uploadedFile.url, name: uploadedFile.name }])
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Failed to upload profile image')
    }
  }

  const handleFileRemove = () => {
    setFormData(prev => ({ ...prev, profileImage: '' }))
    setUploadedFiles([])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Reset form when user or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name || '',
          email: user.email,
          role: user.role,
          bio: user.bio || '',
          image: user.image || '',
          profileImage: user.profileImage || '',
          phone: user.phone || '',
          address: user.address || '',
          zipCode: user.zipCode || '',
          state: user.state || ''
        })
        // Set existing profile image if available
        if (user.profileImage) {
          setUploadedFiles([{ url: user.profileImage, name: 'Profile Image' }])
        } else {
          setUploadedFiles([])
        }
      } else {
        setFormData({
          name: '',
          email: '',
          role: 'USER',
          bio: '',
          image: '',
          profileImage: '',
          phone: '',
          address: '',
          zipCode: '',
          state: ''
        })
        setUploadedFiles([])
      }
      setError('')
    }
  }, [user, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const url = user 
        ? `/api/admin/users/${user.id}`
        : '/api/admin/users'
      
      const method = user ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        onSave()
        onClose()
      } else {
        setError(result.error || 'Failed to save user')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      setError('Failed to save user')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? 'Edit User' : 'Create New User'}
          </h2>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form id="user-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <FileUpload
                    onFilesSelected={handleFileUpload}
                    onFilesRemoved={handleFileRemove}
                    existingFiles={uploadedFiles}
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="12345"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select State</option>
                      {US_STATES.map((state) => (
                        <option key={state.value} value={state.value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio field - full width */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  )
}
