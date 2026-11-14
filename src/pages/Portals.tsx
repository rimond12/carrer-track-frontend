import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Portal, PortalSummaryStats } from '../types';
import { PortalModal } from '../components/PortalModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  Globe,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Percent,
  Search,
  Sparkles,
  UserCheck,
  UserX,
  Compass,
} from 'lucide-react';

export const Portals: React.FC = () => {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [summary, setSummary] = useState<PortalSummaryStats>({
    totalPortals: 0,
    portalsWithAccount: 0,
    portalsWithoutAccount: 0,
    totalApplications: 0,
    overallResponseRate: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState('');
  const [accountFilter, setAccountFilter] = useState<'All' | 'HasAccount' | 'NoAccount'>('All');
  const [sortOption, setSortOption] = useState<'rateDesc' | 'appsDesc' | 'nameAsc'>('rateDesc');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portal | null>(null);
  const [deletingPortal, setDeletingPortal] = useState<Portal | null>(null);

  const fetchPortalsData = async () => {
    try {
      setLoading(true);
      const [portalsRes, statsRes] = await Promise.all([
        api.get('/portals'),
        api.get('/portals/stats'),
      ]);

      if (portalsRes.data.success) {
        setPortals(portalsRes.data.portals || []);
      }
      if (statsRes.data.success) {
        setSummary(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Error fetching portals data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalsData();
  }, []);

  const handleCreatePortal = async (formData: Partial<Portal>) => {
    await api.post('/portals', formData);
    fetchPortalsData();
  };

  const handleUpdatePortal = async (formData: Partial<Portal>) => {
    if (!editingPortal) return;
    await api.patch(`/portals/${editingPortal._id}`, formData);
    fetchPortalsData();
    setEditingPortal(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingPortal) return;
    await api.delete(`/portals/${deletingPortal._id}`);
    fetchPortalsData();
    setDeletingPortal(null);
  };

  // Filter and sort logic
  const filteredPortals = portals
    .filter((portal) => {
      // Search by name
      if (search.trim()) {
        const matchesName = portal.name.toLowerCase().includes(search.trim().toLowerCase());
        const matchesNotes = portal.notes?.toLowerCase().includes(search.trim().toLowerCase());
        if (!matchesName && !matchesNotes) return false;
      }
      // Account filter
      if (accountFilter === 'HasAccount' && !portal.hasAccount) return false;
      if (accountFilter === 'NoAccount' && portal.hasAccount) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'rateDesc') {
        return (b.responseRate || 0) - (a.responseRate || 0);
      }
      if (sortOption === 'appsDesc') {
        return (b.totalApplications || 0) - (a.totalApplications || 0);
      }
      if (sortOption === 'nameAsc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 border-2 border-slate-900 dark:border-indigo-500/50 shadow-xs transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Job Portal Tracker <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Track where you search, manage login accounts, and analyze which job boards yield the highest response rates.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job Portal</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Portals */}
        <div className="square-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Portals</span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{summary.totalPortals}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Tracked platforms</span>
        </div>

        {/* Portals with Account */}
        <div className="square-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">With Account</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{summary.portalsWithAccount}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ready to apply</span>
        </div>

        {/* Portals without Account */}
        <div className="square-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Need Account</span>
            <UserX className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{summary.portalsWithoutAccount}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Action recommended</span>
        </div>

        {/* Total Applications across Portals */}
        <div className="square-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">Applications</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{summary.totalApplications}</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Linked to portals</span>
        </div>

        {/* Overall Response Rate */}
        <div className="square-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">Response Rate</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{summary.overallResponseRate}%</p>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Replies / Applications</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search portal name or notes..."
              className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Account Filter */}
          <div className="sm:col-span-3">
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Portals</option>
              <option value="HasAccount">Has Account</option>
              <option value="NoAccount">No Account (Need Account)</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="sm:col-span-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
            >
              <option value="rateDesc">Sort: Highest Response Rate</option>
              <option value="appsDesc">Sort: Most Applications</option>
              <option value="nameAsc">Sort: Portal Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Portals Grid / Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-bold uppercase tracking-wider">Loading portals & computed analytics...</p>
        </div>
      ) : filteredPortals.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Globe className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">No Portals Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            {search || accountFilter !== 'All'
              ? 'No job portals match your current filter settings.'
              : 'Add job portals to track which platforms give you the best interview conversions.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
          >
            Add First Portal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPortals.map((portal) => (
            <div
              key={portal._id}
              className={`square-card p-5 border bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 transition ${
                portal.isBestPerforming
                  ? 'border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Logo/Initial + Badges + Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Logo/Initial Avatar */}
                    <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      {portal.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {portal.name}
                        </h3>
                        {portal.websiteUrl && (
                          <a
                            href={portal.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 p-0.5"
                            title="Visit Portal Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      {portal.loginUrl && (
                        <a
                          href={portal.loginUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline inline-block"
                        >
                          Direct Login Link →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingPortal(portal)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit Portal"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingPortal(portal)}
                      className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                      title="Delete Portal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Highlights: Best Performer or No Replies Yet */}
                <div className="flex flex-wrap gap-1.5">
                  {portal.isBestPerforming && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 text-[10px] font-black uppercase tracking-wider">
                      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                      Best Performer ({portal.responseRate}% Response)
                    </span>
                  )}
                  {portal.noRepliesYet && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[10px] font-bold uppercase">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      No Replies Yet
                    </span>
                  )}
                </div>

                {/* Account Status Badge & Reminder */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account Status</span>
                    {portal.hasAccount ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Account Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        No Account
                      </span>
                    )}
                  </div>

                  {portal.hasAccount ? (
                    portal.username && (
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-mono truncate">
                        ID: {portal.username}
                      </p>
                    )
                  ) : (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
                        Create an account to streamline applying
                      </span>
                      {portal.websiteUrl && (
                        <a
                          href={portal.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-200"
                        >
                          Sign Up →
                        </a>
                      )}
                    </div>
                  )}

                  {/* Profile Completion & Resume Upload */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Percent className="w-3 h-3 text-indigo-500" />
                      <span>Profile: <strong>{portal.profileCompleted}%</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <FileCheck className={`w-3.5 h-3.5 ${portal.resumeUploaded ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <span>{portal.resumeUploaded ? 'Resume Uploaded' : 'No Resume'}</span>
                    </div>
                  </div>
                </div>

                {/* Computed Application Analytics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                      Applications Analytics
                    </span>
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-xs">
                      {portal.responseRate}% Response Rate
                    </span>
                  </div>

                  {/* Response Rate Bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div
                      style={{ width: `${portal.responseRate || 0}%` }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                    />
                  </div>

                  {/* Counters */}
                  <div className="grid grid-cols-4 gap-1 text-center pt-1 text-[11px]">
                    <div className="p-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="block text-[9px] uppercase font-bold text-slate-400">Applied</span>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{portal.totalApplications || 0}</strong>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="block text-[9px] uppercase font-bold text-blue-500">Replies</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-extrabold">{portal.repliesCount || 0}</strong>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="block text-[9px] uppercase font-bold text-purple-500">Interview</span>
                      <strong className="text-purple-600 dark:text-purple-400 font-extrabold">{portal.interviewRate || 0}%</strong>
                    </div>
                    <div className="p-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                      <span className="block text-[9px] uppercase font-bold text-emerald-500">Offers</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{portal.offerCount || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Notes Snippet */}
                {portal.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    "{portal.notes}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Portal Modal */}
      <PortalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreatePortal}
        title="Add Job Portal"
      />

      {/* Edit Portal Modal */}
      <PortalModal
        isOpen={!!editingPortal}
        onClose={() => setEditingPortal(null)}
        onSubmit={handleUpdatePortal}
        initialData={editingPortal}
        title="Edit Job Portal"
      />

      {/* Delete Portal Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingPortal}
        onClose={() => setDeletingPortal(null)}
        onConfirm={handleDeleteConfirm}
        itemTitle={deletingPortal ? deletingPortal.name : ''}
      />

    </div>
  );
};
