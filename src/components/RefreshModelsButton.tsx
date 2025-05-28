import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface RefreshModelsButtonProps {
  onRefresh: () => void;
}

/**
 * Кнопка обновления моделей (очистка localStorage)
 */
export function RefreshModelsButton({ onRefresh }: RefreshModelsButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Очищаем localStorage чтобы загрузить оригинальные данные
    localStorage.removeItem('vmc-models');
    
    // Ждем немного для визуального эффекта
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Вызываем обновление
    onRefresh();
    
    setIsRefreshing(false);
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="inline-flex items-center px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Обновить модели (сбросить локальные изменения)"
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Обновление...' : 'Обновить'}
    </button>
  );
} 