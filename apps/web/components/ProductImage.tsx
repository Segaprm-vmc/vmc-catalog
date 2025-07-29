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
    
    // Если это загруженное изображение из /uploads/, используем API
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:8000${imageUrl}`
    }
    
    // Если это относительный путь, возвращаем placeholder
    if (imageUrl.startsWith('/')) {
      return `https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=VMC+Placeholder`
    }
    
    // Fallback на placeholder
    return `https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=VMC`
  }

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(`https://via.placeholder.com/${width}x${height}/CCCCCC/666666?text=VMC+Error`)
    }
  }

  const finalSrc = getImageUrl(imgSrc)

  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={finalSrc.includes('via.placeholder.com')}
    />
  )
} 