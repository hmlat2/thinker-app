import { useLocalStorage } from './useLocalStorage';
import { StudyClass } from '../types';

export const useClasses = () => {
  const [classes, setClasses] = useLocalStorage<StudyClass[]>('study_classes', []);

  const createClass = async (classData: Omit<StudyClass, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const newClass: StudyClass = {
      ...classData,
      id: crypto.randomUUID(),
      user_id: 'local-user',
      total_study_time: 0,
      mastery_level: 0,
      last_studied: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setClasses(prev => [newClass, ...prev]);
    return newClass;
  };

  const updateClass = async (id: string, updates: Partial<StudyClass>) => {
    const updatedClass = classes.find(c => c.id === id);
    if (!updatedClass) return null;

    const newClass = { ...updatedClass, ...updates, updated_at: new Date().toISOString() };
    setClasses(prev => prev.map(c => c.id === id ? newClass : c));
    return newClass;
  };

  const deleteClass = async (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
    return true;
  };

  return {
    classes,
    loading: false,
    createClass,
    updateClass,
    deleteClass,
    refetch: () => {}
  };
};
