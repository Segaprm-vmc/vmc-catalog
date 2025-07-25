import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProductGrid } from '@/components/ProductGrid'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

async function getCategory(categorySlug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }
  
  const categories = await res.json()
  return categories.find((cat: any) => cat.slug === categorySlug)
}

async function getProducts(categoryId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`, {
    cache: 'force-cache'
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch products')
  }
  
  const products = await res.json()
  return products.filter((product: any) => product.categoryId === categoryId)
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryData = await getCategory(category)
  
  if (!categoryData) {
    notFound()
  }
  
  const products = await getProducts(categoryData.id)

  return (
    <div className="space-y-8">
      <div>
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/" className="hover:text-red-600">Главная</Link>
          <span>/</span>
          <span className="text-gray-900">{categoryData.name}</span>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryData.name}
        </h1>
        <p className="text-gray-600">
          {categoryData.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Товары ({products.length})
        </h2>
        <Link href="/search" className="btn-secondary">
          Поиск по всем товарам
        </Link>
      </div>

      <ProductGrid products={products} />
    </div>
  )
} 