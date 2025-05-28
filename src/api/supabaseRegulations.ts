import { supabase } from '../lib/supabase';

export interface RegulationItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  content?: string;
  screenshot?: string;
  downloadLinks?: {
    pdf?: string;
    word?: string;
    [key: string]: string | undefined;
  };
  createdAt?: string;
  updatedAt?: string;
  order: number;
}

export interface SupabaseRegulationItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  content?: string;
  screenshot?: string;
  download_links?: any;
  created_at?: string;
  updated_at?: string;
  order_index: number;
}

export class SupabaseRegulationsAPI {
  private static transformFromSupabase(item: SupabaseRegulationItem): RegulationItem {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      screenshot: item.screenshot,
      downloadLinks: item.download_links,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      order: item.order_index
    };
  }

  private static transformToSupabase(item: Partial<RegulationItem>): Partial<SupabaseRegulationItem> {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      content: item.content,
      screenshot: item.screenshot,
      download_links: item.downloadLinks,
      order_index: item.order
    };
  }

  static async getRegulations(): Promise<RegulationItem[]> {
    try {
      console.log('Загружаем регламенты из Supabase...');
      
      const { data, error } = await supabase
        .from('vmc_regulations')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Ошибка загрузки регламентов из Supabase:', error);
        return this.getFallbackRegulations();
      }

      if (!data || data.length === 0) {
        console.warn('Регламенты не найдены в Supabase, используем fallback');
        return this.getFallbackRegulations();
      }

      const regulations = data.map(this.transformFromSupabase);
      console.log(`Загружено регламентов из Supabase: ${regulations.length}`);
      return regulations;

    } catch (error) {
      console.error('Ошибка подключения к Supabase для регламентов:', error);
      return this.getFallbackRegulations();
    }
  }

  static async getRegulationById(id: string): Promise<RegulationItem | null> {
    try {
      const { data, error } = await supabase
        .from('vmc_regulations')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Регламент не найден:', error);
        return null;
      }

      return this.transformFromSupabase(data);
    } catch (error) {
      console.error('Ошибка получения регламента:', error);
      return null;
    }
  }

  static async createRegulation(regulation: Omit<RegulationItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<RegulationItem | null> {
    try {
      const regulationData = this.transformToSupabase({
        ...regulation,
        id: `reg-${Date.now()}`
      });

      const { data, error } = await supabase
        .from('vmc_regulations')
        .insert([regulationData])
        .select()
        .single();

      if (error || !data) {
        console.error('Ошибка создания регламента:', error);
        return null;
      }

      return this.transformFromSupabase(data);
    } catch (error) {
      console.error('Ошибка создания регламента:', error);
      return null;
    }
  }

  static async updateRegulation(id: string, updates: Partial<RegulationItem>): Promise<RegulationItem | null> {
    try {
      const updateData = this.transformToSupabase(updates);

      const { data, error } = await supabase
        .from('vmc_regulations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Ошибка обновления регламента:', error);
        return null;
      }

      return this.transformFromSupabase(data);
    } catch (error) {
      console.error('Ошибка обновления регламента:', error);
      return null;
    }
  }

  static async deleteRegulation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vmc_regulations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Ошибка удаления регламента:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка удаления регламента:', error);
      return false;
    }
  }

  static async getRegulationsByCategory(category: string): Promise<RegulationItem[]> {
    try {
      const { data, error } = await supabase
        .from('vmc_regulations')
        .select('*')
        .eq('category', category)
        .order('order_index', { ascending: true });

      if (error || !data) {
        console.error('Ошибка загрузки регламентов по категории:', error);
        return [];
      }

      return data.map(this.transformFromSupabase);
    } catch (error) {
      console.error('Ошибка загрузки регламентов по категории:', error);
      return [];
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('vmc_regulations')
        .select('category')
        .order('category');

      if (error || !data) {
        console.error('Ошибка загрузки категорий регламентов:', error);
        return ['maintenance', 'safety', 'technical', 'warranty'];
      }

      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    } catch (error) {
      console.error('Ошибка загрузки категорий регламентов:', error);
      return ['maintenance', 'safety', 'technical', 'warranty'];
    }
  }

  private static getFallbackRegulations(): RegulationItem[] {
    console.log('Используем fallback данные для регламентов');
    return [
      {
        id: 'reg-fallback-1',
        title: 'Система регламентов временно недоступна',
        description: 'Пожалуйста, попробуйте позже',
        category: 'system',
        content: '## Система временно недоступна\n\nПожалуйста, попробуйте позже или обратитесь к администратору.',
        order: 1
      }
    ];
  }

  // Метод для синхронизации с локальными данными (миграция)
  static async syncWithLocalData(): Promise<void> {
    try {
      // Проверяем, есть ли уже данные в Supabase
      const { data: existingRegulations } = await supabase
        .from('vmc_regulations')
        .select('id')
        .limit(1);

      if (existingRegulations && existingRegulations.length > 0) {
        console.log('Регламенты уже существуют в Supabase, синхронизация не требуется');
        return;
      }

      console.log('Синхронизация регламентов с локальными данными...');
      
      // Загружаем локальные данные
      const response = await fetch('/data/regulations.json');
      if (!response.ok) {
        throw new Error('Не удалось загрузить локальные регламенты');
      }

      const localRegulations = await response.json();
      
      // Преобразуем и загружаем в Supabase
      for (const regulation of localRegulations) {
        const regulationData = this.transformToSupabase({
          id: regulation.id,
          title: regulation.title,
          description: regulation.description,
          category: regulation.category,
          content: regulation.content,
          screenshot: regulation.screenshot,
          downloadLinks: regulation.downloadLinks,
          order: regulation.order
        });

        await supabase.from('vmc_regulations').insert([regulationData]);
      }

      console.log('Синхронизация регламентов завершена');
    } catch (error) {
      console.error('Ошибка синхронизации регламентов:', error);
    }
  }

  // Поиск по регламентам
  static async searchRegulations(query: string): Promise<RegulationItem[]> {
    try {
      const { data, error } = await supabase
        .from('vmc_regulations')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .order('order_index', { ascending: true });

      if (error || !data) {
        console.error('Ошибка поиска регламентов:', error);
        return [];
      }

      return data.map(this.transformFromSupabase);
    } catch (error) {
      console.error('Ошибка поиска регламентов:', error);
      return [];
    }
  }
} 