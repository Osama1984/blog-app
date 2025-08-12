'use client'

import React, { useCallback, useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { 
  CloudArrowUpIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  onFilesRemoved?: (index: number) => void
  accept?: Record<string, string[]>
  maxFiles?: number
  maxSize?: number
  multiple?: boolean
  disabled?: boolean
  existingFiles?: Array<{ url: string; name: string }>
  className?: string
}

interface PreviewFile {
  file: File
  preview: string
}

export default function FileUpload({
  onFilesSelected,
  onFilesRemoved,
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
  },
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = true,
  disabled = false,
  existingFiles = [],
  className = ''
}: FileUploadProps) {
  const [files, setFiles] = useState<PreviewFile[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (disabled) return

    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setFiles(prev => {
      const updated = multiple ? [...prev, ...newFiles] : newFiles
      return updated.slice(0, maxFiles)
    })

    onFilesSelected(acceptedFiles)
  }, [onFilesSelected, multiple, maxFiles, disabled])

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      // Revoke the preview URL to free memory
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
    
    if (onFilesRemoved) {
      onFilesRemoved(index)
    }
  }

  const removeExistingFile = (index: number) => {
    if (onFilesRemoved) {
      onFilesRemoved(index)
    }
  }

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections
  } = useDropzone({
    onDrop,
    accept,
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    multiple,
    disabled
  })

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  return (
    <div className={className}>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive && !isDragReject ? 'border-blue-500 bg-blue-50' : ''}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${!isDragActive && !isDragReject ? 'border-gray-300' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2">
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400" />
          
          {isDragActive ? (
            <p className="text-blue-600">Drop the files here...</p>
          ) : (
            <div className="space-y-1">
              <p className="text-gray-600">
                Drag and drop files here, or{' '}
                <span className="text-blue-600 font-medium">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                {multiple ? `Up to ${maxFiles} files` : 'Single file'} • Max {Math.round(maxSize / (1024 * 1024))}MB each
              </p>
              <p className="text-xs text-gray-400">
                Supported: {Object.values(accept).flat().join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h4 className="text-sm font-medium text-red-800 mb-2">Upload errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {fileRejections.map(({ file, errors }, index) => (
              <li key={index}>
                <strong>{file.name}</strong>:
                <ul className="ml-4">
                  {errors.map(error => (
                    <li key={error.code}>• {error.message}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current files:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {existingFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  {file.url ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeExistingFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                
                <p className="mt-1 text-xs text-gray-600 truncate" title={file.name}>
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview New Files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">New files to upload:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {files.map((fileObj, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fileObj.preview}
                    alt={fileObj.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                
                <p className="mt-1 text-xs text-gray-600 truncate" title={fileObj.file.name}>
                  {fileObj.file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(fileObj.file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
