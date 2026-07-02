import React, { useState, useEffect } from 'react';
import BeachBackground from './components/BeachBackground';
import Navbar from './components/Navbar';
import MetadataCard from './components/MetadataCard';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import DeleteModal from './components/DeleteModal';
import CompassIndicator from './components/CompassIndicator';
import Toast from './components/Toast';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [projectsData, setProjectsData] = useState({ version: 1, lastUpdated: '', projects: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');
  
  // Modals / Overlay States
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast Helpers
  const addToast = (type, title, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch projects data from local API
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to read catalog from disk');
      }
      const data = await response.json();
      setProjectsData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while loading projects.');
      addToast('error', 'Sync Failure', 'Could not fetch database records.');
    } finally {
      // Add a slight artificial delay for loading state/skeleton preview
      setTimeout(() => {
        setLoading(false);
      }, 600);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Save projects data back to disk
  const saveProjectsToDisk = async (updatedData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to save updates to disk');
      }

      setProjectsData(updatedData);
      return true;
    } catch (err) {
      addToast('error', 'Save Error', err.message || 'Failed to update projects.json');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Create Project Action
  const handleCreateProject = async (formData) => {
    const newProject = {
      ...formData,
      id: crypto.randomUUID(),
      lastUpdated: new Date().toISOString()
    };

    const updatedProjects = [...projectsData.projects, newProject];
    const updatedData = {
      ...projectsData,
      version: (projectsData.version || 0) + 1,
      lastUpdated: new Date().toISOString(),
      projects: updatedProjects
    };

    const success = await saveProjectsToDisk(updatedData);
    if (success) {
      addToast('success', 'Island Created', `"${formData.title}" has been added successfully.`);
      setActiveTab('projects');
    }
  };

  // Update Project Action
  const handleUpdateProject = async (formData) => {
    if (!editingProject) return;

    const updatedProjects = projectsData.projects.map((proj) => {
      if (proj.id === editingProject.id) {
        return {
          ...proj,
          ...formData,
          lastUpdated: new Date().toISOString()
        };
      }
      return proj;
    });

    const updatedData = {
      ...projectsData,
      version: (projectsData.version || 0) + 1,
      lastUpdated: new Date().toISOString(),
      projects: updatedProjects
    };

    const success = await saveProjectsToDisk(updatedData);
    if (success) {
      addToast('success', 'Island Updated', `"${formData.title}" details have been updated.`);
      setEditingProject(null);
    }
  };

  // Delete Project Action
  const handleDeleteProject = async () => {
    if (!deletingProject) return;

    const updatedProjects = projectsData.projects.filter(
      (proj) => proj.id !== deletingProject.id
    );

    const updatedData = {
      ...projectsData,
      version: (projectsData.version || 0) + 1,
      lastUpdated: new Date().toISOString(),
      projects: updatedProjects
    };

    const success = await saveProjectsToDisk(updatedData);
    if (success) {
      addToast('success', 'Island Deleted', `"${deletingProject.title}" has been deleted.`);
      setDeletingProject(null);
    }
  };

  return (
    <BeachBackground>
      {/* Navbar navigation toggler */}
      <Navbar 
        activeTab={editingProject ? null : activeTab} 
        setActiveTab={(tab) => {
          setEditingProject(null);
          setActiveTab(tab);
        }} 
      />

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-24 mt-8 space-y-8 min-h-[calc(100vh-160px)]">
        
        {/* Error Alert Box */}
        {error ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-white border border-red-100/60 rounded-3xl p-8 max-w-lg w-full text-center shadow-lg flex flex-col items-center gap-5">
              <div className="p-4 bg-red-50 text-red-500 rounded-full border border-red-100/20">
                <AlertTriangle size={32} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Database Connection Error
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {error}. Make sure the Vite development server is running and the `projects.json` file exists in your workspace directory.
                </p>
              </div>
              <button
                onClick={fetchProjects}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw size={14} />
                Try Reconnecting
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* View State Rendering */}
            {editingProject ? (
              /* Swapped Inline Edit Form */
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
                <ProjectForm 
                  initialData={editingProject} 
                  onSave={handleUpdateProject} 
                  onCancel={() => setEditingProject(null)} 
                  submitting={submitting} 
                />
              </div>
            ) : activeTab === 'projects' ? (
              /* Catalog Manager View */
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Metadata details header */}
                <MetadataCard 
                  version={projectsData.version} 
                  lastUpdated={projectsData.lastUpdated} 
                />
                
                {/* Searchable lists */}
                <ProjectList 
                  projects={projectsData.projects} 
                  onEdit={setEditingProject} 
                  onDelete={setDeletingProject}
                  loading={loading}
                />
              </div>
            ) : (
              /* Add New Project View */
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
                <ProjectForm 
                  onSave={handleCreateProject} 
                  onCancel={() => setActiveTab('projects')} 
                  submitting={submitting} 
                />
              </div>
            )}
          </>
        )}

      </main>

      {/* Footer copyright */}
      <footer className="py-12 border-t border-slate-200/40 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        <p>&copy; {new Date().getFullYear()} Dragonstone. All rights reserved.</p>
      </footer>

      {/* Floating Action Elements */}
      <CompassIndicator />

      {/* Destructive Action Modal */}
      <DeleteModal 
        project={deletingProject} 
        isOpen={!!deletingProject} 
        onConfirm={handleDeleteProject} 
        onCancel={() => setDeletingProject(null)} 
        deleting={submitting}
      />

      {/* Floating Toasts container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

    </BeachBackground>
  );
}
