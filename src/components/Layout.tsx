import { useState } from 'react';
import type { ReactNode } from 'react';
import { Menu, X, Settings, Code, Heart, Home, BookOpen, Newspaper } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Tooltip } from './Tooltip';
import { HelpTour } from './HelpTour';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Основной layout приложения с адаптивным сайдбаром
 */
export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:w-72 lg:w-80
        lg:relative lg:transform-none lg:shadow-none lg:bg-white lg:border-r lg:border-slate-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200 lg:hidden">
          <h2 className="text-lg font-semibold text-slate-900">VMC Каталог</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-slate-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-3 sm:py-4 lg:px-6 min-h-[64px] sm:min-h-[72px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center min-w-0 flex-1 mr-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 sm:p-2 rounded-md hover:bg-slate-100 lg:hidden mr-2 sm:mr-3"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              
              {/* Desktop title and navigation */}
              <div className="hidden lg:flex lg:items-center ml-2">

                
                {/* Navigation menu */}
                <nav className="flex items-center space-x-2">
                  <Tooltip content="Главная страница каталога" position="bottom">
                    <Link
                      to="/"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === '/'
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Каталог
                    </Link>
                  </Tooltip>
                  
                  <Tooltip content="Новости компании и обновления" position="bottom">
                    <Link
                      to="/news"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/news')
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Newspaper className="mr-2 h-4 w-4" />
                      Новости
                    </Link>
                  </Tooltip>
                  
                  <Tooltip content="Регламенты по обслуживанию и эксплуатации" position="bottom">
                    <Link
                      to="/regulations"
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname.startsWith('/regulations')
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Регламенты
                    </Link>
                  </Tooltip>
                </nav>
              </div>
              
              {/* Mobile title and navigation */}
              <div className="lg:hidden min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h1 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                      VMC Каталог
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 leading-tight">
                      Мототехника
                    </p>
                  </div>
                  
                  {/* Mobile navigation */}
                  <nav className="flex items-center space-x-1 ml-2">
                    <Tooltip content="Каталог" position="bottom">
                      <Link
                        to="/"
                        className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          location.pathname === '/'
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Home className="h-3 w-3" />
                      </Link>
                    </Tooltip>
                    
                    <Tooltip content="Новости" position="bottom">
                      <Link
                        to="/news"
                        className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          location.pathname.startsWith('/news')
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Newspaper className="h-3 w-3" />
                      </Link>
                    </Tooltip>
                    
                    <Tooltip content="Регламенты" position="bottom">
                      <Link
                        to="/regulations"
                        className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          location.pathname.startsWith('/regulations')
                            ? 'bg-blue-100 text-blue-900'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <BookOpen className="h-3 w-3" />
                      </Link>
                    </Tooltip>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Admin button */}
            <div className="flex-shrink-0">
              <Tooltip content="Панель управления каталогом (пароль: admin123)" position="bottom">
                <Link
                  id="admin-button"
                  to="/admin"
                  className={`inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    isAdminPage 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Админ-панель</span>
                  <span className="sm:hidden">Админ</span>
                </Link>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full flex flex-col">
            <div className="flex-1 p-3 sm:p-4 lg:p-6">
              {children}
            </div>
            
            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 mt-auto">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-center text-center sm:text-left">
                  {/* Copyright */}
                  <div className="order-2 sm:order-1">
                    <p className="text-xs sm:text-sm text-slate-600">
                      © {new Date().getFullYear()} VMC. Все права защищены.
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Обучающая платформа для менеджеров
                    </p>
                  </div>
                  
                  {/* Brand */}
                  <div className="order-1 sm:order-2 sm:col-span-2 lg:col-span-1 lg:text-center">
                    <div className="inline-flex items-center space-x-2 text-slate-700">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Code className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-sm sm:text-base">VMC Каталог</span>
                    </div>
                  </div>
                  
                  {/* Developer */}
                  <div className="order-3 sm:col-span-2 lg:col-span-1 lg:text-right">
                    <div className="inline-flex items-center space-x-2 text-slate-600">
                      <span className="text-xs sm:text-sm">Создано и разработано</span>
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 mt-1">
                      Ежовым Сергеем
                    </p>
                  </div>
                </div>
                
                {/* Additional line */}
                <div className="border-t border-slate-100 mt-3 sm:mt-4 pt-3 sm:pt-4">
                  <p className="text-center text-xs text-slate-500">
                    Профессиональное обучение мототехнике • Технологии: React, TypeScript, Tailwind CSS
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {/* Help Tour */}
      <HelpTour />
    </div>
  );
} 