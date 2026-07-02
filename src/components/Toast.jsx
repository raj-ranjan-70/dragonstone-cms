import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, XCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const typeConfig = {
    success: {
      bg: 'bg-[#E8FFF5]',
      text: 'text-[#065F46]',
      border: 'border-[#10b981]/15',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-[#FEF2F2]',
      text: 'text-[#EF4444]',
      border: 'border-[#ef4444]/15',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-500/15',
      icon: AlertCircle,
    }
  };

  const config = typeConfig[toast.type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div 
      className={`max-w-sm w-full bg-white border ${config.border} rounded-2xl shadow-lg p-4 flex items-start gap-3 pointer-events-auto animate-in slide-in-from-bottom-5 duration-300`}
      role="alert"
    >
      {/* Type-specific Icon Container */}
      <div className={`p-1.5 rounded-lg ${config.bg} ${config.text} shrink-0`}>
        <Icon size={16} className="stroke-[2.5]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          {toast.title || toast.type}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          {toast.message}
        </p>
      </div>

      {/* Close button */}
      <button 
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-600 rounded-lg p-0.5 hover:bg-slate-100 transition-colors shrink-0"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
