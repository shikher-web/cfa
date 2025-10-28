import React, { useState } from 'react';
import type { CompanyData, ValuationAssumptions, MultiModelValuationResult } from '../types';
import { AssumptionControls } from './AssumptionControls';
import { ValuationResults } from './ValuationResults';
import { ValuationComparison } from './ValuationComparison';
import { LoadingSpinner } from './LoadingSpinner';
import { runMultiModelValuation } from '../services/geminiService';

interface ValuationProps {
  companyData: CompanyData;
}

export const Valuation: React.FC<ValuationProps> = ({ companyData }) => {
  const [assumptions, setAssumptions] = useState<ValuationAssumptions>(companyData.valuationAssumptions);
  const [valuationResult, setValuationResult] = useState<MultiModelValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunValuation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await runMultiModelValuation(companyData, assumptions);
      setValuationResult(result);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred during valuation.');
      }
      setValuationResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <AssumptionControls 
            assumptions={assumptions} 
            setAssumptions={setAssumptions} 
            onRunValuation={handleRunValuation}
            isLoading={isLoading}
        />
      </div>
      <div className="lg:col-span-2 space-y-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-96 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <LoadingSpinner />
            <p className="mt-4 text-slate-300">Performing Multi-Model Valuation...</p>
          </div>
        )}
        {error && (
            <div className="flex items-center justify-center h-full">
            <div className="bg-red-900/50 text-red-300 p-6 rounded-lg text-center max-w-lg">
              <h2 className="text-xl font-bold mb-2">Valuation Error</h2>
              <p>{error}</p>
            </div>
          </div>
        )}
        {!isLoading && !error && !valuationResult && (
             <div className="flex flex-col items-center justify-center h-96 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center p-8">
                <h3 className="text-2xl font-semibold text-white mb-2">Multi-Model Valuation</h3>
                <p className="text-slate-400">Adjust the assumptions on the left and click "Run Valuation" to calculate the intrinsic value of {companyData.companyName} using multiple models.</p>
             </div>
        )}
        {valuationResult && (
          <>
            <ValuationComparison result={valuationResult} currency={companyData.currency} />
            <ValuationResults result={valuationResult.dcf} currency={companyData.currency} />
          </>
        )}
      </div>
    </div>
  );
};