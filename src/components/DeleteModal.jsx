import React, { useState, useEffect } from 'react';
import { AlertTriangle, GitBranch, Globe, Image as ImageIcon, Tag, Bookmark, Layers, X } from 'lucide-react';

export default function DeleteModal({ project, isOpen, onConfirm, onCancel, deleting = false }) {
  // Prevent body scrolling when open
  const [confirmTitle, setConfirmTitle] = useState('');

  // Prevent body scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setConfirmTitle(''); // Reset verify text on open
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, project]);

  const isMatched = confirmTitle.trim() === (project?.title || '');
  const isDisabled = !isMatched || deleting;

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      {/* Modal Card */}
      <div 
        className="relative bg-white border border-red-100/60 rounded-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Title */}
        <div className="flex items-center gap-4 border-b border-red-50 pb-4 mb-6">
          <div className="p-3 bg-red-50 text-red-500 rounded-full border border-red-100/30">
            <AlertTriangle size={24} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">
              Destructive Action
            </span>
            <h3 id="modal-title" className="text-xl font-bold text-slate-900 leading-tight">
              Delete "{project.title}"?
            </h3>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-4 mb-6 text-xs text-red-700 leading-relaxed">
          <strong>Warning:</strong> You are about to permanently remove this project from your portfolio directory. This will overwrite the database file on disk and cannot be undone. Please verify all project details below before confirming.
        </div>

        {/* Complete Project Metadata Showcase */}
        <div className="space-y-5">
          {/* Main Info */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Project Title
            </span>
            <p className="text-sm font-bold text-slate-800">{project.title}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Short Description
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">{project.shortDescription}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Detailed Description
            </span>
            <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3 max-h-32 overflow-y-auto font-sans">
              {project.description}
            </p>
          </div>

          {/* Grid Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Github */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <GitBranch size={10} /> GitHub URL
              </span>
              {project.github ? (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-bold hover:underline truncate block"
                >
                  {project.github}
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">None provided</span>
              )}
            </div>

            {/* Live Link */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Globe size={10} /> Live Website URL
              </span>
              {project.live ? (
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary font-bold hover:underline truncate block"
                >
                  {project.live}
                </a>
              ) : (
                <span className="text-xs text-slate-400 italic">None provided</span>
              )}
            </div>

            {/* Image Preview */}
            <div className="sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                <ImageIcon size={10} /> Image Path / URL
              </span>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2">
                <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center shrink-0 border border-slate-300/40 text-slate-400 overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt="" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                </div>
                <code className="text-[10px] font-mono text-slate-500 truncate block">
                  {project.image || 'No image provided'}
                </code>
              </div>
            </div>

            {/* Category */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <Bookmark size={10} /> Category
              </span>
              <span className="text-xs font-bold text-slate-700">
                {project.category || 'N/A'}
              </span>
            </div>

            {/* Display Order & Featured */}
            <div className="flex gap-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Layers size={10} /> Order
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {project.displayOrder !== undefined ? project.displayOrder : '1'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Featured
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  project.featured 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {project.featured ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Tag size={10} /> Technologies
            </span>
            <div className="flex flex-wrap gap-1">
              {project.tags && project.tags.length > 0 ? (
                project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/50"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None provided</span>
              )}
            </div>
          </div>
        </div>

        {/* Deletion Confirmation Input Verification */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <label htmlFor="confirmTitleInput" className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            To verify deletion, type the project title <code className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100/50 font-bold font-mono text-[10px] select-all">{project.title}</code> below:
          </label>
          <input
            id="confirmTitleInput"
            type="text"
            value={confirmTitle}
            onChange={(e) => setConfirmTitle(e.target.value)}
            placeholder={`Type "${project.title}" to confirm`}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:border-red-400 focus:bg-white focus:ring-1 focus:ring-red-400 transition-all shadow-inner"
            disabled={deleting}
            autoComplete="off"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="px-5 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDisabled}
            className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-md shadow-red-100/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <AlertTriangle size={12} className="stroke-[2.5]" />
            {deleting ? 'Destroying Island...' : 'Delete Project'}
          </button>
        </div>

      </div>
    </div>
  );
}
