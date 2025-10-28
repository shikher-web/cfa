
import React, { useState, useEffect } from 'react';
import type { CompanyData } from '../types';
import { FinancialStatementTable } from './FinancialStatementTable';
import { RatioAnalysis } from './RatioAnalysis';

interface CompanyAnalysisProps {
  data: CompanyData;
  activeNavId: string;
}

type AnalysisTab = 'overview' | 'financials' | 'ratios' | 'news';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            active ? 'bg-cyan-400/20 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'
        }`}
    >
        {children}
    </button>
);

export const CompanyAnalysis: React.FC<CompanyAnalysisProps> = ({ data, activeNavId }) => {
  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');

  useEffect(() => {
    // Sync the active tab with the main sidebar navigation
    switch (activeNavId) {
      case 'news':
        setActiveTab('news');
        break;
      case 'analysis':
      case 'reports': // Default 'reports' to the main overview for now
      default:
        setActiveTab('overview');
        break;
    }
  }, [activeNavId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 shadow-lg">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Company Summary</h3>
            <p className="text-slate-300 leading-relaxed">{data.summary}</p>
          </div>
        );
      case 'financials':
        return (
          <div className="space-y-8">
            <FinancialStatementTable title="Income Statement" data={data.incomeStatement} currency={data.currency} />
            <FinancialStatementTable title="Balance Sheet" data={data.balanceSheet} currency={data.currency} />
            <FinancialStatementTable title="Cash Flow Statement" data={data.cashFlowStatement} currency={data.currency} />
          </div>
        );
      case 'ratios':
        return <RatioAnalysis ratios={data.ratios} ratioHistory={data.ratioHistory} />;
      case 'news':
        return (
          <div className="space-y-4">
            {data.news.map((article, index) => (
              <div key={index} className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50">
                <h4 className="font-semibold text-purple-300 text-lg">{article.headline}</h4>
                <p className="text-sm text-slate-500 mb-2">{article.source}</p>
                <p className="text-slate-300">{article.summary}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/50">
        <h2 className="text-3xl font-bold text-white">{data.companyName} ({data.ticker})</h2>
        <p className="text-slate-400">Currency: {data.currency}</p>
      </div>

      <div className="flex space-x-2 p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>Overview</TabButton>
        <TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')}>Financials</TabButton>
        <TabButton active={activeTab === 'ratios'} onClick={() => setActiveTab('ratios')}>Ratios & Charts</TabButton>
        <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')}>News</TabButton>
      </div>

      <div className="animate-fade-in">
        {renderTabContent()}
      </div>
    </div>
  );
};
