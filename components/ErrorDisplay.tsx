import React from 'react';

const ErrorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface ErrorDisplayProps {
  title: string;
  message: string;
  onDismiss?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ title, message, onDismiss }) => {
  return (
    <div className="flex items-center justify-center h-full p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-800/50 border border-red-500/50 rounded-lg p-8 text-center shadow-2xl shadow-red-500/10">
        {onDismiss && (
            <button onClick={onDismiss} aria-label="Dismiss error" className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                <CloseIcon className="h-6 w-6" />
            </button>
        )}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20">
            <ErrorIcon className="h-6 w-6 text-red-400" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-red-300">{title}</h2>
        <p className="mt-2 text-slate-400">{message}</p>
      </div>
    </div>
  );
};
