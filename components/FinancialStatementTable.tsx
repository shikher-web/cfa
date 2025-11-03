
import React from 'react';
import type { FinancialStatement } from '../types';

interface FinancialStatementTableProps {
  title: string;
  data: FinancialStatement;
  currency: string;
}

export const FinancialStatementTable: React.FC<FinancialStatementTableProps> = ({ title, data, currency }) => {
  const years = Object.keys(data).sort((a, b) => {
    // Extracts numbers from strings like "2024" or "2024 TTM" for robust sorting
    const yearBValue = parseInt(b.replace(/[^0-9]/g, '')) || 0;
    const yearAValue = parseInt(a.replace(/[^0-9]/g, '')) || 0;
    return yearBValue - yearAValue;
  });
  if (years.length === 0) return null;

  const items = Object.keys(data[years[0]]);

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden shadow-lg">
      <div className="p-4 border-b border-slate-700/50">
        <h3 className="text-xl font-semibold text-cyan-300">{title}</h3>
        <p className="text-sm text-slate-500">All figures in millions of {currency}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-900/40">
            <tr>
              <th className="p-4 font-semibold text-slate-300">Metric</th>
              {years.map(year => (
                <th key={year} className="p-4 font-semibold text-right text-slate-300">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item} className="border-t border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-medium text-slate-300">{item}</td>
                {years.map(year => (
                  <td key={year} className="p-4 text-right font-mono text-slate-300">
                    {typeof data[year][item] === 'number'
                      ? (data[year][item] as number).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : data[year][item]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};