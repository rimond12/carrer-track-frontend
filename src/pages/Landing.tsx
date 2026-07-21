import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles, BarChart3, Search, Lock } from 'lucide-react';

export const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Full-Stack Job Application Tracker</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Manage your job search with <span className="gradient-text">speed, clarity and confidence</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            CareerTrack Lite keeps your applications organized, tracks interviews & offers in real time, and equips you with AI interview preparation insights.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <span>Go to Your Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <span>Start Tracking Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 flex items-center justify-center transition cursor-pointer"
                >
                  <span>Log In to Account</span>
                </Link>
              </>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
            
            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Dashboard Stats</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track status totals for Saved, Applied, Assessment, Interview, Rejected, and Offers in real-time.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Search & Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by status, search by company name or job title, and sort applications from newest to oldest.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">User Isolated Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                JWT auth with bcrypt hashing ensures your application records are strictly confidential and secure.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
