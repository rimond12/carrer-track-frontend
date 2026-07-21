import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, ListFilter, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand - Square Badge */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition duration-200">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                CareerTrack <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 uppercase tracking-wider">Lite</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase -mt-0.5">Job Tracker</span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Square Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive('/dashboard')
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'text-slate-700 bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/applications"
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive('/applications')
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'text-slate-700 bg-white border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  <span>Applications</span>
                </Link>
              </>
            ) : null}
          </div>

          {/* Right Menu / User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-100 border border-slate-200">
                  <div className="w-6 h-6 bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 max-w-[130px] truncate">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 transition cursor-pointer uppercase tracking-wider"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition uppercase tracking-wider"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition uppercase tracking-wider"
                >
                  Register Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-2 bg-white border-b border-slate-200 shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 mb-2">
                <UserIcon className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                  <p className="text-[11px] text-slate-500">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 border border-slate-200"
              >
                <ListFilter className="w-4 h-4 text-indigo-600" />
                <span>Applications</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600"
              >
                Register Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
