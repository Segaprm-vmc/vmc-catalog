import { SearchBar } from '@/components/SearchBar'
import { ProductGrid } from '@/components/ProductGrid'

async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  return res.json()
}

export default async function HomePage() {
  const products = await getAllProducts()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Каталог мототехники VMC
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Изучайте характеристики и особенности товаров VMC. 
          Используйте поиск для быстрого нахождения нужной модели.
        </p>
        
        <SearchBar />
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Все товары ({products.length})
        </h2>
        <ProductGrid products={products} />
      </div>
    </div>
  )
} 