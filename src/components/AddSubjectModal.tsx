import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Subject } from '../types';

interface AddSubjectModalProps {
  onClose: () => void;
  onAdd: (subject: Omit<Subject, 'id' | 'createdAt' | 'totalStudyTime' | 'masteryLevel'>) => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: '📚'
  });

  const colors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  const icons = ['📚', '🔬', '📖', '🧮', '🌍', '⚗️', '🎨', '💻', '🏛️', '🧠', '🔍', '📊'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-brand-sage/20">
          <h2 className="text-xl font-header font-bold text-brand-navy">
            Add New Subject
          </h2>
          <button
            onClick={onClose}
            className="text-brand-slate hover:text-brand-navy transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Subject Name */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Subject Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
              placeholder="e.g., Biology, Mathematics, History"
              required
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 ${
                    formData.color === color.value
                      ? 'border-brand-navy scale-110'
                      : 'border-brand-sage/30 hover:border-brand-green'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-3">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={`w-12 h-12 rounded-lg border-2 text-2xl flex items-center justify-center transition-all duration-200 ${
                    formData.icon === icon
                      ? 'border-brand-navy bg-brand-sage/20 scale-110'
                      : 'border-brand-sage/30 hover:border-brand-green hover:bg-brand-light/50'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-brand-light/50 rounded-lg">
            <h3 className="text-sm font-medium text-brand-navy mb-3 font-body">Preview:</h3>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon}
              </div>
              <div>
                <h4 className="font-medium text-brand-navy font-body">
                  {formData.name || 'Subject Name'}
                </h4>
                <p className="text-sm text-brand-slate font-body">0 materials • 0% mastery</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-brand-sage/50 text-brand-slate rounded-lg hover:bg-brand-light/50 transition-colors font-body font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectModal;
