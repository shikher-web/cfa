
import React from 'react';
import type { ValuationAssumptions } from '../types';

interface AssumptionControlsProps {
  assumptions: ValuationAssumptions;
  setAssumptions: React.Dispatch<React.SetStateAction<ValuationAssumptions>>;
  onRunValuation: () => void;
  isLoading: boolean;
}

const AssumptionInput: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
    <div className="relative">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-slate-900/50 border border-slate-700 rounded-md py-2 pl-3 pr-10 text-white focus:ring-cyan-500 focus:border-cyan-500"
      />
      <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500">%</span>
    </div>
  </div>
);

export const AssumptionControls: React.FC<AssumptionControlsProps> = ({ assumptions, setAssumptions, onRunValuation, isLoading }) => {
    
    const handleChange = (key: keyof ValuationAssumptions, value: number) => {
        setAssumptions(prev => ({ ...prev, [key]: value }));
    }

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 space-y-6">
      <h3 className="text-xl font-semibold text-cyan-300">Valuation Assumptions</h3>
      
      <AssumptionInput label="Revenue Growth Rate" value={assumptions.revenueGrowthRate} onChange={(v) => handleChange('revenueGrowthRate', v)} />
      <AssumptionInput label="EBITDA Margin" value={assumptions.ebitdaMargin} onChange={(v) => handleChange('ebitdaMargin', v)} />
      <AssumptionInput label="Tax Rate" value={assumptions.taxRate} onChange={(v) => handleChange('taxRate', v)} />
      <AssumptionInput label="Capex as % of Revenue" value={assumptions.capexAsPercentageOfRevenue} onChange={(v) => handleChange('capexAsPercentageOfRevenue', v)} />
      <AssumptionInput label="Depreciation as % of Revenue" value={assumptions.depreciationAsPercentageOfRevenue} onChange={(v) => handleChange('depreciationAsPercentageOfRevenue', v)} />
      <AssumptionInput label="Δ NWC as % of Revenue" value={assumptions.changeInWorkingCapitalAsPercentageOfRevenue} onChange={(v) => handleChange('changeInWorkingCapitalAsPercentageOfRevenue', v)} />
      <AssumptionInput label="Terminal Growth Rate" value={assumptions.terminalGrowthRate} onChange={(v) => handleChange('terminalGrowthRate', v)} />
      <AssumptionInput label="Discount Rate (WACC)" value={assumptions.discountRate} onChange={(v) => handleChange('discountRate', v)} />

      <button
        onClick={onRunValuation}
        disabled={isLoading}
        className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Running...' : 'Run Valuation'}
      </button>
    </div>
  );
};
