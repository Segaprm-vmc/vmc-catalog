'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductGrid } from '@/components/ProductGrid'

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

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Array<{ id: number; name: string; slug: string }>>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/categories`)
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    let filtered = products

    // Фильтр по поисковому запросу
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Фильтр по категории
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category.slug === categoryFilter)
    }

    setFilteredProducts(filtered)
  }, [searchTerm, categoryFilter, products])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Поиск товаров</h1>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Поиск товаров</h1>
        <p className="text-gray-600 mb-8">
          Найдите нужную модель мототехники VMC по названию или характеристикам
        </p>
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Поиск по названию */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Поиск по названию
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Введите название товара..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Фильтр по категории */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Статистика */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Найдено товаров: <span className="font-semibold text-gray-900">{filteredProducts.length}</span>
            {searchTerm && (
              <>
                {' '}по запросу "<span className="font-semibold text-red-600">{searchTerm}</span>"
              </>
            )}
            {categoryFilter && (
              <>
                {' '}в категории "<span className="font-semibold text-red-600">
                  {categories.find(c => c.slug === categoryFilter)?.name}
                </span>"
              </>
            )}
          </p>
        </div>
      </div>

      {/* Результаты поиска */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
          <p className="text-gray-600 mb-6">
            Попробуйте изменить поисковый запрос или фильтры
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setCategoryFilter('')
            }}
            className="btn-primary"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}

      {/* Быстрые ссылки */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Популярные категории</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategoryFilter(category.slug)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                categoryFilter === category.slug
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">
                {products.filter(p => p.category.slug === category.slug).length} товаров
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 