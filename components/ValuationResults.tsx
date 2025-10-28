import React from 'react';
import type { DcfValuationResult, ProjectedFinancialRow, DCFRow } from '../types';

interface ValuationResultsProps {
  result: DcfValuationResult;
  currency: string;
}

export const ValuationResults: React.FC<ValuationResultsProps> = ({ result, currency }) => {
  const renderCellContent = (value: unknown) => {
    if (typeof value === 'number') {
      return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  };

  const hasProjectedData = result.projectedFinancials && result.projectedFinancials.length > 0;
  const hasDcfData = result.dcfAnalysis && result.dcfAnalysis.length > 0;

  return (
    <div className="space-y-8">
      {/* Projected Financials Table */}
      {hasProjectedData && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-cyan-300">10-Year Projected Financials & UFCF (DCF)</h3>
            <p className="text-sm text-slate-500">All figures in millions of {currency}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/40">
                <tr>
                  <th className="p-3 font-semibold text-slate-300">Metric</th>
                  {result.projectedFinancials.map(item => <th key={item.year} className="p-3 font-semibold text-right text-slate-300">{item.year}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.keys(result.projectedFinancials[0]).filter(k => k !== 'year').map(metric => (
                  <tr key={metric} className="border-t border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium text-slate-300">{metric.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
                    {result.projectedFinancials.map(item => (
                      <td key={item.year} className="p-3 text-right font-mono text-slate-300">
                        {renderCellContent(item[metric as keyof ProjectedFinancialRow])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DCF Analysis Table */}
      {hasDcfData && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="text-xl font-semibold text-cyan-300">DCF Analysis</h3>
            <p className="text-sm text-slate-500">All figures in millions of {currency}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900/40">
                <tr>
                  <th className="p-3 font-semibold text-slate-300">Metric</th>
                  {result.dcfAnalysis.map(item => <th key={item.year} className="p-3 font-semibold text-right text-slate-300">{item.year}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.keys(result.dcfAnalysis[0]).filter(k => k !== 'year').map(metric => (
                   <tr key={metric} className="border-t border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium text-slate-300">{metric.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
                    {result.dcfAnalysis.map(item => (
                      <td key={item.year} className="p-3 text-right font-mono text-slate-300">
                         {renderCellContent(item[metric as keyof DCFRow])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};