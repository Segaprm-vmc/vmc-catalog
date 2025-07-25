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
      {/* Hero Section */}
      <div className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Каталог мототехники VMC
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Изучайте характеристики и особенности товаров VMC. 
          Используйте поиск для быстрого нахождения нужной модели.
        </p>
        
        <SearchBar />
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Все товары
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {products.length} товаров
          </span>
        </div>
        
        <ProductGrid products={products} />
      </div>
    </div>
  )
} 