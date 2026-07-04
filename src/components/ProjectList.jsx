import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Trash2, Search, ArrowUpDown, Anchor, Calendar } from 'lucide-react';

export default function ProjectList({ projects, onEdit, onDelete, loading = false }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('displayOrder');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'displayOrder', label: 'Display Order' },
    { value: 'title', label: 'Alphabetical' },
    { value: 'lastUpdated', label: 'Last Updated' },
  ];

  const activeOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

  // Format dates nicely (relative for <= 7 days, absolute otherwise)
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 7) {
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return isoString;
    }
  };

  // Helper to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Text highlight helper
  const highlightText = (text, highlight) => {
    if (!text) return '';
    if (!highlight || !highlight.trim()) {
      return <span>{text}</span>;
    }
    const cleanHighlight = highlight.trim();
    try {
      const regex = new RegExp(`(${escapeRegExp(cleanHighlight)})`, 'gi');
      const parts = text.split(regex);
      return (
        <span>
          {parts.map((part, i) => 
            regex.test(part) 
              ? <mark key={i} className="bg-primary/45 text-slate-950 px-0.5 rounded-sm font-semibold">{part}</mark> 
              : part
          )}
        </span>
      );
    } catch (e) {
      return <span>{text}</span>;
    }
  };

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const q = searchQuery.toLowerCase();
    return (
      (project.title || '').toLowerCase().includes(q) ||
      (project.shortDescription || '').toLowerCase().includes(q)
    );
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'displayOrder') {
      const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
      const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
      return orderA - orderB;
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy === 'lastUpdated') {
      return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
    }
    return 0;
  });

  // Loading skeleton rendering
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Search controls skeleton */}
        <div className="flex gap-4 animate-pulse">
          <div className="flex-1 h-12 bg-slate-200/50 rounded-2xl" />
          <div className="w-36 h-12 bg-slate-200/50 rounded-2xl" />
        </div>

        {/* List items skeleton */}
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-emerald-100/20 rounded-2xl p-5 shadow-sm flex justify-between items-center gap-6 relative overflow-hidden">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-slide pointer-events-none" />
            <div className="space-y-2 flex-1 animate-pulse">
              <div className="h-4 bg-slate-200/60 rounded-full w-1/3" />
              <div className="h-3 bg-slate-100 rounded-full w-2/3" />
            </div>
            <div className="flex gap-2 animate-pulse">
              <div className="w-16 h-8 bg-slate-200/40 rounded-xl" />
              <div className="w-16 h-8 bg-slate-200/40 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Search and Sort controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-sans focus:outline-none focus:border-primary/60 focus:bg-white transition-all shadow-inner"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Styled Popover Sort Dropdown */}
        <div className="relative flex items-center" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full sm:w-44 pl-10 pr-8 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700 uppercase tracking-wider text-left transition-all shadow-sm focus:outline-none focus:border-primary/60 hover:bg-white flex items-center justify-between"
          >
            <span>{activeOption.label}</span>
            <div className={`transition-transform duration-200 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          <ArrowUpDown size={14} className="absolute left-4 text-slate-400 pointer-events-none" />

          {/* Options Dropdown Box */}
          {dropdownOpen && (
            <div className="absolute top-full right-0 sm:left-0 mt-2 w-full sm:w-44 bg-white/95 backdrop-blur-md border border-emerald-100/20 rounded-2xl shadow-lg py-1.5 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map((option) => {
                const isActive = option.value === sortBy;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortBy(option.value);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'bg-[#E8FFF5] text-emerald-800' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Directory Count */}
      <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
        <span>Project Directory</span>
        <span>{sortedProjects.length} Island{sortedProjects.length !== 1 && 's'} Found</span>
      </div>

      {/* Project Rows */}
      {sortedProjects.length > 0 ? (
        <div className="space-y-3.5">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/95 backdrop-blur-sm border border-emerald-100/20 rounded-2xl p-5 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
            >
              {/* Info columns */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-950 transition-colors duration-300 truncate">
                    {highlightText(project.title, searchQuery)}
                  </h3>
                  {project.featured && (
                    <span className="inline-flex items-center text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary-bg text-emerald-800 border border-emerald-100/50">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {highlightText(project.shortDescription, searchQuery)}
                </p>
                {/* Individual project Card Last Updated indicator */}
                <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar size={10} className="text-slate-400" />
                  <span>Updated {formatDate(project.lastUpdated)}</span>
                </div>
              </div>

              {/* Actions columns */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {/* Edit Action */}
                <button
                  onClick={() => onEdit(project)}
                  className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all hover:shadow-sm flex items-center gap-1.5"
                  title={`Edit ${project.title}`}
                >
                  <Edit3 size={12} className="text-slate-400 group-hover:text-slate-600" />
                  Edit
                </button>

                {/* Delete Action */}
                <button
                  onClick={() => onDelete(project)}
                  className="px-3.5 py-2 bg-white border border-red-200/60 hover:bg-red-50 hover:border-red-300 text-red-500 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                  title={`Delete ${project.title}`}
                >
                  <Trash2 size={12} className="text-red-400 group-hover:text-red-500" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Card */
        <div className="border border-dashed border-slate-200/80 bg-white/70 backdrop-blur-sm rounded-3xl py-16 px-8 text-center flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
            <Anchor size={24} className="animate-compass-wiggle" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-1">
              No islands found matching coordinates
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              We couldn't locate any projects matching your search term. Try adjusting your filter or mapping a new expedition.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
