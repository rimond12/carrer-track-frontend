import React, { useState, useEffect } from 'react';
import type { Portal } from '../types';
import { X, Globe, Link2, User, FileText, Percent, Loader2 } from 'lucide-react';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Portal>) => Promise<void>;
  initialData?: Portal | null;
  title: string;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [loginUrl, setLoginUrl] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [profileCompleted, setProfileCompleted] = useState<number>(0);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [notes, setNotes] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setWebsiteUrl(initialData.websiteUrl || '');
      setLoginUrl(initialData.loginUrl || '');
      setHasAccount(Boolean(initialData.hasAccount));
      setUsername(initialData.username || '');
      setProfileCompleted(initialData.profileCompleted || 0);
      setResumeUploaded(Boolean(initialData.resumeUploaded));
      setNotes(initialData.notes || '');
      setIsActive(initialData.isActive !== undefined ? initialData.isActive : true);
    } else {
      setName('');
      setWebsiteUrl('');
      setLoginUrl('');
      setHasAccount(false);
      setUsername('');
      setProfileCompleted(0);
      setResumeUploaded(false);
      setNotes('');
      setIsActive(true);
    }
    setErrors({});
    setApiError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { name?: string } = {};
    if (!name.trim()) {
      errs.name = 'Portal name is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await onSubmit({
        name: name.trim(),
        websiteUrl: websiteUrl.trim() || undefined,
        loginUrl: loginUrl.trim() || undefined,
        hasAccount,
        username: username.trim() || undefined,
        profileCompleted: Number(profileCompleted),
        resumeUploaded,
        notes: notes.trim() || undefined,
        isActive,
      });
      onClose();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to save job portal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-indigo-500/50 shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Portal Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Portal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. LinkedIn, Indeed, Bdjobs, Wellfound"
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${
                errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
            />
            {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>}
          </div>

          {/* URLs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                Direct Login URL
              </label>
              <input
                type="url"
                value={loginUrl}
                onChange={(e) => setLoginUrl(e.target.value)}
                placeholder="https://.../login"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Account status & credentials tracking */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAccount}
                  onChange={(e) => setHasAccount(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-none border-slate-300 focus:ring-0"
                />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  I have an account on this portal
                </span>
              </label>
            </div>

            {hasAccount && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-indigo-500" />
                  Username or Email Used (No passwords)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dev.rimon@example.com"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
            )}
          </div>

          {/* Profile Completed & Resume uploaded */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-amber-500" />
                  Profile Completed
                </label>
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{profileCompleted}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={profileCompleted}
                onChange={(e) => setProfileCompleted(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resumeUploaded}
                  onChange={(e) => setResumeUploaded(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-none border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Resume / CV Uploaded
                </span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              Notes & Strategy
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Good response rate for remote frontend jobs, check daily at 10 AM..."
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-none border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Active Portal (appears in application sources)
              </span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Portal' : 'Add Portal'}</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
