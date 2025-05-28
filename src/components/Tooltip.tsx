import { useState, type ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

/**
 * Компонент для отображения всплывающих подсказок
 */
export function Tooltip({ content, children, position = 'top', delay = 500 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-slate-800 border-t-4 border-x-transparent border-x-4 border-b-0';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-slate-800 border-b-4 border-x-transparent border-x-4 border-t-0';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-slate-800 border-l-4 border-y-transparent border-y-4 border-r-0';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-slate-800 border-r-4 border-y-transparent border-y-4 border-l-0';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-slate-800 border-t-4 border-x-transparent border-x-4 border-b-0';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 ${getPositionClasses()}`}>
          <div className="bg-slate-800 text-white text-sm px-3 py-2 rounded-md shadow-lg max-w-xs whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute w-0 h-0 ${getArrowClasses()}`} />
        </div>
      )}
    </div>
  );
} 