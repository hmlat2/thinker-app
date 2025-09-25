import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StudyMaterial } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useStudyMaterials = (classId?: string) => {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMaterials = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('study_materials')
        .select('*')
        .eq('user_id', user.id);

      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMaterial = async (materialData: Omit<StudyMaterial, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('study_materials')
        .insert([{ ...materialData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      setMaterials(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating material:', error);
      return null;
    }
  };

  const updateMaterial = async (id: string, updates: Partial<StudyMaterial>) => {
    try {
      const { data, error } = await supabase
        .from('study_materials')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setMaterials(prev => prev.map(m => m.id === id ? data : m));
      return data;
    } catch (error) {
      console.error('Error updating material:', error);
      return null;
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('study_materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMaterials(prev => prev.filter(m => m.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting material:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [user, classId]);

  return {
    materials,
    loading,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    refetch: fetchMaterials
  };
};