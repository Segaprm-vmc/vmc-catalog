import Link from 'next/link'
import { CategoryGrid } from '@/components/CategoryGrid'

async function getCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }
  
  return res.json()
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Каталог мототехники VMC
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Изучайте характеристики и особенности товаров VMC. 
          Выберите категорию для просмотра доступных моделей.
        </p>
      </div>

      <CategoryGrid categories={categories} />

      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Быстрый поиск
        </h2>
        <p className="text-gray-600 mb-6">
          Не можете найти нужную модель? Используйте поиск по названию товара.
        </p>
        <Link href="/search" className="btn-primary">
          Найти товар
        </Link>
      </div>
    </div>
  )
} 