import React from 'react';
import { Briefcase, Code, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">

          {/* Column 1: App Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-slate-200">CareerTrack Lite</span>
            </div>
            <p className="text-slate-400 text-xs">
              A modern full-stack job application tracker designed for efficiency, clarity, and goal tracking.
            </p>
          </div>

          {/* Column 2: Required Student Credentials (PDF Requirement) */}
          <div className="space-y-1 text-center bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-center space-x-1.5 text-indigo-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Project Submission Candidate</span>
            </div>
            <p className="text-slate-200 font-bold text-xs">
              Developer: <span className="text-indigo-300">Rimon Dey</span>
            </p>
            <p className="text-slate-400 text-[11px]">
              Student ID: <span className="text-slate-300 font-mono">WEB11-0980</span>
            </p>
          </div>

          {/* Column 3: Tech Stack & Copyright */}
          <div className="space-y-2 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end space-x-2 text-slate-300 font-medium">
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>React + Express + Mongoose</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              &copy; {new Date().getFullYear()} CareerTrack Lite. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
