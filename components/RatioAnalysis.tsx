
import React from 'react';
import type { Ratio, RatioHistory } from '../types';
import { ChartComponent } from './ChartComponent';

interface RatioAnalysisProps {
  ratios: Ratio[];
  ratioHistory: RatioHistory[];
}

const RatioCard: React.FC<{ ratio: Ratio }> = ({ ratio }) => (
  <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700/50 flex flex-col justify-between transform hover:-translate-y-1 transition-transform duration-300 shadow-lg">
    <div>
        <h4 className="font-semibold text-purple-300">{ratio.name}</h4>
        <p className="text-3xl font-bold text-white my-2">{ratio.value}</p>
        <p className="text-sm text-slate-400 mb-3">{ratio.commentary}</p>
    </div>
    <p className="text-xs text-slate-500 mt-2">Industry Benchmark: {ratio.benchmark}</p>
  </div>
);


export const RatioAnalysis: React.FC<RatioAnalysisProps> = ({ ratios, ratioHistory }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Key Ratios (2025)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ratios.map((ratio, index) => (
            <RatioCard key={index} ratio={ratio} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-cyan-300 mb-4">Historical Ratio Trends</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {ratioHistory.map((ratioHist, index) => (
                <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 shadow-lg">
                    <h4 className="text-lg font-semibold text-purple-300 mb-2">{ratioHist.name} Trend</h4>
                    <ChartComponent data={ratioHist.history} />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
