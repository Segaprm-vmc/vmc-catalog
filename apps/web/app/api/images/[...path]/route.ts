import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join('/')
    
    // Проксируем запрос к API серверу
    const apiUrl = `http://localhost:8000/uploads/${path}`
    
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      // Если изображение не найдено, возвращаем placeholder
      const placeholderUrl = `https://via.placeholder.com/400x225/CCCCCC/666666?text=VMC+${path}`
      const placeholderResponse = await fetch(placeholderUrl)
      const blob = await placeholderResponse.blob()
      
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
    
    const blob = await response.blob()
    
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
} 