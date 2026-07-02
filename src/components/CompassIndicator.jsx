import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

export default function CompassIndicator() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3.5 bg-slate-900 border border-slate-800 rounded-full text-white shadow-lg z-40 hover:border-primary/40 hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary/50"
      title="Scroll back to top of the map"
      aria-label="Back to top"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Outer Ring dial markings */}
        <div className="absolute inset-0 border border-dashed border-slate-700/50 rounded-full group-hover:border-primary/20 transition-colors duration-300" />
        
        {/* Compass Needle - Custom premium SVG */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-full h-full text-slate-400 group-hover:text-primary transition-colors duration-300"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          {/* North needle pointer */}
          <polygon 
            points="12,4 15,12 12,10 9,12" 
            className="animate-compass-wiggle origin-center text-primary fill-primary"
            style={{ 
              transformOrigin: '12px 12px',
              filter: 'drop-shadow(0 2px 4px rgba(0, 250, 154, 0.3))' 
            }}
          />
          {/* South needle pointer */}
          <polygon 
            points="12,20 15,12 12,10 9,12" 
            className="fill-slate-700 text-slate-700 group-hover:fill-slate-500 group-hover:text-slate-500 transition-colors duration-300"
            style={{ transformOrigin: '12px 12px' }}
          />
        </svg>
      </div>
    </button>
  );
}
