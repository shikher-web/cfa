
import React from 'react';
import type { NavItem } from '../types';
import { NAV_ITEMS } from '../constants';
import { CosmicIcon } from './icons';

interface SidebarProps {
  activeNav: NavItem;
  setActiveNav: (nav: NavItem) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, setActiveNav, isOpen, setIsOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/60 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-slate-950/80 backdrop-blur-lg border-r border-slate-800/50 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-20 border-b border-slate-800/50">
           <CosmicIcon className="h-8 w-8 text-cyan-400" />
          <h1 className="text-xl font-bold ml-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
            Cosmic Financials
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeNav.id === item.id
                  ? 'bg-cyan-400/10 text-cyan-300 shadow-inner shadow-cyan-500/10'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800/50 text-xs text-center text-slate-500">
          <p>By Cosmic Consulting</p>
          <p>Designed by Shikher</p>
        </div>
      </aside>
    </>
  );
};
