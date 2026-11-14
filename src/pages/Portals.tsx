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
  LayoutGrid,
  List,
  Zap,
  Star,
} from 'lucide-react';

// --- Portal color palette (cycles through 8 vivid colors) ---
const PORTAL_COLORS = [
  { bg: 'bg-violet-600', text: 'text-white', ring: 'ring-violet-500/30', border: 'border-violet-400/40', accent: 'text-violet-500', light: 'bg-violet-50 dark:bg-violet-950/40', badgeBg: 'bg-violet-100 dark:bg-violet-900/60', badgeText: 'text-violet-700 dark:text-violet-300' },
  { bg: 'bg-sky-500',    text: 'text-white', ring: 'ring-sky-500/30',    border: 'border-sky-400/40',    accent: 'text-sky-500',    light: 'bg-sky-50 dark:bg-sky-950/40',    badgeBg: 'bg-sky-100 dark:bg-sky-900/60',    badgeText: 'text-sky-700 dark:text-sky-300'    },
  { bg: 'bg-emerald-500',text: 'text-white', ring: 'ring-emerald-500/30',border: 'border-emerald-400/40',accent: 'text-emerald-500',light: 'bg-emerald-50 dark:bg-emerald-950/40',badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',badgeText: 'text-emerald-700 dark:text-emerald-300'},
  { bg: 'bg-rose-500',   text: 'text-white', ring: 'ring-rose-500/30',   border: 'border-rose-400/40',   accent: 'text-rose-500',   light: 'bg-rose-50 dark:bg-rose-950/40',   badgeBg: 'bg-rose-100 dark:bg-rose-900/60',   badgeText: 'text-rose-700 dark:text-rose-300'   },
  { bg: 'bg-amber-500',  text: 'text-white', ring: 'ring-amber-500/30',  border: 'border-amber-400/40',  accent: 'text-amber-500',  light: 'bg-amber-50 dark:bg-amber-950/40',  badgeBg: 'bg-amber-100 dark:bg-amber-900/60',  badgeText: 'text-amber-700 dark:text-amber-300'  },
  { bg: 'bg-pink-500',   text: 'text-white', ring: 'ring-pink-500/30',   border: 'border-pink-400/40',   accent: 'text-pink-500',   light: 'bg-pink-50 dark:bg-pink-950/40',   badgeBg: 'bg-pink-100 dark:bg-pink-900/60',   badgeText: 'text-pink-700 dark:text-pink-300'   },
  { bg: 'bg-teal-500',   text: 'text-white', ring: 'ring-teal-500/30',   border: 'border-teal-400/40',   accent: 'text-teal-500',   light: 'bg-teal-50 dark:bg-teal-950/40',   badgeBg: 'bg-teal-100 dark:bg-teal-900/60',   badgeText: 'text-teal-700 dark:text-teal-300'   },
  { bg: 'bg-orange-500', text: 'text-white', ring: 'ring-orange-500/30', border: 'border-orange-400/40', accent: 'text-orange-500', light: 'bg-orange-50 dark:bg-orange-950/40', badgeBg: 'bg-orange-100 dark:bg-orange-900/60', badgeText: 'text-orange-700 dark:text-orange-300' },
];

const getColor = (index: number) => PORTAL_COLORS[index % PORTAL_COLORS.length];

// --- Modern Skeleton Loader ---
const SkeletonCard = () => (
  <div className="square-card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-sm bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      </div>
    </div>
    <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded" />
    <div className="space-y-2">
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded" />
      <div className="grid grid-cols-4 gap-1">
        {[0,1,2,3].map(i => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded" />)}
      </div>
    </div>
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 animate-pulse">
    <div className="w-9 h-9 rounded-sm bg-slate-200 dark:bg-slate-700 shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-32" />
      <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded w-20" />
    </div>
    <div className="hidden sm:flex gap-6">
      {[0,1,2,3].map(i => <div key={i} className="h-6 w-12 bg-slate-100 dark:bg-slate-800 rounded" />)}
    </div>
    <div className="h-5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full" />
    <div className="flex gap-1">
      <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded" />
      <div className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded" />
    </div>
  </div>
);

// --- Full-page loader with animated dots ---
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center py-24 space-y-5">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-violet-600 border-r-sky-500 rounded-full animate-spin" />
      <Globe className="absolute inset-0 m-auto w-6 h-6 text-slate-400 dark:text-slate-500" />
    </div>
    <div className="space-y-1 text-center">
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide">Loading Job Portals</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Computing analytics & response rates...</p>
    </div>
    <div className="flex gap-1.5">
      {[0,1,2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      if (portalsRes.data.success) setPortals(portalsRes.data.portals || []);
      if (statsRes.data.success) setSummary(statsRes.data.stats);
    } catch (err) {
      console.error('Error fetching portals data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPortalsData(); }, []);

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

  const filteredPortals = portals
    .filter((portal) => {
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!portal.name.toLowerCase().includes(q) && !portal.notes?.toLowerCase().includes(q)) return false;
      }
      if (accountFilter === 'HasAccount' && !portal.hasAccount) return false;
      if (accountFilter === 'NoAccount' && portal.hasAccount) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'rateDesc') return (b.responseRate || 0) - (a.responseRate || 0);
      if (sortOption === 'appsDesc') return (b.totalApplications || 0) - (a.totalApplications || 0);
      if (sortOption === 'nameAsc') return a.name.localeCompare(b.name);
      return 0;
    });

  // Build a stable color index map so colors don't shift on re-filter
  const colorMap = new Map(portals.map((p, i) => [p._id, i]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 border-2 border-slate-900 dark:border-slate-700 shadow-xs transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Job Portal Tracker <Globe className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Track where you search, manage login accounts, and analyze which job boards yield the highest response rates.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 transition shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Job Portal</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Portals',   value: summary.totalPortals,          sub: 'Tracked platforms',    icon: <Compass className="w-4 h-4" />,   color: 'text-violet-600 dark:text-violet-400',  iconBg: 'bg-violet-100 dark:bg-violet-900/50' },
          { label: 'With Account',    value: summary.portalsWithAccount,    sub: 'Ready to apply',       icon: <UserCheck className="w-4 h-4" />, color: 'text-emerald-600 dark:text-emerald-400',iconBg: 'bg-emerald-100 dark:bg-emerald-900/50'},
          { label: 'Need Account',    value: summary.portalsWithoutAccount, sub: 'Action recommended',   icon: <UserX className="w-4 h-4" />,     color: 'text-amber-600 dark:text-amber-400',    iconBg: 'bg-amber-100 dark:bg-amber-900/50'   },
          { label: 'Applications',    value: summary.totalApplications,     sub: 'Linked to portals',    icon: <TrendingUp className="w-4 h-4" />,color: 'text-sky-600 dark:text-sky-400',         iconBg: 'bg-sky-100 dark:bg-sky-900/50'       },
          { label: 'Response Rate',   value: `${summary.overallResponseRate}%`, sub: 'Replies / Applications', icon: <Sparkles className="w-4 h-4" />, color: 'text-pink-600 dark:text-pink-400', iconBg: 'bg-pink-100 dark:bg-pink-900/50', span: true },
        ].map(({ label, value, sub, icon, color, iconBg, span }) => (
          <div key={label} className={`square-card p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${span ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-black uppercase tracking-wider ${color}`}>{label}</span>
              <div className={`w-7 h-7 ${iconBg} flex items-center justify-center ${color}`}>{icon}</div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{sub}</span>
          </div>
        ))}
      </div>

      {/* Filter Bar + View Toggle */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search portal name or notes..."
              className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Account Filter */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500"
          >
            <option value="All">All Portals</option>
            <option value="HasAccount">Has Account</option>
            <option value="NoAccount">No Account</option>
          </select>

          {/* Sort */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500"
          >
            <option value="rateDesc">↑ Response Rate</option>
            <option value="appsDesc">↑ Most Applied</option>
            <option value="nameAsc">A–Z Name</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-slate-300 dark:border-slate-700 overflow-hidden ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-2 transition cursor-pointer ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-2 transition cursor-pointer ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-2">
            {filteredPortals.length} of {portals.length} portals
          </p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <>
          <PageLoader />
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}>
            {[1,2,3,4,5,6].map(i => viewMode === 'grid' ? <SkeletonCard key={i} /> : <SkeletonRow key={i} />)}
          </div>
        </>
      ) : filteredPortals.length === 0 ? (
        <div className="text-center py-20 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
            <Globe className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">No Portals Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            {search || accountFilter !== 'All'
              ? 'No job portals match your current filters. Try adjusting your search.'
              : 'Add your first job portal to start tracking where you apply and your response rates.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-violet-600 hover:bg-violet-700 transition cursor-pointer"
          >
            + Add First Portal
          </button>
        </div>

      ) : viewMode === 'grid' ? (
        /* ===== GRID VIEW ===== */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPortals.map((portal) => {
            const colorIdx = colorMap.get(portal._id) ?? 0;
            const c = getColor(colorIdx);
            return (
              <div
                key={portal._id}
                className={`square-card p-5 border bg-white dark:bg-slate-900 flex flex-col space-y-4 transition ${
                  portal.isBestPerforming
                    ? `${c.border} ring-2 ${c.ring}`
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 ${c.bg} ${c.text} flex items-center justify-center font-black text-lg shadow-xs flex-shrink-0 overflow-hidden`}>
                    {portal.logoUrl
                      ? <img src={portal.logoUrl} alt={portal.name} className="w-full h-full object-cover" />
                      : portal.name.charAt(0).toUpperCase()
                    }
                  </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-28">
                          {portal.name}
                        </h3>
                        {portal.websiteUrl && (
                          <a href={portal.websiteUrl} target="_blank" rel="noopener noreferrer"
                            className={`${c.accent} hover:opacity-70 flex-shrink-0`} title="Visit site">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      {portal.loginUrl && (
                        <a href={portal.loginUrl} target="_blank" rel="noopener noreferrer"
                          className={`text-[10px] ${c.accent} hover:underline`}>
                          Direct Login →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setEditingPortal(portal)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="Edit">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeletingPortal(portal)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 min-h-[20px]">
                  {portal.isBestPerforming && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${c.badgeBg} ${c.badgeText} border ${c.border} text-[9px] font-black uppercase tracking-wider`}>
                      <Star className="w-2.5 h-2.5" /> Best Performer · {portal.responseRate}%
                    </span>
                  )}
                  {portal.noRepliesYet && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-[9px] font-bold uppercase">
                      <AlertCircle className="w-2.5 h-2.5" /> No Replies Yet
                    </span>
                  )}
                </div>

                {/* Account Status Block */}
                <div className={`p-3 ${c.light} border ${c.border} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Account Status</span>
                    {portal.hasAccount ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 dark:text-rose-400">
                        <AlertCircle className="w-3 h-3" /> No Account
                      </span>
                    )}
                  </div>

                  {portal.hasAccount ? (
                    portal.username && (
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 font-mono truncate">
                        {portal.username}
                      </p>
                    )
                  ) : (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">Create account to apply</span>
                      {portal.websiteUrl && (
                        <a href={portal.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className={`px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${c.badgeBg} ${c.badgeText} border ${c.border} hover:opacity-80`}>
                          Sign Up →
                        </a>
                      )}
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]">
                    <span className={`flex items-center gap-1 ${c.accent}`}>
                      <Percent className="w-3 h-3" />
                      Profile: <strong>{portal.profileCompleted}%</strong>
                    </span>
                    <span className={`flex items-center gap-1 ${portal.resumeUploaded ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
                      <FileCheck className="w-3.5 h-3.5" />
                      {portal.resumeUploaded ? 'Resume ✓' : 'No Resume'}
                    </span>
                  </div>
                </div>

                {/* Analytics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Analytics</span>
                    <span className={`text-xs font-black ${c.accent}`}>{portal.responseRate}% Response</span>
                  </div>
                  {/* Rate Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${portal.responseRate || 0}%` }}
                      className={`h-full ${c.bg} transition-all duration-700`}
                    />
                  </div>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: 'Applied',    val: portal.totalApplications || 0, cls: 'text-slate-700 dark:text-slate-200' },
                      { label: 'Replies',    val: portal.repliesCount || 0,      cls: 'text-sky-600 dark:text-sky-400'     },
                      { label: 'Interview',  val: `${portal.interviewRate || 0}%`,cls: 'text-violet-600 dark:text-violet-400'},
                      { label: 'Offers',     val: portal.offerCount || 0,        cls: 'text-emerald-600 dark:text-emerald-400'},
                    ].map(({ label, val, cls }) => (
                      <div key={label} className="p-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                        <span className="block text-[8px] uppercase font-bold text-slate-400 tracking-wide">{label}</span>
                        <strong className={`text-sm font-extrabold ${cls}`}>{val}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {portal.notes && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 italic line-clamp-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    "{portal.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>

      ) : (
        /* ===== LIST VIEW ===== */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
            <div className="col-span-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Portal</div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Account</div>
            <div className="col-span-1 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Applied</div>
            <div className="col-span-1 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Replies</div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-wider text-slate-500 text-center">Response Rate</div>
            <div className="col-span-2 text-[10px] font-black uppercase tracking-wider text-slate-500 text-right">Actions</div>
          </div>

          {filteredPortals.map((portal) => {
            const colorIdx = colorMap.get(portal._id) ?? 0;
            const c = getColor(colorIdx);
            return (
              <div
                key={portal._id}
                className={`grid grid-cols-12 gap-4 px-5 py-4 items-center border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition group`}
              >
                {/* Portal name + link */}
                <div className="col-span-10 sm:col-span-4 flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 ${c.bg} ${c.text} flex items-center justify-center font-black text-sm flex-shrink-0 overflow-hidden`}>
                    {portal.logoUrl
                      ? <img src={portal.logoUrl} alt={portal.name} className="w-full h-full object-cover" />
                      : portal.name.charAt(0).toUpperCase()
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{portal.name}</span>
                      {portal.websiteUrl && (
                        <a href={portal.websiteUrl} target="_blank" rel="noopener noreferrer"
                          className={`${c.accent} opacity-0 group-hover:opacity-100 transition flex-shrink-0`}>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {portal.isBestPerforming && (
                        <span className={`text-[9px] font-black uppercase ${c.badgeText}`}>
                          <Zap className="w-2.5 h-2.5 inline mr-0.5" />Best
                        </span>
                      )}
                      {portal.noRepliesYet && (
                        <span className="text-[9px] text-slate-400 font-bold uppercase">No replies</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="hidden sm:flex col-span-2 justify-center">
                  {portal.hasAccount ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase border border-rose-200 dark:border-rose-800">
                      <AlertCircle className="w-3 h-3" /> None
                    </span>
                  )}
                </div>

                {/* Applied */}
                <div className="hidden sm:block col-span-1 text-center">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">{portal.totalApplications || 0}</span>
                </div>

                {/* Replies */}
                <div className="hidden sm:block col-span-1 text-center">
                  <span className={`text-sm font-extrabold ${c.accent}`}>{portal.repliesCount || 0}</span>
                </div>

                {/* Response Rate bar + % */}
                <div className="hidden sm:block col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div style={{ width: `${portal.responseRate || 0}%` }} className={`h-full ${c.bg} transition-all duration-700`} />
                    </div>
                    <span className={`text-xs font-black ${c.accent} w-10 text-right`}>{portal.responseRate}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end items-center gap-1">
                  <button onClick={() => setEditingPortal(portal)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="Edit">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeletingPortal(portal)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer" title="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <PortalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleCreatePortal} title="Add Job Portal" />
      <PortalModal isOpen={!!editingPortal} onClose={() => setEditingPortal(null)} onSubmit={handleUpdatePortal} initialData={editingPortal} title="Edit Job Portal" />
      <DeleteConfirmModal isOpen={!!deletingPortal} onClose={() => setDeletingPortal(null)} onConfirm={handleDeleteConfirm} itemTitle={deletingPortal ? deletingPortal.name : ''} />
    </div>
  );
};
