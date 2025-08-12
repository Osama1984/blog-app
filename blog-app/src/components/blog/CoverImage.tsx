'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageModal from '@/components/ui/ImageModal'

interface CoverImageProps {
  src: string
  alt: string
  title: string
}

export default function CoverImage({ src, alt, title }: CoverImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="mt-8 mb-8 cursor-pointer group">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={400}
          className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          priority
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <ImageModal
        src={src}
        alt={alt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
