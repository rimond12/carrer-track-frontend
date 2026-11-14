import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import type { DashboardStats, JobApplication, TopCompanyInsight } from '../types';
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
  Building2,
  ChevronRight,
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
  const [topCompanies, setTopCompanies] = useState<TopCompanyInsight[]>([]);
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
        setTopCompanies(response.data.topCompanies || []);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 border-2 border-slate-900 dark:border-indigo-500/50 shadow-xs transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Application Dashboard <Sparkles className="w-6 h-6 text-amber-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">
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
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Application Metrics
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <StatCard
              title="Total"
              count={stats.total}
              icon={Briefcase}
              colorClass="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
              onClick={() => navigate('/applications')}
            />
            <StatCard
              title="Saved"
              count={stats.saved}
              icon={Bookmark}
              colorClass="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
              onClick={() => navigate('/applications?status=Saved')}
            />
            <StatCard
              title="Applied"
              count={stats.applied}
              icon={Send}
              colorClass="bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              onClick={() => navigate('/applications?status=Applied')}
            />
            <StatCard
              title="Assessment"
              count={stats.assessment}
              icon={FileCode}
              colorClass="bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
              onClick={() => navigate('/applications?status=Assessment')}
            />
            <StatCard
              title="Interview"
              count={stats.interview}
              icon={Users}
              colorClass="bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
              onClick={() => navigate('/applications?status=Interview')}
            />
            <StatCard
              title="Rejected"
              count={stats.rejected}
              icon={XCircle}
              colorClass="bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
              onClick={() => navigate('/applications?status=Rejected')}
            />
            <StatCard
              title="Offers"
              count={stats.offer}
              icon={CheckCircle2}
              colorClass="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
              onClick={() => navigate('/applications?status=Offer')}
            />
          </div>
        )}
      </div>

      {/* Pipeline Distribution Bar */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Pipeline Distribution ({stats.total} Total)
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold text-[11px]">
              {Math.round(((stats.applied + stats.assessment + stats.interview + stats.offer) / stats.total) * 100)}% Active Pipeline
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 flex overflow-hidden border border-slate-200 dark:border-slate-700">
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

      {/* Two Column Layout: Top Companies Insight + Recently Added Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Companies Insight (Requirement 1) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                  Top Companies
                </h2>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Insights
              </span>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center items-center text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              </div>
            ) : topCompanies.length === 0 ? (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs italic">
                Add job applications to reveal company analytics.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
                {topCompanies.map((c, idx) => (
                  <div
                    key={c.companyName}
                    onClick={() => navigate(`/applications?company=${encodeURIComponent(c.companyName)}`)}
                    className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2 cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                      <span className="w-5 h-5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-black flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate block">
                          {c.companyName}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {c.activeCount} active in pipeline
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black border border-slate-200 dark:border-slate-700">
                        {c.count} app{c.count > 1 ? 's' : ''}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Click on any company to filter your applications.
          </p>
        </div>

        {/* Recently Added Applications Section */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                Recently Added Applications
              </h2>
            </div>

            <Link
              to="/applications"
              className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition uppercase tracking-wider"
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
            <div className="text-center py-12 space-y-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No Job Applications Found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
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
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Job Title</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                  {recentApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white">{app.companyName}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center space-x-2">
                          <span>{app.jobTitle}</span>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition"
                              title="Open original job link"
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
                      <td className="py-3.5 px-4 text-right space-x-2">
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
          )}
        </div>

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
