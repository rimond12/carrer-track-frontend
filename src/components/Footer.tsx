import React from 'react';
import { Briefcase, Code, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Column 1: App Info */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <div className="w-5 h-5 bg-indigo-600 flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
              <span className="font-black text-slate-900 text-sm tracking-tight">CareerTrack Lite</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              A high-performance job application tracking system built with React, Express & Mongoose.
            </p>
          </div>

          {/* Column 2: Required Student Credentials (PDF Requirement) */}
          <div className="space-y-1 text-center bg-slate-50 p-3 border border-slate-200">
            <div className="flex items-center justify-center space-x-1.5 text-indigo-700 font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Project Candidate</span>
            </div>
            <p className="text-slate-900 font-extrabold text-xs">
              Developer: <span className="text-indigo-600">Sumit Saha</span>
            </p>
            <p className="text-slate-600 text-[11px] font-mono">
              Student ID: <span className="font-bold text-slate-800">CT-2026-88492</span>
            </p>
          </div>

          {/* Column 3: Tech Stack & Copyright */}
          <div className="space-y-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end space-x-2 text-slate-800 font-bold text-xs">
              <Code className="w-3.5 h-3.5 text-purple-600" />
              <span>React + Node.js + MongoDB</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              &copy; {new Date().getFullYear()} CareerTrack Lite. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
