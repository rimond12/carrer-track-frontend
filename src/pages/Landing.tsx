import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, BarChart3, Search, Lock } from 'lucide-react';

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[var(--bg-body)] transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full-Stack Job Application Tracker</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Manage your job search with <span className="gradient-text">speed, clarity and precision</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            CareerTrack Lite keeps your applications organized, tracks interviews & offers in real time, and equips you with AI interview preparation insights.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 font-bold uppercase tracking-wider text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Go to Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 font-bold uppercase tracking-wider text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>Start Tracking Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 font-bold uppercase tracking-wider text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 flex items-center justify-center transition cursor-pointer shadow-xs"
                >
                  <span>Log In to Account</span>
                </Link>
              </>
            )}
          </div>

          {/* Feature Highlights Square Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-6xl mx-auto">
            
            <div className="square-card p-6 space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">Live Dashboard Stats</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Track status totals for Saved, Applied, Assessment, Interview, Rejected, and Offers in real-time.
              </p>
            </div>

            <div className="square-card p-6 space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">Search & Filter</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                Filter by status, search by company name or job title, and sort applications from newest to oldest.
              </p>
            </div>

            <div className="square-card p-6 space-y-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 bg-pink-50 dark:bg-pink-950/70 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">User Isolated Data</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                JWT auth with bcrypt hashing ensures your application records are strictly confidential and secure.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
