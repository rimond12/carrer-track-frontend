import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { JobApplication } from '../types';
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
} from 'lucide-react';

const STATUS_FILTERS = ['All', 'Saved', 'Applied', 'Assessment', 'Interview', 'Rejected', 'Offer'];
const SOURCE_FILTERS = ['All', 'LinkedIn', 'Bdjobs', 'Indeed', 'Wellfound', 'Facebook', 'Referral', 'Other'];

export const Applications: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [sort, setSort] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);

  // AI Modal state
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTargetTitle, setAiTargetTitle] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search.trim()) params.search = search.trim();
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
  }, [search, selectedStatus, selectedSource, sort]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Job Applications</h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and track all your target positions in one place.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleOpenAiModal('')}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI Job Assistant</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        {/* Row 1: Search input + View Toggles + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name or job title..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Source Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Sources</option>
              {SOURCE_FILTERS.filter(s => s !== 'All').map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector & Grid Toggle */}
          <div className="sm:col-span-3 flex items-center space-x-2">
            <div className="relative flex-1">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="companyAsc">Sort: Company (A-Z)</option>
                <option value="companyDesc">Sort: Company (Z-A)</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-700/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-indigo-600/30 text-indigo-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            Status:
          </span>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-xs font-medium">Fetching job applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 space-y-4 glass-panel rounded-3xl border border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No job applications match your current search and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedStatus('All');
              setSelectedSource('All');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition cursor-pointer"
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
              className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Card Header: Status & Actions */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={app.status} size="sm" />

                  <div className="flex items-center space-x-1 opacity-90">
                    <button
                      onClick={() => handleOpenAiModal(app.jobTitle)}
                      className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition cursor-pointer"
                      title="AI Preparation Insights"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingApp(app)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition cursor-pointer"
                      title="Edit Application"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingApp(app)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                      title="Delete Application"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Company & Job Title */}
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight group-hover:text-indigo-300 transition">
                    {app.jobTitle}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mt-1">
                    <Building className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{app.companyName}</span>
                    {app.jobUrl && (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 ml-1 inline-flex items-center gap-0.5"
                        title="Open posting"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Source & Application Date */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center space-x-1 bg-slate-900/60 px-2 py-0.5 rounded-md border border-slate-800">
                    <Tag className="w-3 h-3 text-blue-400" />
                    <span>{app.source}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
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
                  <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 line-clamp-2 italic">
                    "{app.notes}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-900/50">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">{app.companyName}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      <div className="flex items-center space-x-2">
                        <span>{app.jobTitle}</span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{app.source}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(app.applicationDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenAiModal(app.jobTitle)}
                        className="p-1.5 rounded-lg text-purple-400 hover:bg-purple-500/10 transition cursor-pointer"
                        title="AI Prep"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingApp(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition cursor-pointer"
                        title="Edit Application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingApp(app)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition cursor-pointer"
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
