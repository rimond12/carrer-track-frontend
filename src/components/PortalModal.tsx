import React, { useState, useEffect, useRef } from 'react';
import type { Portal } from '../types';
import { X, Globe, Link2, User, FileText, Percent, Loader2, ImagePlus, Trash2 } from 'lucide-react';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Portal>) => Promise<void>;
  initialData?: Portal | null;
  title: string;
}

const MAX_SIZE_BYTES = 500 * 1024; // 500 KB

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
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoError, setLogoError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setLogoUrl(initialData.logoUrl || '');
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
      setLogoUrl('');
    }
    setErrors({});
    setApiError(null);
    setLogoError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // --- Image processing ---
  const processImageFile = (file: File) => {
    setLogoError('');
    if (!file.type.startsWith('image/')) {
      setLogoError('Only image files are allowed (PNG, JPG, GIF, SVG, WebP).');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setLogoError(`Image too large. Max size is 500 KB (this file is ${(file.size / 1024).toFixed(0)} KB).`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
    // reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  // --- Validation & Submit ---
  const validate = () => {
    const errs: { name?: string } = {};
    if (!name.trim()) errs.name = 'Portal name is required';
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
        logoUrl: logoUrl || undefined,
      });
      onClose();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to save job portal');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Logo preview initial letter ---
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 shadow-2xl overflow-hidden my-8 transition-colors">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-violet-600 flex items-center justify-center text-white font-bold">
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ── LOGO UPLOAD ── */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <ImagePlus className="w-3.5 h-3.5 text-violet-600" />
              Portal Logo / Icon
              <span className="text-[10px] font-normal text-slate-400 normal-case tracking-normal ml-1">(optional · max 500 KB)</span>
            </label>

            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Portal logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-400">
                      <span className="text-2xl font-black text-slate-300 dark:text-slate-600 select-none">{initial}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider">Preview</span>
                    </div>
                  )}
                </div>
                {/* Remove button */}
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl('')}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition cursor-pointer"
                    title="Remove logo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 h-20 border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition select-none ${
                  isDragging
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 bg-slate-50 dark:bg-slate-800'
                }`}
              >
                <ImagePlus className={`w-5 h-5 ${isDragging ? 'text-violet-500' : 'text-slate-400'}`} />
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center px-2">
                  {isDragging ? 'Drop it here!' : 'Click or drag & drop an image'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">PNG, JPG, WebP, SVG</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {logoError && (
              <p className="mt-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">{logoError}</p>
            )}
          </div>

          {/* Portal Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-violet-600" />
              Portal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. LinkedIn, Indeed, Bdjobs, Wellfound"
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${
                errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
              } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500`}
            />
            {errors.name && <p className="mt-1 text-xs font-bold text-red-600">{errors.name}</p>}
          </div>

          {/* URLs grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-sky-600" />
                Website URL
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500"
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
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Account Status */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccount}
                onChange={(e) => setHasAccount(e.target.checked)}
                className="w-4 h-4 text-violet-600 rounded-none border-slate-300 focus:ring-0"
              />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                I have an account on this portal
              </span>
            </label>

            {hasAccount && (
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-violet-500" />
                  Username or Email (No passwords stored)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. dev.rimon@example.com"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>
            )}
          </div>

          {/* Profile & Resume */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-amber-500" />
                  Profile Completed
                </label>
                <span className="text-xs font-black text-violet-600 dark:text-violet-400">{profileCompleted}%</span>
              </div>
              <input
                type="range"
                min="0" max="100" step="5"
                value={profileCompleted}
                onChange={(e) => setProfileCompleted(Number(e.target.value))}
                className="w-full accent-violet-600 cursor-pointer"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resumeUploaded}
                  onChange={(e) => setResumeUploaded(e.target.checked)}
                  className="w-4 h-4 text-violet-600 rounded-none border-slate-300"
                />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Resume / CV Uploaded</span>
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
              placeholder="e.g. Good response rate for remote roles. Check daily at 10 AM..."
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-violet-600 rounded-none border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Active Portal (appears in application sources)
              </span>
            </label>
          </div>

          {/* Footer Actions */}
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
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 transition shadow-sm flex items-center space-x-2 cursor-pointer disabled:opacity-50"
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
