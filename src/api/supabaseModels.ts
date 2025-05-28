import type { MotorcycleModel } from '@/types';
import { getSupabaseClient } from '@/lib/supabase';

export class SupabaseModelsAPI {
  private static isInitialized = false;
  private static realtimeSubscription: any = null;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Проверяем подключение к Supabase
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from('vmc_models').select('count').limit(1);
      if (error) {
        console.warn('⚠️ Supabase недоступен, используем fallback:', error.message);
        return;
      }
      console.log('✅ Supabase подключен успешно');
    } catch (error) {
      console.warn('⚠️ Supabase недоступен, используем fallback:', error);
      return;
    }

    // Подписываемся на real-time обновления
    this.setupRealtimeSubscription();
    this.isInitialized = true;
  }

  private static setupRealtimeSubscription(): void {
    const supabase = getSupabaseClient();
    this.realtimeSubscription = supabase
      .channel('vmc_models_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vmc_models'
        },
        (payload) => {
          console.log('🔄 Real-time обновление моделей:', payload);
          // Уведомляем компоненты об изменениях
          window.dispatchEvent(new CustomEvent('supabase-models-updated', { 
            detail: payload 
          }));
        }
      )
      .subscribe();
  }

  static async getAllModels(): Promise<MotorcycleModel[]> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('vmc_models')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('❌ Ошибка загрузки из Supabase:', error);
        return await this.getFallbackModels();
      }

      console.log('📁 Загружено моделей из Supabase:', data.length);
      return this.convertFromSupabase(data);
    } catch (error) {
      console.error('❌ Ошибка подключения к Supabase:', error);
      return await this.getFallbackModels();
    }
  }

  private static async getFallbackModels(): Promise<MotorcycleModel[]> {
    try {
      console.log('⚠️ Supabase недоступен, возвращаем пустой массив');
      // Больше не используем локальный JSON файл
      return [];
    } catch (error) {
      console.error('❌ Ошибка fallback:', error);
      return [];
    }
  }

  static async createModel(modelData: Omit<MotorcycleModel, 'id' | 'createdAt'>): Promise<MotorcycleModel | null> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      const newModel = {
        id: `vmc-${Date.now()}`,
        name: modelData.name,
        description: modelData.description,
        images: modelData.images,
        specifications: modelData.specifications,
        yandex_disk_link: modelData.yandexDiskLink,
        video_frame: modelData.videoFrame,
        order: modelData.order || 999,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('vmc_models')
        .insert([newModel])
        .select()
        .single();

      if (error) {
        console.error('❌ Ошибка создания модели в Supabase:', error);
        return null;
      }

      console.log('✅ Модель создана в Supabase:', data.name);
      return this.convertFromSupabase([data])[0];
    } catch (error) {
      console.error('❌ Ошибка создания модели:', error);
      return null;
    }
  }

  static async updateModel(id: string, modelData: Partial<MotorcycleModel>): Promise<MotorcycleModel | null> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      
      // Конвертируем данные в формат Supabase
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Добавляем только те поля, которые есть в modelData
      if (modelData.name !== undefined) updateData.name = modelData.name;
      if (modelData.description !== undefined) updateData.description = modelData.description;
      if (modelData.images !== undefined) updateData.images = modelData.images;
      if (modelData.specifications !== undefined) updateData.specifications = modelData.specifications;
      if (modelData.yandexDiskLink !== undefined) updateData.yandex_disk_link = modelData.yandexDiskLink;
      if (modelData.videoFrame !== undefined) updateData.video_frame = modelData.videoFrame;
      if (modelData.order !== undefined) updateData.order = modelData.order;

      const { data, error } = await supabase
        .from('vmc_models')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Ошибка обновления модели в Supabase:', error);
        return null;
      }

      console.log('✅ Модель обновлена в Supabase:', data.name);
      return this.convertFromSupabase([data])[0];
    } catch (error) {
      console.error('❌ Ошибка обновления модели:', error);
      return null;
    }
  }

  static async deleteModel(id: string): Promise<boolean> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('vmc_models')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Ошибка удаления модели из Supabase:', error);
        return false;
      }

      console.log('✅ Модель удалена из Supabase:', id);
      return true;
    } catch (error) {
      console.error('❌ Ошибка удаления модели:', error);
      return false;
    }
  }

  static async getModelById(id: string): Promise<MotorcycleModel | null> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('vmc_models')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Ошибка получения модели из Supabase:', error);
        return null;
      }

      return this.convertFromSupabase([data])[0];
    } catch (error) {
      console.error('❌ Ошибка получения модели:', error);
      return null;
    }
  }

  static async searchModels(query: string): Promise<MotorcycleModel[]> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      if (!query.trim()) {
        return await this.getAllModels();
      }

      const { data, error } = await supabase
        .from('vmc_models')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('order', { ascending: true });

      if (error) {
        console.error('❌ Ошибка поиска в Supabase:', error);
        return [];
      }

      return this.convertFromSupabase(data);
    } catch (error) {
      console.error('❌ Ошибка поиска моделей:', error);
      return [];
    }
  }

  static async reorderModels(modelIds: string[]): Promise<boolean> {
    try {
      await this.initialize();

      const supabase = getSupabaseClient();
      // Обновляем порядок для каждой модели
      const updates = modelIds.map((id, index) => ({
        id,
        order: index + 1,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('vmc_models')
        .upsert(updates);

      if (error) {
        console.error('❌ Ошибка изменения порядка в Supabase:', error);
        return false;
      }

      console.log('✅ Порядок моделей обновлен в Supabase');
      return true;
    } catch (error) {
      console.error('❌ Ошибка изменения порядка моделей:', error);
      return false;
    }
  }

  static async moveModel(id: string, direction: 'up' | 'down'): Promise<boolean> {
    try {
      await this.initialize();

      const models = await this.getAllModels();
      const sortedModels = models.sort((a, b) => (a.order || 999) - (b.order || 999));
      const currentIndex = sortedModels.findIndex(m => m.id === id);

      if (currentIndex === -1) return false;

      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === sortedModels.length - 1)
      ) {
        return false;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Обмениваем порядок
      const currentOrder = sortedModels[currentIndex].order || currentIndex + 1;
      const targetOrder = sortedModels[targetIndex].order || targetIndex + 1;

      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from('vmc_models')
        .upsert([
          { id: sortedModels[currentIndex].id, order: targetOrder, updated_at: new Date().toISOString() },
          { id: sortedModels[targetIndex].id, order: currentOrder, updated_at: new Date().toISOString() }
        ]);

      if (error) {
        console.error('❌ Ошибка перемещения модели в Supabase:', error);
        return false;
      }

      console.log('✅ Модель перемещена в Supabase');
      return true;
    } catch (error) {
      console.error('❌ Ошибка перемещения модели:', error);
      return false;
    }
  }

  // Метод для синхронизации локальных данных с Supabase
  static async syncWithSupabase(): Promise<boolean> {
    try {
      console.log('🔄 Проверка данных в Supabase...');
      
      const supabase = getSupabaseClient();
      
      // Проверяем, есть ли данные в Supabase
      const { data: supabaseModels, error } = await supabase
        .from('vmc_models')
        .select('*');

      if (error) throw error;

      // Если в Supabase есть данные, синхронизация не нужна
      if (supabaseModels && supabaseModels.length > 0) {
        console.log('✅ Данные уже есть в Supabase:', supabaseModels.length);
        return true;
      }

      console.log('⚠️ Данные в Supabase отсутствуют. Используйте SQL скрипт для инициализации.');
      return false;
    } catch (error) {
      console.error('❌ Ошибка проверки Supabase:', error);
      return false;
    }
  }

  // Конвертация данных из формата Supabase в формат приложения
  private static convertFromSupabase(data: any[]): MotorcycleModel[] {
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      images: item.images,
      specifications: item.specifications,
      yandexDiskLink: item.yandex_disk_link,
      videoFrame: item.video_frame,
      order: item.order,
      createdAt: item.created_at
    }));
  }

  // Очистка подписок
  static destroy(): void {
    if (this.realtimeSubscription) {
      const supabase = getSupabaseClient();
      supabase.removeChannel(this.realtimeSubscription);
      this.realtimeSubscription = null;
    }
    this.isInitialized = false;
  }
} 