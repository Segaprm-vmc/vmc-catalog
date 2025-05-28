export interface MotorcycleModel {
  id: string;
  name: string;
  description: string;
  images: string[];
  specifications: Record<string, string>;
  yandexDiskLink?: string;
  videoFrame?: string;
  createdAt: string;
  order?: number;
}

export interface AdminToken {
  token: string;
  expires: number;
}

export interface Regulation {
  id: string;
  title: string;
  description: string;
  category: 'maintenance' | 'operation' | 'safety' | 'warranty' | 'technical';
  content: string;
  screenshot?: string;
  downloadLinks?: {
    pdf?: string;
    word?: string;
  };
  createdAt: string;
  updatedAt: string;
  order?: number;
}

export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image?: string; // URL изображения
  document?: {
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'docx' | 'other';
  };
  category: 'company' | 'products' | 'events' | 'maintenance' | 'other';
  featured: boolean; // Рекомендуемая новость
  published: boolean;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  order: number;
} 