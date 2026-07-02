import React from 'react';
import { ShieldCheck, Calendar, Database } from 'lucide-react';

export default function MetadataCard({ version, lastUpdated }) {
  // Format dates nicely
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-stretch gap-6 border border-emerald-100/30">
      {/* Identity Card Profile */}
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-primary text-xl font-black shadow-md border border-slate-800">
            RR
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-slate-950 p-1 rounded-lg shadow-sm border border-white">
            <ShieldCheck size={12} className="stroke-[2.5]" />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">
            Identity Card
          </span>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            Raj Ranjan
          </h2>
          <code className="text-xs font-mono text-slate-500 block mt-0.5">
            raj.ranjan@compass.dev
          </code>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-[1px] bg-slate-200/60 self-stretch" />

      {/* File / Version Metadata */}
      <div className="flex flex-col sm:flex-row gap-6 md:gap-8 flex-1 justify-around">
        {/* Version Info */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-200/50">
            <Database size={16} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              JSON Version
            </span>
            <span className="text-xl font-black text-slate-900 leading-none whitespace-nowrap">
              Version {version}
            </span>
          </div>
        </div>

        {/* Last Updated Timestamp */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 border border-slate-200/50">
            <Calendar size={16} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
              Last Updated
            </span>
            <span className="text-sm font-bold text-slate-800 leading-tight block">
              {formatDate(lastUpdated)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
