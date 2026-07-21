import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { DashboardStats, JobApplication } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { ApplicationModal } from '../components/ApplicationModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
  Briefcase,
  Bookmark,
  Send,
  FileCode,
  Users,
  XCircle,
  CheckCircle2,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Edit2,
  Trash2,
  Loader2,
  Clock,
  Layers,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    saved: 0,
    applied: 0,
    assessment: 0,
    interview: 0,
    rejected: 0,
    offer: 0,
  });
  const [recentApplications, setRecentApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [deletingApp, setDeletingApp] = useState<JobApplication | null>(null);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentApplications(response.data.recentApplications || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateApplication = async (formData: Partial<JobApplication>) => {
    await api.post('/applications', formData);
    fetchDashboardData();
  };

  const handleUpdateApplication = async (formData: Partial<JobApplication>) => {
    if (!editingApp) return;
    await api.patch(`/applications/${editingApp._id}`, formData);
    fetchDashboardData();
    setEditingApp(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingApp) return;
    await api.delete(`/applications/${deletingApp._id}`);
    fetchDashboardData();
    setDeletingApp(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Application Dashboard <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of your active job application funnel and recent progress.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      {/* 7 Statistics Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Application Metrics
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-28 glass-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <StatCard
              title="Total"
              count={stats.total}
              icon={Briefcase}
              colorClass="bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
              bgGlow="bg-indigo-500"
              onClick={() => navigate('/applications')}
            />
            <StatCard
              title="Saved"
              count={stats.saved}
              icon={Bookmark}
              colorClass="bg-slate-500/20 text-slate-300 border-slate-500/30"
              bgGlow="bg-slate-500"
              onClick={() => navigate('/applications?status=Saved')}
            />
            <StatCard
              title="Applied"
              count={stats.applied}
              icon={Send}
              colorClass="bg-blue-500/20 text-blue-300 border-blue-500/30"
              bgGlow="bg-blue-500"
              onClick={() => navigate('/applications?status=Applied')}
            />
            <StatCard
              title="Assessment"
              count={stats.assessment}
              icon={FileCode}
              colorClass="bg-amber-500/20 text-amber-300 border-amber-500/30"
              bgGlow="bg-amber-500"
              onClick={() => navigate('/applications?status=Assessment')}
            />
            <StatCard
              title="Interview"
              count={stats.interview}
              icon={Users}
              colorClass="bg-purple-500/20 text-purple-300 border-purple-500/30"
              bgGlow="bg-purple-500"
              onClick={() => navigate('/applications?status=Interview')}
            />
            <StatCard
              title="Rejected"
              count={stats.rejected}
              icon={XCircle}
              colorClass="bg-rose-500/20 text-rose-300 border-rose-500/30"
              bgGlow="bg-rose-500"
              onClick={() => navigate('/applications?status=Rejected')}
            />
            <StatCard
              title="Offers"
              count={stats.offer}
              icon={CheckCircle2}
              colorClass="bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
              bgGlow="bg-emerald-500"
              onClick={() => navigate('/applications?status=Offer')}
            />
          </div>
        )}
      </div>

      {/* Visual Application Progress Ratio Bar */}
      {stats.total > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Pipeline Distribution ({stats.total} total)</span>
            <span className="text-emerald-400">
              {Math.round(((stats.offer + stats.interview) / stats.total) * 100)}% Active Pipeline
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-900 overflow-hidden flex shadow-inner">
            {stats.saved > 0 && (
              <div
                style={{ width: `${(stats.saved / stats.total) * 100}%` }}
                className="bg-slate-500 h-full transition-all"
                title={`Saved: ${stats.saved}`}
              />
            )}
            {stats.applied > 0 && (
              <div
                style={{ width: `${(stats.applied / stats.total) * 100}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Applied: ${stats.applied}`}
              />
            )}
            {stats.assessment > 0 && (
              <div
                style={{ width: `${(stats.assessment / stats.total) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Assessment: ${stats.assessment}`}
              />
            )}
            {stats.interview > 0 && (
              <div
                style={{ width: `${(stats.interview / stats.total) * 100}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`Interview: ${stats.interview}`}
              />
            )}
            {stats.offer > 0 && (
              <div
                style={{ width: `${(stats.offer / stats.total) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Offer: ${stats.offer}`}
              />
            )}
            {stats.rejected > 0 && (
              <div
                style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`Rejected: ${stats.rejected}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Recently Added Applications Section */}
      <div className="glass-panel rounded-3xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Recently Added Applications</h2>
          </div>

          <Link
            to="/applications"
            className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
          >
            <span>View All Applications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            <span className="text-xs">Loading recent applications...</span>
          </div>
        ) : recentApplications.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800/60">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No Job Applications Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start building your application tracker by adding your first job entry.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Application</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {recentApplications.map((app) => (
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
                            className="text-slate-400 hover:text-indigo-400 transition"
                            title="Open original job link"
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
                    <td className="py-3.5 px-4 text-right space-x-2">
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
        )}
      </div>

      {/* Add Modal */}
      <ApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateApplication}
        title="Add Job Application"
      />

      {/* Edit Modal */}
      <ApplicationModal
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        onSubmit={handleUpdateApplication}
        initialData={editingApp}
        title="Edit Job Application"
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingApp}
        onClose={() => setDeletingApp(null)}
        onConfirm={handleDeleteConfirm}
        itemTitle={deletingApp ? `${deletingApp.jobTitle} at ${deletingApp.companyName}` : ''}
      />

    </div>
  );
};
