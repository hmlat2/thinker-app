import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Brain, 
  Target,
  Calendar,
  Tag,
  Edit3,
  Trash2
} from 'lucide-react';
import { useClasses } from '../hooks/useClasses';
import { useStudyMaterials } from '../hooks/useStudyMaterials';

const StudyMaterialsView: React.FC = () => {
  const { classes } = useClasses();
  const { materials, createMaterial, updateMaterial, deleteMaterial } = useStudyMaterials();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'note' as 'note' | 'flashcard' | 'summary' | 'quiz',
    class_id: '',
    tags: [] as string[]
  });

  const materialTypes = [
    { value: 'note', label: 'Notes', icon: FileText },
    { value: 'summary', label: 'Summary', icon: Brain },
    { value: 'flashcard', label: 'Flashcards', icon: Target },
    { value: 'quiz', label: 'Quiz', icon: BookOpen }
  ];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = !selectedClass || material.class_id === selectedClass;
    const matchesType = !selectedType || material.type === selectedType;
    
    return matchesSearch && matchesClass && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMaterial) {
      await updateMaterial(editingMaterial.id, formData);
      setEditingMaterial(null);
    } else {
      await createMaterial(formData);
      setShowCreateForm(false);
    }
    
    setFormData({
      title: '',
      content: '',
      type: 'note',
      class_id: '',
      tags: []
    });
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      content: material.content,
      type: material.type,
      class_id: material.class_id,
      tags: material.tags || []
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      await deleteMaterial(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'note',
      class_id: '',
      tags: []
    });
    setShowCreateForm(false);
    setEditingMaterial(null);
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = materialTypes.find(t => t.value === type);
    const Icon = typeInfo?.icon || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const getClassInfo = (classId: string) => {
    return classes.find(c => c.id === classId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">Study Materials</h1>
          <p className="text-brand-slate font-body">
            Organize and access all your study content in one place
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Material
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-slate/50 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
            >
              <option value="">All Types</option>
              {materialTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="card p-8">
          <h2 className="text-xl font-header font-bold text-brand-navy mb-6">
            {editingMaterial ? 'Edit Material' : 'Add New Material'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                  placeholder="Material title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Class *
                </label>
                <select
                  value={formData.class_id}
                  onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                  className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                  required
                >
                  <option value="">Select a class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {materialTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as any })}
                      className={`p-4 border-2 rounded-lg transition-all flex flex-col items-center space-y-2 ${
                        formData.type === type.value
                          ? 'border-brand-green bg-brand-green/10'
                          : 'border-brand-sage/30 hover:border-brand-green/50'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-brand-green" />
                      <span className="text-sm font-body">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body"
                placeholder="Enter your study material content..."
                rows={8}
                required
              />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingMaterial ? 'Update Material' : 'Create Material'}
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

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-brand-green" />
          </div>
          <h3 className="text-xl font-header font-semibold text-brand-navy mb-2">
            {searchTerm || selectedClass || selectedType ? 'No materials found' : 'No materials yet'}
          </h3>
          <p className="text-brand-slate font-body mb-6">
            {searchTerm || selectedClass || selectedType 
              ? 'Try adjusting your search or filters'
              : 'Create your first study material to get started'
            }
          </p>
          {!searchTerm && !selectedClass && !selectedType && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Material
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => {
            const classInfo = getClassInfo(material.class_id);
            
            return (
              <div key={material.id} className="card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${classInfo?.color || '#729B79'}20` }}
                  >
                    <div style={{ color: classInfo?.color || '#729B79' }}>
                      {getTypeIcon(material.type)}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-2 text-brand-slate/60 hover:text-brand-slate hover:bg-brand-light/50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 text-brand-slate/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-header font-semibold text-brand-navy mb-2 line-clamp-2">
                  {material.title}
                </h3>
                
                <p className="text-brand-slate/70 text-sm font-body mb-3">
                  {classInfo?.name || 'Unknown Class'}
                </p>
                
                <p className="text-brand-slate text-sm font-body mb-4 line-clamp-3">
                  {material.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-brand-slate/60 font-body">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(material.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className="capitalize">{material.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsView;