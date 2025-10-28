
import React, { useState } from 'react';
import { SearchIcon, GlobeIcon, IndianRupeeIcon } from './icons';

interface DashboardProps {
  onAnalyze: (companyName: string, isIndian: boolean) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAnalyze }) => {
  const [companyName, setCompanyName] = useState('');
  const [isIndian, setIsIndian] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) {
      onAnalyze(companyName.trim(), isIndian);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4">
          Welcome to Cosmic Financial Analysis
        </h1>
        <p className="text-lg text-slate-400 mb-8">
          Navigate the financial universe. Enter a company name to begin your journey through stellar data and cosmic insights.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
            <div className="relative w-full max-w-lg">
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name..."
                    className="w-full pl-5 pr-12 py-4 text-lg bg-slate-800/50 border-2 border-slate-700 rounded-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-purple-600 rounded-full hover:bg-purple-500 transition-colors">
                    <SearchIcon className="h-6 w-6 text-white"/>
                </button>
            </div>
            
            <div className="flex items-center space-x-4 p-2 bg-slate-800/50 border border-slate-700 rounded-full">
                <button type="button" onClick={() => setIsIndian(false)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${!isIndian ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <GlobeIcon className="h-5 w-5" /> Global (USD)
                </button>
                <button type="button" onClick={() => setIsIndian(true)} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isIndian ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <IndianRupeeIcon className="h-5 w-5" /> Indian (INR)
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};
