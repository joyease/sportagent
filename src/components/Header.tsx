import React from 'react';
import { LogOut, User, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, onProfileClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-lime-100 shadow-sm">
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Logo matching mySports identity */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5ea31b] via-[#70b828] to-lime-400 flex items-center justify-center text-white shadow-md shadow-lime-500/20">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline font-black tracking-tight leading-none text-xl">
              <span className="text-slate-800 italic">my</span>
              <span className="text-[#ff6d00] ml-0.5 tracking-wider">Sports</span>
              <span className="ml-1 text-slate-800 font-black">
                Pal
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">運動與健康的好夥伴</span>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onProfileClick}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-lime-50 border border-slate-200 hover:border-lime-300 text-xs font-medium text-slate-700 transition"
            title="查看帳號與個人檔案"
          >
            <User className="w-3.5 h-3.5 text-[#5ea31b]" />
            <span className="max-w-[100px] truncate">{userEmail.split('@')[0]}</span>
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
            title="登出系統"
            aria-label="登出系統"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sporty gradient stripe accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#5ea31b] via-lime-400 to-[#ff6d00]" />
    </header>
  );
};
