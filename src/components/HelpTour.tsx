import { useState, useEffect } from 'react';
import { X, ArrowRight, HelpCircle } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Добро пожаловать в VMC Каталог!',
    content: 'Этот каталог поможет вам изучить модели мототехники VMC и их характеристики. Давайте познакомимся с интерфейсом.'
  },
  {
    id: 'logo',
    title: 'Навигация',
    content: 'Нажмите на логотип VMC в сайдбаре, чтобы вернуться на главную страницу в любое время.',
    target: 'vmc-logo'
  },
  {
    id: 'search',
    title: 'Поиск моделей',
    content: 'Используйте поле поиска для быстрого нахождения нужной модели мотоцикла.',
    target: 'search-input'
  }
];

interface HelpTourProps {
  onComplete?: () => void;
}

/**
 * Компонент для интерактивного обучения интерфейсу
 */
export function HelpTour({ onComplete }: HelpTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Проверяем, видел ли пользователь тур
    const seen = localStorage.getItem('vmc-tour-seen');
    if (!seen) {
      setTimeout(() => setIsOpen(true), 1000); // Показываем тур через секунду
    }
  }, []);

  useEffect(() => {
    if (isOpen && currentStep > 0) {
      const currentStepData = tourSteps[currentStep];
      if (currentStepData.target) {
        const element = document.getElementById(currentStepData.target);
        if (element) {
          setHighlightedElement(element);
          // Прокручиваем к элементу
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setHighlightedElement(null);
      }
    } else {
      setHighlightedElement(null);
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    setHighlightedElement(null);
    localStorage.setItem('vmc-tour-seen', 'true');
    onComplete?.();
  };

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const currentStepData = tourSteps[currentStep];

  const getModalPosition = () => {
    if (!highlightedElement) {
      return { className: 'inset-0 flex items-center justify-center p-4', style: {} };
    }

    const rect = highlightedElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Определяем лучшую позицию для модального окна
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceRight = viewportWidth - rect.right;
    
    let style: React.CSSProperties = {};
    
    if (spaceBelow > 300) {
      // Показываем снизу
      style = {
        top: rect.bottom + 20,
        left: Math.max(20, Math.min(rect.left, viewportWidth - 420))
      };
    } else if (rect.top > 300) {
      // Показываем сверху
      style = {
        bottom: viewportHeight - rect.top + 20,
        left: Math.max(20, Math.min(rect.left, viewportWidth - 420))
      };
    } else if (spaceRight > 420) {
      // Показываем справа
      style = {
        top: Math.max(20, Math.min(rect.top, viewportHeight - 400)),
        left: rect.right + 20
      };
    } else {
      // Показываем слева
      style = {
        top: Math.max(20, Math.min(rect.top, viewportHeight - 400)),
        right: viewportWidth - rect.left + 20
      };
    }
    
    return { className: '', style };
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={startTour}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Помощь по интерфейсу"
        >
          <HelpCircle className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop with spotlight effect */}
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        {highlightedElement && (
          <div
            className="absolute bg-transparent border-2 border-blue-400 shadow-lg tour-spotlight"
            style={{
              left: highlightedElement.getBoundingClientRect().left - 4,
              top: highlightedElement.getBoundingClientRect().top - 4,
              width: highlightedElement.getBoundingClientRect().width + 8,
              height: highlightedElement.getBoundingClientRect().height + 8,
              borderRadius: '8px'
            }}
          />
        )}
      </div>
      
      {/* Tour modal */}
      <div 
        className={`fixed z-50 ${highlightedElement ? getModalPosition().className : 'inset-0 flex items-center justify-center p-4'}`}
        style={highlightedElement ? getModalPosition().style : {}}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-slate-900">
              {currentStepData.title}
            </h3>
            <button
              onClick={handleComplete}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <p className="text-slate-700 mb-4">
              {currentStepData.content}
            </p>
            
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-500">
                Шаг {currentStep + 1} из {tourSteps.length}
              </div>
              <div className="flex space-x-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t bg-slate-50">
            <button
              onClick={handleComplete}
              className="text-slate-600 hover:text-slate-800 text-sm"
            >
              Пропустить тур
            </button>
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Далее
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                'Завершить'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 