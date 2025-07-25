import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  slug: string
  description: string
  images: string[]
  category: {
    name: string
    slug: string
  }
  characteristics: Array<{
    name: string
    value: string
  }>
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Товары не найдены</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const mainImage = product.images && product.images.length > 0 
          ? product.images[0] 
          : 'https://via.placeholder.com/400x225/CCCCCC/666666?text=VMC'
        const displacement = product.characteristics?.find(c => c.name === 'displacement')?.value
        const power = product.characteristics?.find(c => c.name === 'power')?.value

        return (
          <Link 
            key={product.id} 
            href={`/${product.category.slug}/${product.slug}`}
            className="card card-hover group"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              <Image
                src={mainImage}
                alt={product.name}
                width={400}
                height={225}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-red-600 font-medium">
                  {product.category.name}
                </span>
                <span className="text-xs text-gray-500">
                  #{product.id}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                {displacement && (
                  <span>Объем: {displacement} см³</span>
                )}
                {power && (
                  <span>Мощность: {power}</span>
                )}
              </div>
              
              <div className="mt-4 flex items-center text-red-600 text-sm font-medium">
                Подробнее
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
} 