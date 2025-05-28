import { BookOpen, Play, Star, Newspaper, FileText } from 'lucide-react';

/**
 * Приветственная страница каталога VMC
 */
export function GreetingPage() {
  return (
    <div className="min-h-screen bg-gray-25">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white mb-6 sm:mb-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-blue-500/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Система обучения VMC
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              Изучайте мототехнику VMC<br />
              <span className="text-blue-200">профессионально</span>
            </h1>
            <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl">
              Полная обучающая платформа для изучения мототехники VMC. Каталог моделей, 
              регламенты обслуживания и актуальные новости — всё необходимое для 
              успешной работы с техникой.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2.5 sm:py-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="font-medium text-sm sm:text-base">50+ моделей</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2.5 sm:py-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="font-medium text-sm sm:text-base">Регламенты</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2.5 sm:py-3">
                <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                <span className="font-medium text-sm sm:text-base">Новости</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 items-start">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full min-h-[180px] flex flex-col">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">50+</div>
                <div className="text-xs sm:text-sm text-gray-500">Моделей</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Каталог техники</h3>
              <p className="text-gray-600 text-sm">Полная база данных мотоциклов и квадроциклов с характеристиками и поиском</p>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full min-h-[180px] flex flex-col">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">20+</div>
                <div className="text-xs sm:text-sm text-gray-500">Регламентов</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Регламенты обслуживания</h3>
              <p className="text-gray-600 text-sm">Подробные инструкции по ТО, безопасности и гарантийному обслуживанию</p>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group h-full min-h-[180px] flex flex-col">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">📰</div>
                <div className="text-xs sm:text-sm text-gray-500">Новости</div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Новости компании</h3>
              <p className="text-gray-600 text-sm">Актуальные новости, обновления продуктов и события VMC</p>
            </div>
          </div>


        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8 items-start">
          {/* Features */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 h-full min-h-[400px] flex flex-col">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Возможности системы</h2>
            </div>
            
            <div className="space-y-3 sm:space-y-4 flex-1">
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Каталог мототехники</div>
                  <div className="text-xs sm:text-sm text-gray-600">50+ моделей с характеристиками, поиском и фотографиями</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Регламенты обслуживания</div>
                  <div className="text-xs sm:text-sm text-gray-600">Инструкции по ТО, безопасности, гарантии с документами</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Новости и обновления</div>
                  <div className="text-xs sm:text-sm text-gray-600">Актуальная информация о продуктах и событиях VMC</div>
                </div>
              </div>


            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 p-6 sm:p-8 h-full min-h-[400px] flex flex-col">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Как начать</h2>
            </div>
            
            <div className="space-y-4 sm:space-y-6 flex-1">
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Изучите каталог</div>
                  <div className="text-xs sm:text-sm text-gray-600">Выберите модель техники в боковом меню и изучите характеристики</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Изучите регламенты</div>
                  <div className="text-xs sm:text-sm text-gray-600">Ознакомьтесь с инструкциями по обслуживанию и безопасности</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Следите за новостями</div>
                  <div className="text-xs sm:text-sm text-gray-600">Получайте актуальную информацию о продуктах и событиях</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm font-bold">4</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Применяйте знания</div>
                  <div className="text-xs sm:text-sm text-gray-600">Используйте полученную информацию в работе с клиентами</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 