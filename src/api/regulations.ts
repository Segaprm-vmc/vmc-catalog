import type { Regulation } from '@/types';

const REGULATIONS_FILE_PATH = '/data/regulations.json';

export class RegulationsAPI {
  static async getAllRegulations(): Promise<Regulation[]> {
    try {
      const response = await fetch(REGULATIONS_FILE_PATH);
      if (!response.ok) {
        throw new Error('Failed to fetch regulations');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка загрузки регламентов:', error);
      return [];
    }
  }

  static async saveAllRegulations(regulations: Regulation[]): Promise<boolean> {
    try {
      // В реальном приложении здесь должен быть POST запрос к серверу
      // Для демонстрации сохраняем в localStorage и обновляем файл
      localStorage.setItem('vmc-regulations', JSON.stringify(regulations));
      
      // Эмуляция сохранения файла
      console.log('Регламенты сохранены:', regulations);
      return true;
    } catch (error) {
      console.error('Ошибка сохранения регламентов:', error);
      return false;
    }
  }

  static async createRegulation(regulationData: Omit<Regulation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Regulation | null> {
    try {
      const allRegulations = await this.getAllRegulations();
      const newRegulation: Regulation = {
        id: `reg-${Date.now()}`,
        ...regulationData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: Math.max(...allRegulations.map(r => r.order || 0), 0) + 1
      };

      const updatedRegulations = [...allRegulations, newRegulation];
      const success = await this.saveAllRegulations(updatedRegulations);
      
      return success ? newRegulation : null;
    } catch (error) {
      console.error('Ошибка создания регламента:', error);
      return null;
    }
  }

  static async updateRegulation(id: string, regulationData: Partial<Regulation>): Promise<Regulation | null> {
    try {
      const allRegulations = await this.getAllRegulations();
      const regulationIndex = allRegulations.findIndex(r => r.id === id);
      
      if (regulationIndex === -1) {
        throw new Error('Регламент не найден');
      }

      const updatedRegulation = {
        ...allRegulations[regulationIndex],
        ...regulationData,
        id, // Обеспечиваем неизменность ID
        updatedAt: new Date().toISOString()
      };

      allRegulations[regulationIndex] = updatedRegulation;
      const success = await this.saveAllRegulations(allRegulations);
      
      return success ? updatedRegulation : null;
    } catch (error) {
      console.error('Ошибка обновления регламента:', error);
      return null;
    }
  }

  static async deleteRegulation(id: string): Promise<boolean> {
    try {
      const allRegulations = await this.getAllRegulations();
      const filteredRegulations = allRegulations.filter(r => r.id !== id);
      
      if (filteredRegulations.length === allRegulations.length) {
        throw new Error('Регламент не найден');
      }

      return await this.saveAllRegulations(filteredRegulations);
    } catch (error) {
      console.error('Ошибка удаления регламента:', error);
      return false;
    }
  }

  static async reorderRegulations(regulationIds: string[]): Promise<boolean> {
    try {
      const allRegulations = await this.getAllRegulations();
      const reorderedRegulations = regulationIds.map((id, index) => {
        const regulation = allRegulations.find(r => r.id === id);
        if (!regulation) throw new Error(`Регламент с ID ${id} не найден`);
        return { ...regulation, order: index + 1 };
      });

      return await this.saveAllRegulations(reorderedRegulations);
    } catch (error) {
      console.error('Ошибка изменения порядка регламентов:', error);
      return false;
    }
  }
} 