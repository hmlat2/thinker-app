import { useLocalStorage } from './useLocalStorage';
import { StudyMaterial } from '../types';

export const useStudyMaterials = (classId?: string) => {
  const [allMaterials, setAllMaterials] = useLocalStorage<StudyMaterial[]>('study_materials', []);

  const materials = classId
    ? allMaterials.filter(m => m.class_id === classId)
    : allMaterials;

  const createMaterial = async (materialData: Omit<StudyMaterial, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newMaterial: StudyMaterial = {
      ...materialData,
      id: crypto.randomUUID(),
      user_id: 'local-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setAllMaterials(prev => [newMaterial, ...prev]);
    return newMaterial;
  };

  const updateMaterial = async (id: string, updates: Partial<StudyMaterial>) => {
    const material = allMaterials.find(m => m.id === id);
    if (!material) return null;

    const updatedMaterial = { ...material, ...updates, updated_at: new Date().toISOString() };
    setAllMaterials(prev => prev.map(m => m.id === id ? updatedMaterial : m));
    return updatedMaterial;
  };

  const deleteMaterial = async (id: string) => {
    setAllMaterials(prev => prev.filter(m => m.id !== id));
    return true;
  };

  return {
    materials,
    loading: false,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    refetch: () => {}
  };
};
