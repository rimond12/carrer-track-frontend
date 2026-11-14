import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Briefcase,
  LayoutDashboard,
  ListFilter,
  Globe,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand - Square Badge */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition duration-200">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CareerTrack <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">Lite</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">Job Tracker</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive('/dashboard')
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
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
                      : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  <span>Applications</span>
                </Link>

                <Link
                  to="/portals"
                  className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${
                    isActive('/portals')
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Portals</span>
                </Link>
              </>
            ) : null}
          </div>

          {/* Right Menu: Theme Toggle + User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle light and dark theme"
              aria-pressed={theme === 'dark'}
              className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500 transition cursor-pointer shadow-xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[130px] truncate">{user?.name}</span>
                    {user?.role === 'admin' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700" title="System Administrator">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-200 dark:border-slate-700 hover:border-red-200 transition cursor-pointer uppercase tracking-wider"
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
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition uppercase tracking-wider"
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

          {/* Mobile menu and theme toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              aria-pressed={theme === 'dark'}
              className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-4 space-y-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-2.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 mb-3 border border-slate-200 dark:border-slate-700">
                <div className="w-6 h-6 bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name}</span>
                {user?.role === 'admin' && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold uppercase border border-amber-300">
                    Admin
                  </span>
                )}
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider border ${
                  isActive('/dashboard')
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider border ${
                  isActive('/applications')
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ListFilter className="w-4 h-4" />
                <span>Applications</span>
              </Link>

              <Link
                to="/portals"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider border ${
                  isActive('/portals')
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Portals</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 mt-2"
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
                className="block text-center px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 uppercase tracking-wider"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 uppercase tracking-wider"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
