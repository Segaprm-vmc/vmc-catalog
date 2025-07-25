import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    
    // Здесь можно добавить логику для получения изображений из базы данных
    // или файловой системы. Пока что возвращаем placeholder
    const placeholderUrl = `https://via.placeholder.com/400x225/CCCCCC/666666?text=VMC+${path}`
    
    const response = await fetch(placeholderUrl)
    const blob = await response.blob()
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
} 