'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function ProductImage({ src, alt, width, height, className }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

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
    return `https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=VMC`
  }

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(`https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=VMC`)
    }
  }

  return (
    <Image
      src={getImageUrl(imgSrc)}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  )
} 