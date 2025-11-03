
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CompanyAnalysis } from './components/CompanyAnalysis';
import { Valuation } from './components/Valuation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import type { NavItem, CompanyData } from './types';
import { NAV_ITEMS } from './constants';
import { getCompanyAnalysis } from './services/geminiService';

function App() {
  const [activeNav, setActiveNav] = useState<NavItem>(NAV_ITEMS[0]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isIndian, setIsIndian] = useState(false);

  const handleAnalyze = async (companyName: string) => {
    setIsLoading(true);
    setError(null);
    setCompanyData(null);
    setActiveNav(NAV_ITEMS[0]); // Switch to analysis view
    try {
      const data = await getCompanyAnalysis(companyName, isIndian);
      setCompanyData(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`An unknown error occurred while analyzing ${companyName}.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <LoadingSpinner />
          <p className="mt-4 text-slate-300">Analyzing company data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <ErrorDisplay 
          title="An Error Occurred" 
          message={error}
          onDismiss={() => setError(null)}
        />
      );
    }
    
    if (!companyData) {
      return <Dashboard onAnalyze={handleAnalyze} isLoading={isLoading} isIndian={isIndian} setIsIndian={setIsIndian} />;
    }

    switch (activeNav.id) {
      case 'analysis':
      case 'news':
      case 'reports': // For now, reports link to analysis
        return <CompanyAnalysis data={companyData} activeNavId={activeNav.id} />;
      case 'valuation':
        return <Valuation companyData={companyData} />;
      default:
        return <Dashboard onAnalyze={handleAnalyze} isLoading={isLoading} isIndian={isIndian} setIsIndian={setIsIndian} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
        isOpen={isSidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <div className="flex-1 flex flex-col">
        <Header 
          onAnalyze={handleAnalyze} 
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          isLoading={isLoading}
          isIndian={isIndian}
          setIsIndian={setIsIndian}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
