import React, { useState, useEffect } from 'react';
import type { JobApplication, ApplicationStatus, ApplicationSource } from '../types';
import { X, Briefcase, Building, Link2, Calendar, FileText, Tag, Send, Loader2 } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<JobApplication>) => Promise<void>;
  initialData?: JobApplication | null;
  title: string;
}

const STATUS_OPTIONS: ApplicationStatus[] = ['Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];
const SOURCE_OPTIONS: ApplicationSource[] = ['LinkedIn', 'Bdjobs', 'Indeed', 'Wellfound', 'Facebook', 'Referral', 'Other'];

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [source, setSource] = useState<ApplicationSource>('LinkedIn');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<ApplicationStatus>('Applied');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ companyName?: string; jobTitle?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setCompanyName(initialData.companyName || '');
      setJobTitle(initialData.jobTitle || '');
      setJobUrl(initialData.jobUrl || '');
      setSource(initialData.source || 'Other');
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
      setSource('LinkedIn');
      setApplicationDate(new Date().toISOString().split('T')[0]);
      setStatus('Applied');
      setNotes('');
    }
    setErrors({});
    setApiError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { companyName?: string; jobTitle?: string } = {};
    if (!companyName.trim()) {
      errs.companyName = 'Company name is required';
    }
    if (!jobTitle.trim()) {
      errs.jobTitle = 'Job title is required';
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
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobUrl: jobUrl.trim() || undefined,
        source,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-900 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-tight">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-bold">
            {apiError}
          </div>
        )}

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Microsoft, Local Startup"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.companyName ? 'border-red-500' : 'border-slate-300'
              } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
            />
            {errors.companyName && <p className="mt-1 text-xs font-bold text-red-600">{errors.companyName}</p>}
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
              className={`w-full px-3.5 py-2.5 bg-white border ${
                errors.jobTitle ? 'border-red-500' : 'border-slate-300'
              } text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600`}
            />
            {errors.jobTitle && <p className="mt-1 text-xs font-bold text-red-600">{errors.jobTitle}</p>}
          </div>

          {/* Grid: Source & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                Application Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as ApplicationSource)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              >
                {SOURCE_OPTIONS.map((src) => (
                  <option key={src} value={src}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Job URL & Application Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-pink-600" />
                Job Post URL
              </label>
              <input
                type="url"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Application Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              Notes / Key Details
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Expected salary range, tech stack, follow-up notes..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 uppercase tracking-wider transition cursor-pointer border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Application' : 'Create Application'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
