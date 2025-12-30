
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <span className="text-white font-black text-xl italic">N</span>
            </div>
            <h1 className="text-xl font-bold font-orbitron tracking-tighter neon-text">
              NOVA<span className="text-cyan-400">GFX</span>PRO
            </h1>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#" className="text-cyan-400">OTIMIZADOR</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">BENCHMARK</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">PERFIS</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">SOBRE</a>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-slate-900 py-8 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <p>© 2024 Nova GFX Engineering. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-300">Privacidade</a>
            <a href="#" className="hover:text-slate-300">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
