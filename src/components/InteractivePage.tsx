import React from 'react';
import { INTERACTIVE_CHALLENGES } from '../data/initialData';
import {
  Gamepad2,
  ExternalLink,
  Flame,
  Trophy,
  Compass,
  Landmark,
  Signal,
  Globe,
  Sparkles,
  Train,
} from 'lucide-react';

interface CardTheme {
  border: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  buttonGradient: string;
  textColor: string;
  glowAccent: string;
  spanClass: string;
}

export const InteractivePage: React.FC = () => {
  const getTheme = (id: string): CardTheme => {
    switch (id) {
      case 'challenge-1': // (1) 日本遊47朱印好運集 - 紅色
        return {
          border: 'border-red-500/40 hover:border-red-400',
          bgGradient: 'bg-gradient-to-br from-red-950/80 via-slate-900 to-rose-950/70',
          iconBg: 'bg-red-500/20 border-red-500/30',
          iconColor: 'text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
          buttonGradient:
            'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-950/50',
          textColor: 'text-red-200',
          glowAccent: 'bg-red-500',
          spanClass: 'col-span-2 sm:col-span-2',
        };
      case 'challenge-2': // (2) 臺灣246驛站巡禮 - 鐵道深藍
        return {
          border: 'border-blue-500/40 hover:border-blue-400',
          bgGradient: 'bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/70',
          iconBg: 'bg-blue-500/20 border-blue-500/30',
          iconColor: 'text-blue-300',
          badgeBg: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
          buttonGradient:
            'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-950/50',
          textColor: 'text-blue-200',
          glowAccent: 'bg-blue-500',
          spanClass: 'col-span-1 sm:col-span-1',
        };
      case 'challenge-3': // (3) 測測你的網路訊號 - 淺藍色
        return {
          border: 'border-sky-400/40 hover:border-sky-300',
          bgGradient: 'bg-gradient-to-br from-sky-950/80 via-slate-900 to-cyan-950/70',
          iconBg: 'bg-sky-500/20 border-sky-400/30',
          iconColor: 'text-sky-300',
          badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
          buttonGradient:
            'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-400 hover:to-cyan-500 text-white shadow-sky-950/50',
          textColor: 'text-sky-200',
          glowAccent: 'bg-sky-400',
          spanClass: 'col-span-1 sm:col-span-1',
        };
      case 'challenge-4': // (4) 完登小百岳得證書 - 深綠色
        return {
          border: 'border-emerald-600/40 hover:border-emerald-500',
          bgGradient: 'bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/80',
          iconBg: 'bg-emerald-500/20 border-emerald-500/30',
          iconColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          buttonGradient:
            'bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-950/50',
          textColor: 'text-emerald-200',
          glowAccent: 'bg-emerald-500',
          spanClass: 'col-span-1 sm:col-span-1',
        };
      case 'challenge-5': // (5) 轉轉地球儀 - 深藍色
        return {
          border: 'border-indigo-600/40 hover:border-indigo-500',
          bgGradient: 'bg-gradient-to-br from-indigo-950/90 via-slate-900 to-blue-950/80',
          iconBg: 'bg-indigo-500/20 border-indigo-500/30',
          iconColor: 'text-indigo-400',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          buttonGradient:
            'bg-gradient-to-r from-indigo-700 to-blue-800 hover:from-indigo-600 hover:to-blue-700 text-white shadow-indigo-950/50',
          textColor: 'text-indigo-200',
          glowAccent: 'bg-indigo-500',
          spanClass: 'col-span-1 sm:col-span-1',
        };
      case 'challenge-6': // (6) 臺灣100景點 - 幻彩紫金
      default:
        return {
          border: 'border-fuchsia-500/40 hover:border-fuchsia-400',
          bgGradient: 'bg-gradient-to-br from-purple-950/80 via-slate-900 to-fuchsia-950/70',
          iconBg: 'bg-fuchsia-500/20 border-fuchsia-500/30',
          iconColor: 'text-fuchsia-300',
          badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
          buttonGradient:
            'bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white shadow-fuchsia-950/50',
          textColor: 'text-fuchsia-200',
          glowAccent: 'bg-fuchsia-500',
          spanClass: 'col-span-2 sm:col-span-2',
        };
    }
  };

  const getIcon = (iconName: string, colorClass: string) => {
    switch (iconName) {
      case 'Train':
        return <Train className={`w-5 h-5 ${colorClass}`} />;
      case 'Landmark':
        return <Landmark className={`w-5 h-5 ${colorClass}`} />;
      case 'Compass':
        return <Compass className={`w-5 h-5 ${colorClass}`} />;
      case 'Signal':
        return <Signal className={`w-5 h-5 ${colorClass}`} />;
      case 'Trophy':
        return <Trophy className={`w-5 h-5 ${colorClass}`} />;
      case 'Globe':
        return <Globe className={`w-5 h-5 ${colorClass}`} />;
      case 'Flame':
        return <Flame className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Gamepad2 className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <div className="space-y-3.5 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">趣味互動區</h1>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-400" />
            精選實用互動工具
          </span>
          <span className="text-xs font-medium text-slate-400">免登入即刻體驗</span>
        </div>
        <h2 className="text-base font-bold text-white mt-2">動手玩一玩; Vibe coding很有趣!</h2>
      </div>

      {/* 6 Playful Bento Grid Challenge Blocks */}
      <div className="grid grid-cols-2 gap-3">
        {INTERACTIVE_CHALLENGES.map((challenge) => {
          const theme = getTheme(challenge.id);
          const isWide = theme.spanClass.includes('col-span-2');

          return (
            <div
              key={challenge.id}
              className={`${theme.spanClass} ${theme.bgGradient} border ${theme.border} rounded-2xl shadow-lg p-3.5 text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group`}
            >
              {/* Top ambient color glow accent */}
              <div
                className={`absolute -top-10 -right-10 w-24 h-24 ${theme.glowAccent} opacity-10 blur-2xl pointer-events-none rounded-full group-hover:opacity-20 transition`}
              />

              <div className="space-y-2.5">
                {/* Block Header */}
                <div className={`flex ${isWide ? 'items-center' : 'flex-col items-start'} justify-between gap-2`}>
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl border ${theme.iconBg} flex items-center justify-center shrink-0 shadow-inner`}
                    >
                      {getIcon(challenge.icon, theme.iconColor)}
                    </div>
                    <div>
                      <h3
                        className={`font-bold ${
                          isWide ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                        } text-white tracking-wide leading-tight`}
                      >
                        {challenge.title}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {challenge.platform}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${theme.badgeBg} shrink-0 self-start ${
                      isWide ? '' : 'mt-1'
                    }`}
                  >
                    {challenge.badgeTag}
                  </span>
                </div>

                {/* Description */}
                <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                  <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                    {challenge.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2.5 mt-auto">
                <a
                  href={challenge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2 ${theme.buttonGradient} text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition active:scale-[0.98] font-bold`}
                >
                  <span>立即前往體驗</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

