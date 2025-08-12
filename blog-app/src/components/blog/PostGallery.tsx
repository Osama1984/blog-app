'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageModal from '@/components/ui/ImageModal'

interface PostImage {
  id: string
  url: string
  alt: string | null
  caption: string | null
  order: number
}

interface PostGalleryProps {
  images: PostImage[]
  postTitle: string
}

export default function PostGallery({ images, postTitle }: PostGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<PostImage | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Gallery</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group cursor-pointer">
              <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={image.alt || postTitle}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  onClick={() => setSelectedImage(image)}
                />
              </div>
              {image.caption && (
                <p className="mt-2 text-sm text-gray-600 text-center">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <ImageModal
        src={selectedImage?.url || ''}
        alt={selectedImage?.alt || postTitle}
        caption={selectedImage?.caption || undefined}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}
