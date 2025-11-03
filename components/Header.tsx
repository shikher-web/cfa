
import React, { useState } from 'react';
import { MenuIcon, SearchIcon } from './icons';

interface HeaderProps {
  onAnalyze: (companyName: string) => void;
  onToggleSidebar: () => void;
  isLoading: boolean;
  isIndian: boolean;
  setIsIndian: (isIndian: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ onAnalyze, onToggleSidebar, isLoading, isIndian, setIsIndian }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onAnalyze(companyName.trim());
      setCompanyName('');
    }
  };

  return (
    <header className="flex-shrink-0 h-20 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="md:hidden mr-4 text-slate-400 hover:text-white">
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 max-w-xl">
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Analyzing..." : "Analyze a company (e.g., Apple, Reliance Industries)"}
            className="w-full pl-10 pr-4 py-2 bg-slate-800/70 border border-slate-700 rounded-full text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:bg-slate-800 disabled:cursor-not-allowed"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
        </form>
      </div>
       <div className="flex items-center ml-4">
        <label htmlFor="market-toggle" className="flex items-center cursor-pointer">
          <span className="mr-3 text-sm font-medium text-slate-400">Global (USD)</span>
          <div className="relative">
            <input type="checkbox" id="market-toggle" className="sr-only" checked={isIndian} onChange={() => setIsIndian(!isIndian)} />
            <div className="block bg-slate-700 w-14 h-8 rounded-full"></div>
            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isIndian ? 'transform translate-x-full bg-cyan-400' : ''}`}></div>
          </div>
          <span className="ml-3 text-sm font-medium text-slate-400">Indian (INR)</span>
        </label>
      </div>
    </header>
  );
};