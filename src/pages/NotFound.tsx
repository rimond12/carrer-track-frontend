import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-white">404</h1>
          <p className="text-lg font-bold text-slate-200 mt-1">Page Not Found</p>
          <p className="text-xs text-slate-400 mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex justify-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-500/25"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-500/25"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
