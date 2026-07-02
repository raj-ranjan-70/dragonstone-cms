import React, { useState, useEffect } from 'react';
import { Plus, X, Globe, GitBranch, Image, Hash, ListOrdered, CheckCircle2, RotateCcw } from 'lucide-react';

export default function ProjectForm({ initialData = null, onSave, onCancel, submitting = false }) {
  const isEditMode = !!initialData;

  // Default empty structure
  const defaultState = {
    title: '',
    shortDescription: '',
    description: '',
    github: '',
    live: '',
    image: '',
    tags: [],
    featured: false,
    displayOrder: 1,
    category: ''
  };

  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  // Prefill when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        shortDescription: initialData.shortDescription || '',
        description: initialData.description || '',
        github: initialData.github || '',
        live: initialData.live || '',
        image: initialData.image || '',
        tags: initialData.tags || [],
        featured: !!initialData.featured,
        displayOrder: initialData.displayOrder !== undefined ? initialData.displayOrder : 1,
        category: initialData.category || ''
      });
    } else {
      setFormData(defaultState);
    }
    setErrors({});
  }, [initialData]);

  // Check if a field is modified from initial data
  const isFieldModified = (fieldName) => {
    if (!isEditMode || !initialData) return false;
    const initialVal = initialData[fieldName] !== undefined ? initialData[fieldName] : defaultState[fieldName];
    const currentVal = formData[fieldName];

    if (fieldName === 'tags') {
      return JSON.stringify(initialVal) !== JSON.stringify(currentVal);
    }
    return initialVal !== currentVal;
  };

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // Tag list helpers
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };

  // URL Validation helper
  const isValidUrl = (urlString) => {
    if (!urlString) return true; // Optional fields can be empty
    try {
      // Relative paths are allowed for thumbnails
      if (urlString.startsWith('/') || urlString.startsWith('./') || urlString.startsWith('../')) {
        return true;
      }
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project Title is required';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title must be 50 characters or less';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short Description is required';
    } else if (formData.shortDescription.length > 120) {
      newErrors.shortDescription = 'Short Description must be 120 characters or less';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Detailed Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Detailed Description must be at least 20 characters';
    }

    if (!isValidUrl(formData.github)) {
      newErrors.github = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (!isValidUrl(formData.live)) {
      newErrors.live = 'Please enter a valid URL (starting with http:// or https://)';
    }

    if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL or image path (e.g. /images/project.webp)';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one technology tag is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 md:p-8 space-y-6 border border-emerald-100/30">
      
      {/* Form Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
            {isEditMode ? 'Modify Coordinates' : 'New Expedition'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            {isEditMode ? `Edit "${initialData.title}"` : 'Add New Portfolio Project'}
          </h2>
        </div>
        {isEditMode && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 tracking-wider uppercase">
            Editing Mode
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Project Title <span className="text-red-500">*</span></span>
            {isFieldModified('title') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Travel Comparison Pro"
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
              errors.title 
                ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                : isFieldModified('title')
                  ? 'border-primary/60 bg-white focus:border-primary'
                  : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
            }`}
          />
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-red-500">{errors.title}</span>
            <span className="text-slate-400 font-mono">{formData.title.length}/50</span>
          </div>
        </div>

        {/* Category & Order */}
        <div className="grid grid-cols-2 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
              <span>Category</span>
              {isFieldModified('category') && (
                <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
              )}
            </label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Web App"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                isFieldModified('category')
                  ? 'border-primary/60 bg-white focus:border-primary'
                  : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
              }`}
            />
          </div>

          {/* Display Order */}
          <div className="space-y-2">
            <label htmlFor="displayOrder" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
              <span>Display Order</span>
              {isFieldModified('displayOrder') && (
                <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
              )}
            </label>
            <div className="relative">
              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                  isFieldModified('displayOrder')
                    ? 'border-primary/60 bg-white focus:border-primary'
                    : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
                }`}
              />
              <ListOrdered size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="shortDescription" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Short Description <span className="text-red-500">*</span></span>
            {isFieldModified('shortDescription') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <input
            id="shortDescription"
            name="shortDescription"
            type="text"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="A clean, one-sentence description of the project (visible in listing overview)."
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
              errors.shortDescription 
                ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                : isFieldModified('shortDescription')
                  ? 'border-primary/60 bg-white focus:border-primary'
                  : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
            }`}
          />
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-red-500">{errors.shortDescription}</span>
            <span className="text-slate-400 font-mono">{formData.shortDescription.length}/120</span>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Detailed Description <span className="text-red-500">*</span></span>
            {isFieldModified('description') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what the project does, key features, architecture, and what challenges you solved..."
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all resize-y ${
              errors.description 
                ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400' 
                : isFieldModified('description')
                  ? 'border-primary/60 bg-white focus:border-primary'
                  : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
            }`}
          />
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-red-500">{errors.description}</span>
            <span className="text-slate-400 font-mono">Minimum 20 chars ({formData.description.length})</span>
          </div>
        </div>

        {/* GitHub Link */}
        <div className="space-y-2">
          <label htmlFor="github" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>GitHub Repository URL</span>
            {isFieldModified('github') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <div className="relative">
            <input
              id="github"
              name="github"
              type="text"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                errors.github 
                  ? 'border-red-300 focus:border-red-400' 
                  : isFieldModified('github')
                    ? 'border-primary/60 bg-white focus:border-primary'
                    : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
              }`}
            />
            <GitBranch size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="text-red-500 text-[11px] block">{errors.github}</span>
        </div>

        {/* Live Website Link */}
        <div className="space-y-2">
          <label htmlFor="live" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Live Website URL</span>
            {isFieldModified('live') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <div className="relative">
            <input
              id="live"
              name="live"
              type="text"
              value={formData.live}
              onChange={handleChange}
              placeholder="https://project.com"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                errors.live 
                  ? 'border-red-300 focus:border-red-400' 
                  : isFieldModified('live')
                    ? 'border-primary/60 bg-white focus:border-primary'
                    : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
              }`}
            />
            <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="text-red-500 text-[11px] block">{errors.live}</span>
        </div>

        {/* Image/Thumbnail URL */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="image" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Thumbnail / Image URL</span>
            {isFieldModified('image') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <div className="relative">
            <input
              id="image"
              name="image"
              type="text"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/projects/thumbnail.webp"
              className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-2xl text-sm focus:outline-none transition-all ${
                errors.image 
                  ? 'border-red-300 focus:border-red-400' 
                  : isFieldModified('image')
                    ? 'border-primary/60 bg-white focus:border-primary'
                    : 'border-slate-200/80 focus:border-primary/60 focus:bg-white'
              }`}
            />
            <Image size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <span className="text-red-500 text-[11px] block">{errors.image}</span>
        </div>

        {/* Technology/Tags Input */}
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="tags" className="text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Technologies / Tags <span className="text-red-500">*</span></span>
            {isFieldModified('tags') && (
              <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100">Modified</span>
            )}
          </label>
          <div className="space-y-3">
            {/* Tag List Container */}
            {formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl min-h-[46px]">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#E8FFF5] text-emerald-800 border border-emerald-100/50 font-sans tracking-wide"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-emerald-200/60 rounded-full p-0.5 text-emerald-700 transition-colors"
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl p-4 text-center">
                No technologies added yet. Type below and press Enter.
              </div>
            )}

            {/* Tag Input Field */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  id="tags"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g. Next.js, React, Tailwind (Press Enter to add)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-primary/60 focus:bg-white transition-all"
                />
                <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <span className="text-red-500 text-[11px] block">{errors.tags}</span>
          </div>
        </div>

        {/* Featured toggle */}
        <div className="md:col-span-2 pt-2">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <input
              name="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              Featured Project
              {isFieldModified('featured') && (
                <span className="text-[9px] font-bold text-primary bg-[#E8FFF5] px-1.5 py-0.2 rounded border border-emerald-100 normal-case">Modified</span>
              )}
            </span>
          </label>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-6 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <RotateCcw size={12} />
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-primary font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all hover:shadow-emerald-100/50 disabled:opacity-50 flex items-center gap-2"
        >
          <CheckCircle2 size={12} className="stroke-[2.5]" />
          {submitting ? 'Saving Changes...' : isEditMode ? 'Save Changes' : 'Launch Project'}
        </button>
      </div>

    </form>
  );
}
