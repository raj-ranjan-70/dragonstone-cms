import React, { useState, useEffect } from 'react';
import { FolderGit, PlusCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Opaque background transition after 50px
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll progress calculation
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'projects', label: 'Current Projects', icon: FolderGit },
    { id: 'add', label: 'Add New Project', icon: PlusCircle },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-emerald-100/20 shadow-sm py-4' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 select-none">
          <img 
            src="/dragon-sticker-icon-remastered.jpeg" 
            alt="Dragonstone Logo" 
            className="w-9 h-9 rounded-xl object-cover shadow-sm" 
          />
          <div>
            <h1 className="text-sm font-black tracking-widest text-slate-900 uppercase">
              Dragonstone
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Tab Toggle Pill Container */}
        <nav className="bg-slate-50 border border-slate-100 p-1 rounded-full relative flex items-center shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 z-10 flex items-center gap-2 ${
                  isActive 
                    ? 'text-slate-900' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {/* Visual active slider backing */}
                {isActive && (
                  <div className="absolute inset-0 bg-white border border-slate-100 rounded-full -z-10 shadow-sm transition-all duration-300" />
                )}
                <Icon size={14} className={isActive ? 'text-primary' : ''} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Scroll-spy Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-slate-100/50">
        <div 
          className="h-full bg-primary transition-all duration-75 ease-out rounded-r-full"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
  );
}
