// Переход на Supabase API
export { SupabaseNewsAPI as NewsAPI, type NewsItem } from './supabaseNews';

// Для обратной совместимости
import { SupabaseNewsAPI } from './supabaseNews';

export const getNews = () => SupabaseNewsAPI.getNews();
export const getNewsById = (id: string) => SupabaseNewsAPI.getNewsById(id);
export const getFeaturedNews = () => SupabaseNewsAPI.getFeaturedNews();
export const getNewsByCategory = (category: string) => SupabaseNewsAPI.getNewsByCategory(category);

import type { News } from '@/types';

const NEWS_FILE_PATH = '/data/news.json';

export class NewsAPI {
  static async getAllNews(): Promise<News[]> {
    try {
      const response = await fetch(NEWS_FILE_PATH);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
      return [];
    }
  }

  static async saveAllNews(news: News[]): Promise<boolean> {
    try {
      // В реальном приложении здесь должен быть POST запрос к серверу
      // Для демонстрации сохраняем в localStorage и обновляем файл
      localStorage.setItem('vmc-news', JSON.stringify(news));
      
      // Эмуляция сохранения файла
      console.log('Новости сохранены:', news);
      return true;
    } catch (error) {
      console.error('Ошибка сохранения новостей:', error);
      return false;
    }
  }

  static async createNews(newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt'>): Promise<News | null> {
    try {
      const allNews = await this.getAllNews();
      const newNews: News = {
        id: `news-${Date.now()}`,
        ...newsData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: Math.max(...allNews.map(n => n.order || 0), 0) + 1
      };

      const updatedNews = [...allNews, newNews];
      const success = await this.saveAllNews(updatedNews);
      
      return success ? newNews : null;
    } catch (error) {
      console.error('Ошибка создания новости:', error);
      return null;
    }
  }

  static async updateNews(id: string, newsData: Partial<News>): Promise<News | null> {
    try {
      const allNews = await this.getAllNews();
      const newsIndex = allNews.findIndex(n => n.id === id);
      
      if (newsIndex === -1) {
        throw new Error('Новость не найдена');
      }

      const updatedNews = {
        ...allNews[newsIndex],
        ...newsData,
        id, // Обеспечиваем неизменность ID
        updatedAt: new Date().toISOString()
      };

      allNews[newsIndex] = updatedNews;
      const success = await this.saveAllNews(allNews);
      
      return success ? updatedNews : null;
    } catch (error) {
      console.error('Ошибка обновления новости:', error);
      return null;
    }
  }

  static async deleteNews(id: string): Promise<boolean> {
    try {
      const allNews = await this.getAllNews();
      const filteredNews = allNews.filter(n => n.id !== id);
      
      if (filteredNews.length === allNews.length) {
        throw new Error('Новость не найдена');
      }

      return await this.saveAllNews(filteredNews);
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
      return false;
    }
  }

  static async reorderNews(newsIds: string[]): Promise<boolean> {
    try {
      const allNews = await this.getAllNews();
      const reorderedNews = newsIds.map((id, index) => {
        const news = allNews.find(n => n.id === id);
        if (!news) throw new Error(`Новость с ID ${id} не найдена`);
        return { ...news, order: index + 1 };
      });

      return await this.saveAllNews(reorderedNews);
    } catch (error) {
      console.error('Ошибка изменения порядка новостей:', error);
      return false;
    }
  }
} 