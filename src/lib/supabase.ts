import { createClient } from '@supabase/supabase-js'

// Функция для получения конфигурации Supabase
const getSupabaseConfig = () => {
  // Используем реальные credentials для проекта VMC по умолчанию
  const url = localStorage.getItem('vmc_supabase_url') || 'https://nqiqdnqmzuqcumxvjveg.supabase.co';
  const key = localStorage.getItem('vmc_supabase_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXFkbnFtenVxY3VteHZqdmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjE4NzQsImV4cCI6MjA1MDUzNzg3NH0.Qs8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';
  
  // Автоматически сохраняем credentials в localStorage если их там нет
  if (!localStorage.getItem('vmc_supabase_url')) {
    localStorage.setItem('vmc_supabase_url', url);
  }
  if (!localStorage.getItem('vmc_supabase_key')) {
    localStorage.setItem('vmc_supabase_key', key);
  }
  
  return { url, key };
};

// Создаем клиент Supabase с динамической конфигурацией
const createSupabaseClient = () => {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key, {
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
};

// Экспортируем функцию для получения клиента
export const getSupabaseClient = () => createSupabaseClient();

// Для обратной совместимости
export const supabase = createSupabaseClient();

// Типы для базы данных
export interface Database {
  public: {
    Tables: {
      vmc_models: {
        Row: {
          id: string
          name: string
          description: string
          images: string[]
          specifications: Record<string, string>
          yandex_disk_link?: string
          video_frame?: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          images: string[]
          specifications: Record<string, string>
          yandex_disk_link?: string
          video_frame?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          images?: string[]
          specifications?: Record<string, string>
          yandex_disk_link?: string
          video_frame?: string
          order?: number
          updated_at?: string
        }
      }
      vmc_news: {
        Row: {
          id: string
          title: string
          content: string
          image: string
          date: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image: string
          date: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image?: string
          date?: string
          order?: number
          updated_at?: string
        }
      }
      vmc_regulations: {
        Row: {
          id: string
          title: string
          content: string
          image: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image?: string
          order?: number
          updated_at?: string
        }
      }
    }
  }
}

export type SupabaseClient = typeof supabase 