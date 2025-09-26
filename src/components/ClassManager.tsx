import React, { useState } from 'react';
import { Plus, BookOpen, Edit3, Trash2, Palette } from 'lucide-react';
import { useClasses } from '../hooks/useClasses';
import { StudyClass } from '../types';

const ClassManager: React.FC = () => {
  const { classes, loading, createClass, updateClass, deleteClass } = useClasses();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingClass, setEditingClass] = useState<StudyClass | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#729B79'
  });

  const colorOptions = [
    '#729B79', // Brand green
    '#475B63', // Brand slate
    '#102542', // Brand navy
    '#E74C3C', // Red
    '#3498DB', // Blue
    '#9B59B6', // Purple
    '#F39C12', // Orange
    '#1ABC9C', // Teal
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingClass) {
      await updateClass(editingClass.id, formData);
      setEditingClass(null);
    } else {
      await createClass(formData);
      setShowCreateForm(false);
    }
    
    setFormData({ name: '', description: '', color: '#729B79' });
  };

  const handleEdit = (classItem: StudyClass) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      description: classItem.description || '',
      color: classItem.color
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class? This will also delete all associated materials.')) {
      await deleteClass(id);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', color: '#729B79' });
    setShowCreateForm(false);
    setEditingClass(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">My Classes</h1>
          <p className="text-brand-slate font-body">Organize your study materials by subject</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Class
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card p-8">
          <h2 className="text-xl font-header font-bold text-brand-navy mb-6">
            {editingClass ? 'Edit Class' : 'Create New Class'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Class Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                placeholder="e.g., Biology 101, Calculus II"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                placeholder="Brief description of the class"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Color Theme
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      formData.color === color
                        ? 'border-brand-navy scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingClass ? 'Update Class' : 'Create Class'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Classes Grid */}
      {classes.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-brand-green" />
          </div>
          <h3 className="text-xl font-header font-semibold text-brand-navy mb-2">No classes yet</h3>
          <p className="text-brand-slate font-body mb-6">
            Create your first class to start organizing your study materials
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${classItem.color}20` }}
                >
                  <BookOpen 
                    className="w-6 h-6" 
                    style={{ color: classItem.color }}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(classItem)}
                    className="p-2 text-brand-slate/60 hover:text-brand-slate hover:bg-brand-light/50 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem.id)}
                    className="p-2 text-brand-slate/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-header font-semibold text-brand-navy mb-2">
                {classItem.name}
              </h3>
              
              {classItem.description && (
                <p className="text-brand-slate/70 text-sm font-body mb-4 line-clamp-2">
                  {classItem.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-brand-slate/60 font-body">
                <span>Created {new Date(classItem.created_at).toLocaleDateString()}</span>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: classItem.color }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassManager;