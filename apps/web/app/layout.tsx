import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SidebarWrapper } from '@/components/SidebarWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VMC Учебник - Каталог мототехники',
  description: 'Внутренний каталог мототехники VMC для изучения товаров менеджерами компании',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <img 
                    src="https://static.tildacdn.com/tild3861-3564-4539-b862-666630643037/VMC_logo_rgb_Text_Al.svg" 
                    alt="VMC" 
                    className="h-8 w-auto"
                  />
                  <h1 className="ml-4 text-xl font-bold text-gray-900">Учебник</h1>
                </div>
                <nav className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Главная
                  </a>
                  <a href="/search" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Поиск
                  </a>
                  <a href="/compare" className="text-gray-900 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
                    Сравнение
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <div className="flex">
            <SidebarWrapper />
            <main className="flex-1 p-8 bg-gray-50 min-h-screen">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-500 text-sm">
                © 2024 VMC. Внутренний каталог мототехники для менеджеров.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
} 