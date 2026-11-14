import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { SourceItem } from '../types';
import {
  X,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  Power,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

interface ManageSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSourcesUpdated: () => void;
}

export const ManageSourcesModal: React.FC<ManageSourcesModalProps> = ({
  isOpen,
  onClose,
  onSourcesUpdated,
}) => {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New source form
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Editing inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUrl, setEditUrl] = useState('');

  // Reassign modal state
  const [reassignSource, setReassignSource] = useState<SourceItem | null>(null);
  const [targetSourceId, setTargetSourceId] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);

  const fetchSources = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/sources', { params: { includeInactive: 'true' } });
      if (res.data.success) {
        setSources(res.data.sources || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch sources');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSources();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setIsAdding(true);
      setError(null);
      await api.post('/sources', {
        name: newName.trim(),
        websiteUrl: newUrl.trim() || undefined,
        isActive: true,
      });
      setNewName('');
      setNewUrl('');
      await fetchSources();
      onSourcesUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add source');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleActive = async (source: SourceItem) => {
    try {
      await api.patch(`/sources/${source._id}`, {
        isActive: !source.isActive,
      });
      await fetchSources();
      onSourcesUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleStartEdit = (source: SourceItem) => {
    setEditingId(source._id);
    setEditName(source.name);
    setEditUrl(source.websiteUrl || '');
  };

  const handleSaveEdit = async (sourceId: string) => {
    if (!editName.trim()) return;
    try {
      await api.patch(`/sources/${sourceId}`, {
        name: editName.trim(),
        websiteUrl: editUrl.trim() || undefined,
      });
      setEditingId(null);
      await fetchSources();
      onSourcesUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update source');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sources.length) return;

    const sourceA = sources[index];
    const sourceB = sources[targetIndex];

    try {
      await Promise.all([
        api.patch(`/sources/${sourceA._id}`, { order: targetIndex }),
        api.patch(`/sources/${sourceB._id}`, { order: index }),
      ]);
      await fetchSources();
      onSourcesUpdated();
    } catch (err: any) {
      setError('Failed to update order');
    }
  };

  const handleDeleteSource = async (source: SourceItem) => {
    try {
      setError(null);
      await api.delete(`/sources/${source._id}`);
      await fetchSources();
      onSourcesUpdated();
    } catch (err: any) {
      if (err.response?.data?.inUse) {
        // Open reassign flow
        setReassignSource(source);
        const availableTargets = sources.filter((s) => s._id !== source._id && s.isActive);
        if (availableTargets.length > 0) {
          setTargetSourceId(availableTargets[0]._id);
        }
      } else {
        setError(err.response?.data?.message || 'Failed to delete source');
      }
    }
  };

  const handleExecuteReassign = async () => {
    if (!reassignSource || !targetSourceId) return;
    try {
      setIsReassigning(true);
      await api.post(`/sources/${reassignSource._id}/reassign`, {
        targetSourceId,
        deleteAfter: true,
      });
      setReassignSource(null);
      await fetchSources();
      onSourcesUpdated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reassign and delete');
    } finally {
      setIsReassigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-indigo-500/50 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                Manage Application Sources
              </h2>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                Admin Control Panel
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-bold flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">×</button>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Add New Source Section */}
          <form onSubmit={handleAddSource} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              Add New Application Source
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Source Name (e.g. Otta, ZipRecruiter)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="sm:col-span-4">
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Website URL (optional)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isAdding || !newName.trim()}
                  className="w-full h-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Add</span>}
                </button>
              </div>
            </div>
          </form>

          {/* Sources List */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Configured Sources ({sources.length})
            </h3>

            {loading ? (
              <div className="py-8 flex justify-center items-center text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : sources.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No application sources found.</p>
            ) : (
              <div className="border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-800">
                {sources.map((src, index) => (
                  <div
                    key={src._id}
                    className={`p-3 flex items-center justify-between transition ${
                      src.isActive ? 'bg-white dark:bg-slate-800/80' : 'bg-slate-100/60 dark:bg-slate-900/60 opacity-70'
                    }`}
                  >
                    {/* Left: Reorder arrows & details */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                      {/* Reorder buttons */}
                      <div className="flex flex-col space-y-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === sources.length - 1}
                          className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Name & Url or Edit input */}
                      {editingId === src._id ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 bg-white dark:bg-slate-700 border border-indigo-500 text-xs text-slate-900 dark:text-white font-bold"
                          />
                          <input
                            type="url"
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            placeholder="URL"
                            className="px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs text-slate-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(src._id)}
                            className="p-1 bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-400 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {src.name}
                            </span>
                            {!src.isActive && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase">
                                Deactivated
                              </span>
                            )}
                            {src.inUseCount !== undefined && src.inUseCount > 0 && (
                              <span className="text-[9px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold uppercase" title={`${src.inUseCount} applications using this source`}>
                                {src.inUseCount} in use
                              </span>
                            )}
                          </div>
                          {src.websiteUrl && (
                            <span className="text-[10px] text-slate-400 truncate block">
                              {src.websiteUrl}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(src)}
                        className={`p-1.5 transition cursor-pointer border ${
                          src.isActive
                            ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                            : 'text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                        }`}
                        title={src.isActive ? 'Deactivate source (hides from new dropdowns)' : 'Activate source'}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(src)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                        title="Rename source"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSource(src)}
                        className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
                        title={src.isInUse ? 'Source in use (offers reassign)' : 'Delete source'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reassign Modal Overlay if in-use deletion requested */}
        {reassignSource && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-6 z-20">
            <div className="bg-white dark:bg-slate-900 border-2 border-amber-500 p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="w-6 h-6" />
                <h4 className="text-sm font-extrabold uppercase tracking-tight">Source is Currently in Use</h4>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300">
                <strong>"{reassignSource.name}"</strong> is currently used by <strong>{reassignSource.inUseCount}</strong> application(s).
                To delete it safely, reassign those applications to another source:
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Reassign Applications To:
                </label>
                <select
                  value={targetSourceId}
                  onChange={(e) => setTargetSourceId(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {sources
                    .filter((s) => s._id !== reassignSource._id && s.isActive)
                    .map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReassignSource(null)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteReassign}
                  disabled={isReassigning || !targetSourceId}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition uppercase flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  {isReassigning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Reassign & Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 transition cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
