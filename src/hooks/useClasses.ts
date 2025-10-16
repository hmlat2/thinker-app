import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StudyClass } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useClasses = () => {
  const [classes, setClasses] = useState<StudyClass[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClasses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('study_classes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (classData: Omit<StudyClass, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      console.error('No user found when creating class');
      return null;
    }

    try {
      console.log('Creating class with data:', { ...classData, user_id: user.id });

      const { data, error } = await supabase
        .from('study_classes')
        .insert([{ ...classData, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Class created successfully:', data);
      setClasses(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating class:', error);
      alert(`Failed to create class: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const updateClass = async (id: string, updates: Partial<StudyClass>) => {
    try {
      const { data, error } = await supabase
        .from('study_classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClasses(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (error) {
      console.error('Error updating class:', error);
      return null;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      const { error } = await supabase
        .from('study_classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClasses(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting class:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  return {
    classes,
    loading,
    createClass,
    updateClass,
    deleteClass,
    refetch: fetchClasses
  };
};