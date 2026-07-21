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
          bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          icon: Bookmark,
          dot: 'bg-slate-400',
        };
      case 'Applied':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: Send,
          dot: 'bg-blue-400',
        };
      case 'Assessment':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: FileCode,
          dot: 'bg-amber-400',
        };
      case 'Interview':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: Users,
          dot: 'bg-purple-400',
        };
      case 'Rejected':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: XCircle,
          dot: 'bg-rose-400',
        };
      case 'Offer':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          dot: 'bg-emerald-400',
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          icon: Bookmark,
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeStyle();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3.5 py-1.5 space-x-2',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-xs transition-all ${config.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <IconComponent className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};
