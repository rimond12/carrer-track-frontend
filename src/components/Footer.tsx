import React from 'react';
import { Briefcase, Code, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-xs py-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Column 1: App Info */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-5 h-5 bg-indigo-600 flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
              <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">CareerTrack Lite</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              A high-performance job application tracking system built with React, Express & Mongoose.
            </p>
          </div>

          {/* Column 2: Developer Credentials */}
          <div className="space-y-1 text-center bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center space-x-1.5 text-indigo-700 dark:text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Project Candidate</span>
            </div>
            <p className="text-slate-900 dark:text-white font-extrabold text-xs">
              Developer: <span className="text-indigo-600 dark:text-indigo-400">Rimon Dey</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] font-mono">
              Student ID: <span className="font-bold text-slate-800 dark:text-slate-200">WEB11-0980</span>
            </p>
          </div>

          {/* Column 3: Tech Stack & Copyright */}
          <div className="space-y-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end space-x-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
              <Code className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>React + Node.js + MongoDB</span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-[11px]">
              &copy; {new Date().getFullYear()} CareerTrack Lite. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
