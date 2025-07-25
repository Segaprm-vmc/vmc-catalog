import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ProductGallery } from '@/components/ProductGallery'
import { CharacteristicsTable } from '@/components/CharacteristicsTable'

interface ProductPageProps {
  params: Promise<{ category: string; product: string }>
}

async function getProduct(categorySlug: string, productSlug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  const products = await res.json()
  return products.find((product: any) => 
    product.slug === productSlug && product.category.slug === categorySlug
  )
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, product } = await params
  const productData = await getProduct(category, product)
  
  if (!productData) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-red-600">Главная</Link>
        <span>/</span>
        <Link href={`/${category}`} className="hover:text-red-600">
          {productData.category.name}
        </Link>
        <span>/</span>
        <span className="text-gray-900">{productData.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <ProductGallery images={productData.images} productName={productData.name} />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-red-600 font-medium">
                {productData.category.name}
              </span>
              <span className="text-xs text-gray-500">
                #{productData.id}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {productData.name}
            </h1>
            
            <p className="text-gray-600 leading-relaxed">
              {productData.description}
            </p>
          </div>

          {/* Key Characteristics */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Основные характеристики
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {productData.characteristics
                .filter((c: any) => ['displacement', 'power', 'max_speed', 'fuel_tank_volume'].includes(c.name))
                .map((char: any) => (
                  <div key={char.name} className="flex justify-between">
                    <span className="text-gray-600">
                      {char.name === 'displacement' && 'Объем двигателя'}
                      {char.name === 'power' && 'Мощность'}
                      {char.name === 'max_speed' && 'Макс. скорость'}
                      {char.name === 'fuel_tank_volume' && 'Объем бака'}
                    </span>
                    <span className="font-medium text-gray-900">
                      {char.value}
                      {char.name === 'displacement' && ' см³'}
                      {char.name === 'max_speed' && ' км/ч'}
                      {char.name === 'fuel_tank_volume' && ' л'}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Link href="/compare" className="btn-secondary">
              Добавить к сравнению
            </Link>
            <Link href={`/${category}`} className="btn-primary">
              Все товары категории
            </Link>
          </div>
        </div>
      </div>

      {/* Full Characteristics */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Полные характеристики
        </h2>
        <CharacteristicsTable characteristics={productData.characteristics} />
      </div>
    </div>
  )
} 