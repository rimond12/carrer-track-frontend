import React from 'react';
import type { ApplicationStatus } from '../types';
import { Bookmark, Send, FileCode, Users, XCircle, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Saved':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Bookmark,
          dot: 'bg-slate-500',
        };
      case 'Applied':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-300',
          icon: Send,
          dot: 'bg-blue-600',
        };
      case 'Assessment':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          icon: FileCode,
          dot: 'bg-amber-600',
        };
      case 'Interview':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-300',
          icon: Users,
          dot: 'bg-purple-600',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-300',
          icon: XCircle,
          dot: 'bg-rose-600',
        };
      case 'Offer':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          dot: 'bg-emerald-600',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Bookmark,
          dot: 'bg-slate-500',
        };
    }
  };

  const config = getBadgeStyle();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-xs px-3.5 py-1.5 space-x-2',
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider border shadow-xs transition-all ${config.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 ${config.dot}`} />
      <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};
