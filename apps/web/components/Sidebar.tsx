'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, ChevronRightIcon, FolderIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
  products: Product[]
}

interface SidebarProps {
  categories: Category[]
}

export function Sidebar({ categories }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen overflow-y-auto shadow-sm">
      <div className="p-6">
        {/* Заголовок */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FolderIcon className="h-5 w-5 text-red-600 mr-2" />
            Категории
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Выберите категорию для просмотра товаров
          </p>
        </div>

        {/* Навигация */}
        <nav className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="space-y-1">
              {/* Кнопка категории */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
              >
                <div className="flex items-center">
                  <span className="mr-2">{category.name}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {category.products.length}
                  </span>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDownIcon className="h-4 w-4 text-red-600" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                )}
              </button>
              
              {/* Список товаров */}
              {expandedCategories.has(category.id) && (
                <div className="ml-4 space-y-1 border-l-2 border-red-200 pl-4">
                  {category.products.map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/${category.slug}/${product.slug}`}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>
                        {product.name}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Статистика */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div className="flex justify-between items-center">
              <span>Всего категорий:</span>
              <span className="font-medium">{categories.length}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Всего товаров:</span>
              <span className="font-medium">
                {categories.reduce((total, cat) => total + cat.products.length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 