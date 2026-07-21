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
      
      {/* Header Banner - Square Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 border-2 border-slate-900 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Application Dashboard <Sparkles className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Overview of your active job application funnel and recent progress.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-3 font-bold text-xs sm:text-sm uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Application</span>
        </button>
      </div>

      {/* 7 Statistics Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Application Metrics
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-28 bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <StatCard
              title="Total"
              count={stats.total}
              icon={Briefcase}
              colorClass="bg-indigo-50 text-indigo-700 border-indigo-200"
              onClick={() => navigate('/applications')}
            />
            <StatCard
              title="Saved"
              count={stats.saved}
              icon={Bookmark}
              colorClass="bg-slate-100 text-slate-700 border-slate-300"
              onClick={() => navigate('/applications?status=Saved')}
            />
            <StatCard
              title="Applied"
              count={stats.applied}
              icon={Send}
              colorClass="bg-blue-50 text-blue-700 border-blue-200"
              onClick={() => navigate('/applications?status=Applied')}
            />
            <StatCard
              title="Assessment"
              count={stats.assessment}
              icon={FileCode}
              colorClass="bg-amber-50 text-amber-800 border-amber-200"
              onClick={() => navigate('/applications?status=Assessment')}
            />
            <StatCard
              title="Interview"
              count={stats.interview}
              icon={Users}
              colorClass="bg-purple-50 text-purple-700 border-purple-200"
              onClick={() => navigate('/applications?status=Interview')}
            />
            <StatCard
              title="Rejected"
              count={stats.rejected}
              icon={XCircle}
              colorClass="bg-rose-50 text-rose-700 border-rose-200"
              onClick={() => navigate('/applications?status=Rejected')}
            />
            <StatCard
              title="Offers"
              count={stats.offer}
              icon={CheckCircle2}
              colorClass="bg-emerald-50 text-emerald-800 border-emerald-200"
              onClick={() => navigate('/applications?status=Offer')}
            />
          </div>
        )}
      </div>

      {/* Visual Application Progress Ratio Bar */}
      {stats.total > 0 && (
        <div className="bg-white p-5 border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
            <span>Pipeline Distribution ({stats.total} total)</span>
            <span className="text-emerald-700">
              {Math.round(((stats.offer + stats.interview) / stats.total) * 100)}% Active Pipeline
            </span>
          </div>

          <div className="h-3 w-full bg-slate-100 border border-slate-200 overflow-hidden flex">
            {stats.saved > 0 && (
              <div
                style={{ width: `${(stats.saved / stats.total) * 100}%` }}
                className="bg-slate-400 h-full"
                title={`Saved: ${stats.saved}`}
              />
            )}
            {stats.applied > 0 && (
              <div
                style={{ width: `${(stats.applied / stats.total) * 100}%` }}
                className="bg-blue-600 h-full"
                title={`Applied: ${stats.applied}`}
              />
            )}
            {stats.assessment > 0 && (
              <div
                style={{ width: `${(stats.assessment / stats.total) * 100}%` }}
                className="bg-amber-500 h-full"
                title={`Assessment: ${stats.assessment}`}
              />
            )}
            {stats.interview > 0 && (
              <div
                style={{ width: `${(stats.interview / stats.total) * 100}%` }}
                className="bg-purple-600 h-full"
                title={`Interview: ${stats.interview}`}
              />
            )}
            {stats.offer > 0 && (
              <div
                style={{ width: `${(stats.offer / stats.total) * 100}%` }}
                className="bg-emerald-600 h-full"
                title={`Offer: ${stats.offer}`}
              />
            )}
            {stats.rejected > 0 && (
              <div
                style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                className="bg-rose-500 h-full"
                title={`Rejected: ${stats.rejected}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Recently Added Applications Section */}
      <div className="bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold uppercase tracking-tight text-slate-900">Recently Added Applications</h2>
          </div>

          <Link
            to="/applications"
            className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition uppercase tracking-wider"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500 space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            <span className="text-xs font-bold">Loading recent applications...</span>
          </div>
        ) : recentApplications.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-50 border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-extrabold text-slate-800">No Job Applications Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              Start building your application tracker by adding your first job entry.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Application</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                {recentApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-black text-slate-900">{app.companyName}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      <div className="flex items-center space-x-2">
                        <span>{app.jobTitle}</span>
                        {app.jobUrl && (
                          <a
                            href={app.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 transition"
                            title="Open original job link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{app.source}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {new Date(app.applicationDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingApp(app)}
                        className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                        title="Edit Application"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingApp(app)}
                        className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
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
