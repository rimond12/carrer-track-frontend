import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, User as UserIcon, Mail, Lock, Loader2, Briefcase } from 'lucide-react';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setApiError(null);

    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (response.data.success && response.data.token) {
        registerUser(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border-2 border-slate-900 shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-purple-600 text-white flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-600 font-medium">Join CareerTrack Lite to take ownership of your job applications.</p>
        </div>

        {/* API Error Box */}
        {apiError && (
          <div className="p-3.5 bg-red-50 border border-red-300 text-red-700 text-xs font-bold text-center">
            {apiError}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-indigo-600" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sumit Saha"
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
            />
            {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sumit@example.com"
              className={`w-full px-4 py-2.5 bg-white border ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
            />
            {errors.email && <p className="mt-1 text-xs font-bold text-red-600">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-pink-600" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 bg-white border ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
              />
              {errors.password && <p className="mt-1 text-xs font-bold text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-pink-600" />
                Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2.5 bg-white border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
                } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
              />
              {errors.confirmPassword && <p className="mt-1 text-xs font-bold text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="text-center pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Log in instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};
