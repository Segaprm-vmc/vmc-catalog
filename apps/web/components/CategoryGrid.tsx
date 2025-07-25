import Link from 'next/link'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  products: Array<{ id: number; name: string }>
}

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/${category.slug}`}
          className="card card-hover group"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                {category.name}
              </h3>
              <span className="text-sm text-gray-500">
                {category.products.length} товаров
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              {category.description}
            </p>
            <div className="flex items-center text-red-600 text-sm font-medium">
              Смотреть товары
              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
} 