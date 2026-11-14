import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
  activeFilter?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon: Icon,
  colorClass,
  activeFilter = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`square-card p-4 sm:p-5 relative transition-all duration-200 cursor-pointer ${
        activeFilter
          ? 'border-2 border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">{count}</h3>
        </div>

        <div className={`w-10 h-10 flex items-center justify-center border ${colorClass} shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
