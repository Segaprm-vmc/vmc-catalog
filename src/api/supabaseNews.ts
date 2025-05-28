import { supabase } from '../lib/supabase';

export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  image?: string;
  document?: {
    name: string;
    url: string;
    type: string;
  };
  category: string;
  featured: boolean;
  published: boolean;
  publishDate?: string;
  createdAt?: string;
  updatedAt?: string;
  order: number;
}

export interface SupabaseNewsItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  image?: string;
  document?: any;
  category: string;
  featured: boolean;
  published: boolean;
  publish_date?: string;
  created_at?: string;
  updated_at?: string;
  order_index: number;
}

export class SupabaseNewsAPI {
  private static transformFromSupabase(item: SupabaseNewsItem): NewsItem {
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      image: item.image,
      document: item.document,
      category: item.category,
      featured: item.featured,
      published: item.published,
      publishDate: item.publish_date,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      order: item.order_index
    };
  }

  private static transformToSupabase(item: Partial<NewsItem>): Partial<SupabaseNewsItem> {
    return {
      id: item.id,
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      image: item.image,
      document: item.document,
      category: item.category,
      featured: item.featured,
      published: item.published,
      publish_date: item.publishDate,
      order_index: item.order
    };
  }

  static async getNews(): Promise<NewsItem[]> {
    try {
      console.log('Загружаем новости из Supabase...');
      
      const { data, error } = await supabase
        .from('vmc_news')
        .select('*')
        .eq('published', true)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Ошибка загрузки новостей из Supabase:', error);
        return this.getFallbackNews();
      }

      if (!data || data.length === 0) {
        console.warn('Новости не найдены в Supabase, используем fallback');
        return this.getFallbackNews();
      }

      const news = data.map(this.transformFromSupabase);
      console.log(`Загружено новостей из Supabase: ${news.length}`);
      return news;

    } catch (error) {
      console.error('Ошибка подключения к Supabase для новостей:', error);
      return this.getFallbackNews();
    }
  }

  static async getNewsById(id: string): Promise<NewsItem | null> {
    try {
      const { data, error } = await supabase
        .from('vmc_news')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Новость не найдена:', error);
        return null;
      }

      return this.transformFromSupabase(data);
    } catch (error) {
      console.error('Ошибка получения новости:', error);
      return null;
    }
  }

  static async createNews(news: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<NewsItem | null> {
    try {
      const newsData = this.transformToSupabase({
        ...news,
        id: `news-${Date.now()}`
      });

      const { data, error } = await supabase
        .from('vmc_news')
        .insert([newsData])
        .select()
        .single();

      if (error || !data) {
        console.error('Ошибка создания новости:', error);
        return null;
      }

      return this.transformFromSupabase(data);
    } catch (error) {
      console.error('Ошибка создания новости:', error);
      return null;
    }
  }

  static async updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem | null> {
    try {
      const updateData = this.transformToSupabase(updates);

      const { data, error } = await supabase
        .from('vmc_news')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        console.error('Ошибка обновления новости:', error);
        return null;
      }

      return this.transformFromSupabase(data);
    } catch (error) {
      console.error('Ошибка обновления новости:', error);
      return null;
    }
  }

  static async deleteNews(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('vmc_news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Ошибка удаления новости:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
      return false;
    }
  }

  static async getFeaturedNews(): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('vmc_news')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('order_index', { ascending: true });

      if (error || !data) {
        console.error('Ошибка загрузки рекомендуемых новостей:', error);
        return [];
      }

      return data.map(this.transformFromSupabase);
    } catch (error) {
      console.error('Ошибка загрузки рекомендуемых новостей:', error);
      return [];
    }
  }

  static async getNewsByCategory(category: string): Promise<NewsItem[]> {
    try {
      const { data, error } = await supabase
        .from('vmc_news')
        .select('*')
        .eq('published', true)
        .eq('category', category)
        .order('order_index', { ascending: true });

      if (error || !data) {
        console.error('Ошибка загрузки новостей по категории:', error);
        return [];
      }

      return data.map(this.transformFromSupabase);
    } catch (error) {
      console.error('Ошибка загрузки новостей по категории:', error);
      return [];
    }
  }

  private static getFallbackNews(): NewsItem[] {
    console.log('Используем fallback данные для новостей');
    return [
      {
        id: 'news-fallback-1',
        title: 'Добро пожаловать в VMC Catalog',
        content: 'Система новостей временно недоступна. Пожалуйста, попробуйте позже.',
        excerpt: 'Система новостей временно недоступна',
        category: 'system',
        featured: true,
        published: true,
        order: 1
      }
    ];
  }

  // Метод для синхронизации с локальными данными (миграция)
  static async syncWithLocalData(): Promise<void> {
    try {
      // Проверяем, есть ли уже данные в Supabase
      const { data: existingNews } = await supabase
        .from('vmc_news')
        .select('id')
        .limit(1);

      if (existingNews && existingNews.length > 0) {
        console.log('Новости уже существуют в Supabase, синхронизация не требуется');
        return;
      }

      console.log('Синхронизация новостей с локальными данными...');
      
      // Загружаем локальные данные
      const response = await fetch('/data/news.json');
      if (!response.ok) {
        throw new Error('Не удалось загрузить локальные новости');
      }

      const localNews = await response.json();
      
      // Преобразуем и загружаем в Supabase
      for (const news of localNews) {
        const newsData = this.transformToSupabase({
          id: news.id,
          title: news.title,
          content: news.content,
          excerpt: news.excerpt,
          image: news.image,
          document: news.document,
          category: news.category,
          featured: news.featured,
          published: news.published,
          publishDate: news.publishDate,
          order: news.order
        });

        await supabase.from('vmc_news').insert([newsData]);
      }

      console.log('Синхронизация новостей завершена');
    } catch (error) {
      console.error('Ошибка синхронизации новостей:', error);
    }
  }
} 