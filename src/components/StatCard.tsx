import React from 'react';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  colorClass: string;
  bgGlow: string;
  activeFilter?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  icon: Icon,
  colorClass,
  bgGlow,
  activeFilter = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden transition-all duration-300 cursor-pointer ${
        activeFilter ? 'ring-2 ring-indigo-500 bg-slate-800/80 scale-[1.02]' : 'hover:scale-[1.02]'
      }`}
    >
      {/* Background Accent Glow */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${bgGlow}`} />

      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">{count}</h3>
        </div>

        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorClass} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
