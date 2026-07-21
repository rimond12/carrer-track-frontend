import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="text-center space-y-6 max-w-md bg-white border-2 border-slate-900 shadow-xl p-8">
        <div className="w-16 h-16 bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">404</h1>
          <p className="text-base font-extrabold text-slate-800 uppercase tracking-tight mt-1">Page Not Found</p>
          <p className="text-xs text-slate-600 font-medium mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex justify-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/"
              className="flex items-center space-x-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-xs"
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
