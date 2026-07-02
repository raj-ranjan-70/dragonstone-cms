import React from 'react';

export default function BeachBackground({ children }) {
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-[#C5BAA5] via-[#DBCFB8] via-[#E9DDC6] to-[#FAF5EF] font-sans antialiased text-slate-800">
      
      {/* Ocean Water Core - Top Left */}
      <div 
        className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#066B56]/35 via-[#0C9873]/20 via-[#00FA9A]/10 to-transparent pointer-events-none z-0 mix-blend-multiply filter blur-2xl animate-ocean-tide"
      />

      {/* Ambient Float Blobs */}
      <div 
        className="fixed top-1/4 right-[-100px] w-[450px] h-[450px] rounded-full bg-[#00FA9A]/5 pointer-events-none z-0 filter blur-3xl animate-blob-1"
      />
      <div 
        className="fixed bottom-1/4 left-[-150px] w-[500px] h-[500px] rounded-full bg-[#0C9873]/5 pointer-events-none z-0 filter blur-3xl animate-blob-2"
      />

      {/* Layered Aerial Waves Washing Down */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Wave 1 */}
        <div className="absolute w-full h-[6px] bg-gradient-to-r from-transparent via-[#E8FFF5]/40 to-transparent border-t border-[#00FA9A]/10 blur-[1px] animate-aerial-wave" />
        
        {/* Wave 2 */}
        <div 
          className="absolute w-full h-[8px] bg-gradient-to-r from-transparent via-[#E8FFF5]/30 to-transparent border-t border-[#00FA9A]/5 blur-[2px] animate-aerial-wave" 
          style={{ animationDelay: '5s' }}
        />

        {/* Wave 3 */}
        <div 
          className="absolute w-full h-[4px] bg-gradient-to-r from-transparent via-[#E8FFF5]/50 to-transparent border-t border-[#00FA9A]/15 blur-[0.5px] animate-[#00FA9A]/20 animate-aerial-wave" 
          style={{ animationDelay: '10s' }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
