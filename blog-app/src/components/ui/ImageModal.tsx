'use client'

import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ImageModalProps {
  src: string
  alt: string
  caption?: string
  isOpen: boolean
  onClose: () => void
}

export default function ImageModal({ src, alt, caption, isOpen, onClose }: ImageModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-5xl max-h-[90vh] mx-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-8 w-8" />
        </button>
        
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={800}
            className="max-h-[80vh] w-auto object-contain rounded-lg"
          />
          {caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
              <p className="text-sm text-center">{caption}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  )
}
