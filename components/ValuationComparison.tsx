import React from 'react';
import type { MultiModelValuationResult } from '../types';

const formatCurrency = (value: number, currency: string) => {
    if (value === 0 || !value) return 'N/A';
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency, 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

const ModelCard: React.FC<{ title: string; impliedPrice: number; commentary: string; currency: string, currentPrice?: number }> = ({ title, impliedPrice, commentary, currency, currentPrice }) => {
    const hasPrice = impliedPrice > 0 && currentPrice;
    const differencePercent = hasPrice ? ((impliedPrice - currentPrice) / currentPrice) * 100 : 0;
    
    const getValuationStatus = () => {
        if (!hasPrice) return { text: 'Not Available', color: 'text-slate-500' };
        if (Math.abs(differencePercent) < 5) return { text: `(${differencePercent.toFixed(1)}%) Fairly Valued`, color: 'text-yellow-400' };
        if (differencePercent < 0) return { text: `(${differencePercent.toFixed(1)}%) Overvalued`, color: 'text-red-400' };
        return { text: `(+${differencePercent.toFixed(1)}%) Undervalued`, color: 'text-green-400' };
    };

    const status = getValuationStatus();

    return (
        <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-700/50 flex flex-col">
            <h4 className="text-lg font-semibold text-purple-300">{title}</h4>
            <div className="flex-1 my-3">
                <p className="text-3xl font-bold text-white">{formatCurrency(impliedPrice, currency)}</p>
                <p className={`text-sm font-medium ${status.color}`}>{status.text}</p>
            </div>
            <p className="text-xs text-slate-400">{commentary}</p>
        </div>
    );
}

export const ValuationComparison: React.FC<{ result: MultiModelValuationResult, currency: string }> = ({ result, currency }) => {
    const { commentary, currentSharePrice } = result;

    // Use optional chaining and nullish coalescing for safety
    const dcfImpliedPrice = result.dcf?.impliedSharePrice ?? 0;
    const relativeImpliedPrice = result.relative?.impliedSharePrice ?? 0;
    const relativeCommentary = result.relative?.commentary ?? "Not available.";
    const ddmImpliedPrice = result.ddm?.impliedSharePrice ?? 0;
    const ddmCommentary = result.ddm?.commentary ?? "Not available.";
    const assetBasedImpliedPrice = result.assetBased?.impliedSharePrice ?? 0;
    const assetBasedCommentary = result.assetBased?.commentary ?? "Not available.";

    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-2xl font-semibold text-cyan-300 mb-1">Valuation Model Comparison</h3>
                <p className="text-slate-400 mb-4">Current Share Price: {formatCurrency(currentSharePrice ?? 0, currency)}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ModelCard title="Discounted Cash Flow (DCF)" impliedPrice={dcfImpliedPrice} commentary="Based on 10-year future cash flows." currency={currency} currentPrice={currentSharePrice} />
                    <ModelCard title="Relative Valuation" impliedPrice={relativeImpliedPrice} commentary={relativeCommentary} currency={currency} currentPrice={currentSharePrice} />
                    <ModelCard title="Dividend Discount Model (DDM)" impliedPrice={ddmImpliedPrice} commentary={ddmCommentary} currency={currency} currentPrice={currentSharePrice} />
                    <ModelCard title="Asset-Based Valuation" impliedPrice={assetBasedImpliedPrice} commentary={assetBasedCommentary} currency={currency} currentPrice={currentSharePrice} />
                </div>
            </div>

             <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700/50">
                <h3 className="text-xl font-semibold text-purple-300 mb-3">AI Summary Commentary</h3>
                <p className="text-slate-300 leading-relaxed">{commentary}</p>
            </div>
        </div>
    );
};