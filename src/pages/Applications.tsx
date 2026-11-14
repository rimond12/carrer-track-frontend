import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import type { JobApplication, SourceItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ApplicationModal } from '../components/ApplicationModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { AIModal } from '../components/AIModal';
import {
  Search,
  Filter,
  Plus,
  Grid,
  List,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Briefcase,
  Building,
  Calendar,
  Tag,
  Loader2,
  X,
  Building2,
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];

export const Applications: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState(searchParams.get('company') || '');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetTitle, setAiTargetTitle] = useState('');

  // Fetch dynamic sources for filter dropdown
  useEffect(() => {
    const fetchSourceFilters = async () => {
      try {
        const res = await api.get('/sources');
        if (res.data.success && Array.isArray(res.data.sources)) {
          const names = res.data.sources.map((s: SourceItem) => s.name);
          setAvailableSources(names);
        }
      } catch (err) {
        console.error('Failed to load source filter options', err);
      }
    };
    fetchSourceFilters();
  }, []);

  // Update companyFilter if searchParams changes from outside
  useEffect(() => {
    const compParam = searchParams.get('company');
    if (compParam !== null) {
      setCompanyFilter(compParam);
    }
    const statParam = searchParams.get('status');
    if (statParam !== null) {
      setSelectedStatus(statParam);
    }
  }, [searchParams]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (companyFilter.trim()) params.company = companyFilter.trim();
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedSource !== 'All') params.source = selectedSource;
      if (sort) params.sort = sort;

      const response = await api.get('/applications', { params });
      if (response.data.success) {
        setApplications(response.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, companyFilter, selectedStatus, selectedSource, sort]);

  const handleCreate = async (formData: Partial<JobApplication>) => {
    await api.post('/applications', formData);
    fetchApplications();
  };

  const handleUpdate = async (formData: Partial<JobApplication>) => {
    if (!editingApp) return;
    await api.patch(`/applications/${editingApp._id}`, formData);
    fetchApplications();
    setEditingApp(null);
  };

  const handleDelete = async () => {
    if (!deletingApp) return;
    await api.delete(`/applications/${deletingApp._id}`);
    fetchApplications();
    setDeletingApp(null);
  };

  const handleOpenAiModal = (jobTitle: string) => {
    setAiTargetTitle(jobTitle);
    setAiModalOpen(true);
  };

  const clearCompanyFilter = () => {
    setCompanyFilter('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('company');
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 border-2 border-slate-900 dark:border-indigo-500/50 shadow-xs transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Job Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
            Browse, filter, and track all your active applications in real time.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Active Company Filter Tag Banner */}
      {companyFilter && (
        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Filtering applications for company: <strong className="text-indigo-700 dark:text-indigo-300">"{companyFilter}"</strong>
            </span>
          </div>
          <button
            onClick={clearCompanyFilter}
            className="flex items-center space-x-1 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Company Filter</span>
          </button>
        </div>
      )}

      {/* Filter and Search Panel */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        
        {/* Row 1: Search Inputs & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* General Search */}
          <div className="sm:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, notes..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
            />
          </div>

          {/* Dedicated Company Search / Filter (Requirement 1) */}
          <div className="sm:col-span-3 relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              placeholder="Filter by company..."
              className="w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
            />
            {companyFilter && (
              <button
                onClick={clearCompanyFilter}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dynamic Source Filter (Requirement 3) */}
          <div className="sm:col-span-3">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
            >
              <option value="All">All Application Sources</option>
              {availableSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector & View Toggle */}
          <div className="sm:col-span-3 flex items-center space-x-2">
            <div className="relative flex-1">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium text-xs sm:text-sm focus:outline-none focus:border-indigo-600"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="companyAsc">Sort: Company (A-Z)</option>
                <option value="companyDesc">Sort: Company (Z-A)</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Status Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Status:
          </span>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer border ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-bold uppercase tracking-wider">Fetching job applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">No Applications Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
            No job applications match your current search and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCompanyFilter('');
              setSelectedStatus('All');
              setSelectedSource('All');
              const newParams = new URLSearchParams();
              setSearchParams(newParams);
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {applications.map((app) => (
            <div
              key={app._id}
              className="square-card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Card Header: Status & Actions */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={app.status} size="sm" />

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenAiModal(app.jobTitle)}
                      className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
                      title="AI Preparation Insights"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingApp(app)}
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Edit Application"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingApp(app)}
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                      title="Delete Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Company & Job Title (Prominent Company Name) */}
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {app.jobTitle}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs font-black text-indigo-700 dark:text-indigo-300 mt-1">
                    <Building className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="uppercase tracking-wider">{app.companyName}</span>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 ml-1 inline-flex items-center gap-0.5"
                        title="Open posting"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Metadata: Source & Applied Date */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{app.source}</span>
                  </span>

                  <span className="flex items-center space-x-1 font-mono text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {new Date(app.applicationDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                </div>

                {/* Notes snippet */}
                {app.notes && (
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 line-clamp-2 italic">
                    "{app.notes}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {app.companyName}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                      <div className="flex items-center space-x-2">
                        <span>{app.jobTitle}</span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{app.source}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {new Date(app.applicationDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenAiModal(app.jobTitle)}
                        className="p-1.5 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition cursor-pointer"
                        title="AI Prep"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingApp(app)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingApp(app)}
                        className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                        title="Delete Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreate}
        title="Add Job Application"
      />

      <ApplicationModal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        onSubmit={handleUpdate}
        initialData={editingApp}
        title="Edit Job Application"
      />

      <DeleteConfirmModal
        isOpen={!!deletingApp}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleDelete}
        itemTitle={deletingApp ? `${deletingApp.jobTitle} at ${deletingApp.companyName}` : ''}
      />

      <AIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        defaultTitle={aiTargetTitle}
      />

    </div>
  );
};
