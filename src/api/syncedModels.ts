import type { MotorcycleModel } from '@/types';
import { createTabStateSync } from 'tabstatesync';

const MODELS_FILE_PATH = '/data/models.json';

// Создаем синхронизированное хранилище для моделей
const modelsSync = createTabStateSync('vmc-models', {
  namespace: 'vmc',
  enableEncryption: false,
  debug: true
});

export class SyncedModelsAPI {
  private static isInitialized = false;
  private static currentModels: MotorcycleModel[] = [];

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Подписываемся на изменения от других вкладок
    modelsSync.subscribe((newModels: MotorcycleModel[]) => {
      console.log('🔄 Модели синхронизированы из другой вкладки:', newModels.length);
      this.currentModels = newModels;
    });

    // Загружаем начальные данные
    await this.loadInitialData();
    this.isInitialized = true;
  }

  private static async loadInitialData(): Promise<void> {
    try {
      // Загружаем из JSON файла
      const response = await fetch(MODELS_FILE_PATH);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data = await response.json();
      
      this.currentModels = data;
      console.log('📁 Загружено моделей из JSON файла:', data.length);
      
      // Синхронизируем с другими вкладками
      modelsSync.set(data);
    } catch (error) {
      console.error('❌ Ошибка загрузки начальных данных:', error);
      this.currentModels = [];
    }
  }

  static async getAllModels(): Promise<MotorcycleModel[]> {
    await this.initialize();
    return this.currentModels.sort((a: MotorcycleModel, b: MotorcycleModel) => (a.order || 999) - (b.order || 999));
  }

  static async saveAllModels(models: MotorcycleModel[]): Promise<boolean> {
    try {
      await this.initialize();
      
      this.currentModels = models;
      
      // Синхронизируем с другими вкладками
      modelsSync.set(models);
      
      console.log('💾 Модели сохранены и синхронизированы:', models.length);
      return true;
    } catch (error) {
      console.error('❌ Ошибка сохранения моделей:', error);
      return false;
    }
  }

  static async createModel(modelData: Omit<MotorcycleModel, 'id' | 'createdAt'>): Promise<MotorcycleModel | null> {
    try {
      await this.initialize();

      const newModel: MotorcycleModel = {
        id: `vmc-${Date.now()}`,
        ...modelData,
        createdAt: new Date().toISOString(),
        order: Math.max(...this.currentModels.map(m => m.order || 0), 0) + 1
      };

      const updatedModels = [...this.currentModels, newModel];
      const success = await this.saveAllModels(updatedModels);
      
      return success ? newModel : null;
    } catch (error) {
      console.error('❌ Ошибка создания модели:', error);
      return null;
    }
  }

  static async updateModel(id: string, modelData: Partial<MotorcycleModel>): Promise<MotorcycleModel | null> {
    try {
      await this.initialize();
      
      const modelIndex = this.currentModels.findIndex(m => m.id === id);
      
      if (modelIndex === -1) {
        throw new Error('Модель не найдена');
      }

      const updatedModel = {
        ...this.currentModels[modelIndex],
        ...modelData,
        id, // Обеспечиваем неизменность ID
      };

      const updatedModels = [...this.currentModels];
      updatedModels[modelIndex] = updatedModel;
      
      const success = await this.saveAllModels(updatedModels);
      
      return success ? updatedModel : null;
    } catch (error) {
      console.error('❌ Ошибка обновления модели:', error);
      return null;
    }
  }

  static async deleteModel(id: string): Promise<boolean> {
    try {
      await this.initialize();
      
      const filteredModels = this.currentModels.filter(m => m.id !== id);
      
      if (filteredModels.length === this.currentModels.length) {
        throw new Error('Модель не найдена');
      }

      return await this.saveAllModels(filteredModels);
    } catch (error) {
      console.error('❌ Ошибка удаления модели:', error);
      return false;
    }
  }

  static async reorderModels(modelIds: string[]): Promise<boolean> {
    try {
      await this.initialize();
      
      const reorderedModels = modelIds.map((id, index) => {
        const model = this.currentModels.find(m => m.id === id);
        if (!model) throw new Error(`Модель с ID ${id} не найдена`);
        return { ...model, order: index + 1 };
      });

      return await this.saveAllModels(reorderedModels);
    } catch (error) {
      console.error('❌ Ошибка изменения порядка моделей:', error);
      return false;
    }
  }

  static async moveModel(id: string, direction: 'up' | 'down'): Promise<boolean> {
    try {
      await this.initialize();
      
      const sortedModels = this.currentModels.sort((a, b) => (a.order || 999) - (b.order || 999));
      const currentIndex = sortedModels.findIndex(m => m.id === id);
      
      if (currentIndex === -1) {
        throw new Error('Модель не найдена');
      }

      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === sortedModels.length - 1)
      ) {
        return false; // Модель уже в начале/конце списка
      }

      const newModels = [...sortedModels];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Обмениваем элементы
      [newModels[currentIndex], newModels[targetIndex]] = 
      [newModels[targetIndex], newModels[currentIndex]];

      // Обновляем порядок
      newModels.forEach((model, index) => {
        model.order = index + 1;
      });

      return await this.saveAllModels(newModels);
    } catch (error) {
      console.error('❌ Ошибка перемещения модели:', error);
      return false;
    }
  }

  static async searchModels(query: string): Promise<MotorcycleModel[]> {
    try {
      await this.initialize();
      
      if (!query.trim()) {
        return this.currentModels.sort((a, b) => (a.order || 999) - (b.order || 999));
      }

      const searchQuery = query.toLowerCase();
      return this.currentModels.filter(model => 
        model.name.toLowerCase().includes(searchQuery) ||
        model.description.toLowerCase().includes(searchQuery) ||
        Object.values(model.specifications).some(spec => 
          spec.toLowerCase().includes(searchQuery)
        )
      ).sort((a, b) => (a.order || 999) - (b.order || 999));
    } catch (error) {
      console.error('❌ Ошибка поиска моделей:', error);
      return [];
    }
  }

  static async getModelById(id: string): Promise<MotorcycleModel | null> {
    try {
      await this.initialize();
      return this.currentModels.find(model => model.id === id) || null;
    } catch (error) {
      console.error('❌ Ошибка получения модели по ID:', error);
      return null;
    }
  }

  // Метод для принудительной перезагрузки из JSON
  static async forceReloadFromJSON(): Promise<boolean> {
    try {
      console.log('🔄 Принудительная перезагрузка из JSON...');
      
      // Загружаем свежие данные из JSON с отключением кеша
      const timestamp = Date.now();
      const response = await fetch(`${MODELS_FILE_PATH}?t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      
      const data = await response.json();
      
      // Обновляем данные и синхронизируем
      this.currentModels = data;
      modelsSync.set(data);
      
      console.log('✅ Данные принудительно перезагружены из JSON:', data.length);
      return true;
    } catch (error) {
      console.error('❌ Ошибка принудительной перезагрузки:', error);
      return false;
    }
  }

  // Метод для очистки синхронизации
  static destroy(): void {
    modelsSync.destroy();
    this.isInitialized = false;
    this.currentModels = [];
  }
} 