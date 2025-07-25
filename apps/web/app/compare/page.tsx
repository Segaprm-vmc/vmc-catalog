'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ComparisonTable } from '@/components/ComparisonTable'

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

interface Category {
  id: number
  name: string
  slug: string
}

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
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

  const addToComparison = (product: Product) => {
    if (selectedProducts.length >= 4) {
      alert('Можно сравнить максимум 4 товара')
      return
    }
    if (selectedProducts.find(p => p.id === product.id)) {
      alert('Этот товар уже добавлен к сравнению')
      return
    }
    setSelectedProducts([...selectedProducts, product])
  }

  const removeFromComparison = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
  }

  const clearComparison = () => {
    setSelectedProducts([])
  }

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category.slug === selectedCategory)
    : products

  const availableProducts = filteredProducts.filter(
    p => !selectedProducts.find(sp => sp.id === p.id)
  )

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Сравнение товаров</h1>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Сравнение товаров</h1>
        <p className="text-gray-600 mb-8">
          Выберите до 4 товаров для детального сравнения характеристик
        </p>
      </div>

      {/* Выбранные товары для сравнения */}
      {selectedProducts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Выбранные товары ({selectedProducts.length}/4)
            </h2>
            <button
              onClick={clearComparison}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Очистить все
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedProducts.map((product) => (
              <div key={product.id} className="relative border border-gray-200 rounded-lg p-4">
                <button
                  onClick={() => removeFromComparison(product.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-3">
                  <Image
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={200}
                    height={112}
                    className="object-cover w-full h-24 rounded-lg"
                  />
                </div>

                <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-red-600 mb-2">{product.category.name}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>

          {/* Кнопка сравнения */}
          {selectedProducts.length >= 2 && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  const element = document.getElementById('comparison-table')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn-primary"
              >
                Сравнить характеристики
              </button>
            </div>
          )}
        </div>
      )}

      {/* Выбор товаров */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Выберите товары для сравнения</h2>
          
          {/* Фильтр по категории */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {availableProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Все товары уже добавлены к сравнению</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableProducts.map((product) => {
              const mainImage = product.images[0] || '/placeholder-product.jpg'
              const displacement = product.characteristics.find(c => c.name === 'displacement')?.value
              const power = product.characteristics.find(c => c.name === 'power')?.value

              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg mb-3">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      width={300}
                      height={169}
                      className="object-cover w-full h-32 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-600 font-medium">
                      {product.category.name}
                    </span>
                    <span className="text-xs text-gray-500">#{product.id}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {displacement && <span>Объем: {displacement} см³</span>}
                    {power && <span>Мощность: {power}</span>}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToComparison(product)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors"
                    >
                      Добавить к сравнению
                    </button>
                    <Link
                      href={`/${product.category.slug}/${product.slug}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-medium py-2 px-3 rounded-md transition-colors"
                    >
                      Подробнее
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Таблица сравнения */}
      {selectedProducts.length >= 2 && (
        <div id="comparison-table" className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Детальное сравнение характеристик</h2>
          <ComparisonTable products={selectedProducts} />
        </div>
      )}

      {/* Инструкции */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Как использовать сравнение</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Выберите товары</p>
              <p>Добавьте до 4 товаров для сравнения</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">Сравните характеристики</p>
              <p>Нажмите кнопку "Сравнить характеристики"</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Изучите различия</p>
              <p>Просмотрите детальное сравнение всех параметров</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 