import React, { useState, useEffect } from 'react';
import type { JobApplication, ApplicationStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  X,
  Briefcase,
  Building,
  Link2,
  Calendar,
  FileText,
  Tag,
  Send,
  Loader2,
  Settings,
} from 'lucide-react';
import { ManageSourcesModal } from './ManageSourcesModal';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<JobApplication>) => Promise<void>;
  initialData?: JobApplication | null;
  title: string;
}

const STATUS_OPTIONS: ApplicationStatus[] = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [portalId, setPortalId] = useState<string | undefined>(undefined);
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');

  // Sources from backend
  const [sourceList, setSourceList] = useState<{ _id: string; name: string; isActive: boolean }[]>([]);

  // Inline add source for admin
  const [isInlineAdding, setIsInlineAdding] = useState(false);
  const [inlineSourceName, setInlineSourceName] = useState('');
  const [isManageSourcesOpen, setIsManageSourcesOpen] = useState(false);

  const [errors, setErrors] = useState<{ companyName?: string; jobTitle?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchSources = async () => {
    try {
      const res = await api.get('/sources');
      if (res.data.success) {
        setSourceList(res.data.sources || []);
      }
    } catch (err) {
      console.error('Failed to load application sources', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSources();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setJobTitle(initialData.jobTitle || '');
      setJobUrl(initialData.jobUrl || '');
      const initialSrc = typeof initialData.source === 'string' ? initialData.source : 'Other';
      setSource(initialSrc);
      const pId = typeof initialData.portalId === 'string' ? initialData.portalId : (initialData.portalId as any)?._id;
      setPortalId(pId);
      setApplicationDate(
        initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setStatus(initialData.status || 'Saved');
      setNotes(initialData.notes || '');
    } else {
      setCompanyName('');
      setJobTitle('');
      setJobUrl('');
      setSource(sourceList[0]?.name || 'LinkedIn');
      setPortalId(sourceList[0]?._id);
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setStatus('Applied');
      setNotes('');
    }
    setErrors({});
    setApiError(null);
    setIsInlineAdding(false);
    setInlineSourceName('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { companyName?: string; jobTitle?: string } = {};
    if (!companyName.trim()) {
      errs.companyName = 'Company name is required and cannot be empty';
    }
    if (!jobTitle.trim()) {
      errs.jobTitle = 'Job title is required and cannot be empty';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsInlineAdding(true);
      return;
    }
    setSource(val);
    const matched = sourceList.find((s) => s.name === val);
    if (matched) {
      setPortalId(matched._id);
    }
  };

  const handleCreateInlineSource = async () => {
    if (!inlineSourceName.trim()) return;
    try {
      const res = await api.post('/sources', { name: inlineSourceName.trim(), isActive: true });
      if (res.data.success) {
        const created = res.data.source;
        setSourceList((prev) => [...prev, created]);
        setSource(created.name);
        setPortalId(created._id);
        setIsInlineAdding(false);
        setInlineSourceName('');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to create new source');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      await onSubmit({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobUrl: jobUrl.trim() || undefined,
        source: source.trim(),
        portalId: portalId || undefined,
        applicationDate,
        status,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to save application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compile available options: active sources + current initialData source (even if deactivated)
  const displaySources = [...sourceList];
  if (initialData?.source && !displaySources.some((s) => s.name === initialData.source)) {
    displaySources.push({ _id: (initialData.portalId as any)?._id || 'legacy', name: initialData.source, isActive: false });
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-indigo-500/50 shadow-2xl overflow-hidden my-8 transition-colors">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* API Error Notification */}
          {apiError && (
            <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold">
              {apiError}
            </div>
          )}

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-indigo-600" />
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google, Microsoft, Local Startup"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${
                  errors.companyName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
              />
              {errors.companyName && <p className="mt-1 text-xs font-bold text-red-600 dark:text-red-400">{errors.companyName}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border ${
                  errors.jobTitle ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
                } text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
              />
              {errors.jobTitle && <p className="mt-1 text-xs font-bold text-red-600 dark:text-red-400">{errors.jobTitle}</p>}
            </div>

            {/* Grid: Source & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    Application Source
                  </label>
                  {user?.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setIsManageSourcesOpen(true)}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-0.5"
                      title="Manage sources (Admin)"
                    >
                      <Settings className="w-3 h-3" />
                      Manage
                    </button>
                  )}
                </div>

                {!isInlineAdding ? (
                  <select
                    value={source}
                    onChange={handleSourceChange}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600"
                  >
                    {displaySources.map((src) => (
                      <option key={src._id} value={src.name}>
                        {src.name} {!src.isActive ? '(Deactivated)' : ''}
                      </option>
                    ))}
                    {user?.role === 'admin' && (
                      <option value="__ADD_NEW__" className="font-bold text-indigo-600">
                        + Add new source...
                      </option>
                    )}
                  </select>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={inlineSourceName}
                      onChange={(e) => setInlineSourceName(e.target.value)}
                      placeholder="Source name..."
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-indigo-500 text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleCreateInlineSource}
                      className="px-2.5 py-2 bg-indigo-600 text-white text-xs font-bold uppercase hover:bg-indigo-700 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsInlineAdding(false)}
                      className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600" />
                  Application Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600"
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid: Job URL & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-slate-500" />
                  Job Post URL
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Application Date
                </label>
                <input
                  type="date"
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Notes & Follow-ups
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Details about interview rounds, salary expectations, recruiter contact..."
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-indigo-600"
              />
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
                  <span>{initialData ? 'Update Application' : 'Save Application'}</span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* Admin Manage Sources Modal */}
      {isManageSourcesOpen && (
        <ManageSourcesModal
          isOpen={isManageSourcesOpen}
          onClose={() => setIsManageSourcesOpen(false)}
          onSourcesUpdated={fetchSources}
        />
      )}
    </>
  );
};
