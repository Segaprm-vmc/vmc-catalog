// Переход на Supabase API
export { SupabaseRegulationsAPI as RegulationsAPI, type RegulationItem } from './supabaseRegulations';

// Для обратной совместимости
import { SupabaseRegulationsAPI } from './supabaseRegulations';

export const getRegulations = () => SupabaseRegulationsAPI.getRegulations();
export const getRegulationById = (id: string) => SupabaseRegulationsAPI.getRegulationById(id);
export const getRegulationsByCategory = (category: string) => SupabaseRegulationsAPI.getRegulationsByCategory(category);
export const searchRegulations = (query: string) => SupabaseRegulationsAPI.searchRegulations(query); 