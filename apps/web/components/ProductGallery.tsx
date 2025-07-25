'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  const getImageUrl = (imageUrl: string) => {
    // Если это полный URL, используем его
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // Если это относительный путь, добавляем базовый URL
    if (imageUrl.startsWith('/')) {
      return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${imageUrl}`
    }
    
    // Fallback на placeholder
    return `https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC`
  }

  const processedImages = images?.map(getImageUrl) || []

  if (!processedImages || processedImages.length === 0) {
    return (
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Изображение отсутствует</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={processedImages[selectedImage]}
          alt={`${productName} - изображение ${selectedImage + 1}`}
          width={800}
          height={450}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://via.placeholder.com/800x450/CCCCCC/666666?text=VMC'
          }}
        />
      </div>

      {/* Thumbnails */}
      {processedImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {processedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? 'border-red-600' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} - миниатюра ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://via.placeholder.com/100x100/CCCCCC/666666?text=VMC'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
} 