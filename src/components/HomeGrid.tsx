import React from 'react';
import { TabType } from './NavigationFooter';
import { UserRecord, UserPlan } from '../types';
import { calculatePlanProgress } from '../utils/planCalc';
import {
  Compass,
  Award,
  Target,
  Gift,
  Gamepad2,
  Flame,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Scale,
  Zap,
  BarChart3,
} from 'lucide-react';

interface HomeGridProps {
  onNavigate: (tab: TabType) => void;
  latestRecord?: UserRecord;
  activePlans: UserPlan[];
  allRecords: Record<string, UserRecord>;
}

export const HomeGrid: React.FC<HomeGridProps> = ({
  onNavigate,
  latestRecord,
  activePlans,
  allRecords,
}) => {
  // Compute best active plan progress
  const featuredPlan = activePlans.length > 0 ? activePlans[0] : null;
  const planProgress = featuredPlan ? calculatePlanProgress(featuredPlan, allRecords) : null;

  const modules = [
    {
      id: 'weather' as TabType,
      title: '熱點與天氣',
      icon: Compass,
      bgClass: 'bg-gradient-to-br from-[#062414] via-[#03170c] to-[#010a05] border border-emerald-900/60 hover:border-emerald-500/40 hover:from-[#0a331c] hover:to-[#021008] shadow-md shadow-black/40',
      badge: '即時氣象',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80',
      iconBg: 'bg-white/[0.08] border border-white/10 text-emerald-300',
    },
    {
      id: 'stats' as TabType,
      title: '運動統計區',
      icon: BarChart3,
      bgClass: 'bg-gradient-to-br from-[#231a04] via-[#161002] to-[#0a0701] border border-amber-900/60 hover:border-amber-500/40 hover:from-[#2e2305] hover:to-[#0f0b01] shadow-md shadow-black/40',
      badge: '年度趨勢',
      badgeColor: 'bg-amber-950/80 text-amber-300 border border-amber-800/80',
      iconBg: 'bg-white/[0.08] border border-white/10 text-amber-300',
    },
    {
      id: 'challenge_results' as TabType,
      title: '挑戰成果區',
      icon: Target,
      bgClass: 'bg-gradient-to-br from-[#280909] via-[#180404] to-[#0d0202] border border-red-900/60 hover:border-red-500/40 hover:from-[#350d0d] hover:to-[#120303] shadow-md shadow-black/40',
      badge: '達成率',
      badgeColor: 'bg-red-950/80 text-red-300 border border-red-800/80',
      iconBg: 'bg-white/[0.08] border border-white/10 text-red-300',
    },
    {
      id: 'promo' as TabType,
      title: '運動商品區',
      icon: Gift,
      bgClass: 'bg-gradient-to-br from-[#200b2e] via-[#14061d] to-[#09020e] border border-purple-900/60 hover:border-purple-500/40 hover:from-[#2b0e3e] hover:to-[#0d0314] shadow-md shadow-black/40',
      badge: '商品精選',
      badgeColor: 'bg-purple-950/80 text-purple-300 border border-purple-800/80',
      iconBg: 'bg-white/[0.08] border border-white/10 text-purple-300',
    },
    {
      id: 'interactive' as TabType,
      title: '趣味互動區',
      icon: Gamepad2,
      bgClass: 'bg-gradient-to-br from-[#2b081a] via-[#1a040f] to-[#0c0207] border border-pink-900/60 hover:border-pink-500/40 hover:from-[#380b22] hover:to-[#10020a] shadow-md shadow-black/40',
      badge: '線上賽事',
      badgeColor: 'bg-pink-950/80 text-pink-300 border border-pink-800/80',
      iconBg: 'bg-white/[0.08] border border-white/10 text-pink-300',
    },
    {
      id: 'news' as TabType,
      title: '最新活動區',
      icon: Flame,
      bgClass: 'bg-gradient-to-br from-[#08182f] via-[#040e1d] to-[#01060e] border border-blue-900/60 hover:border-blue-500/40 hover:from-[#0c2242] hover:to-[#030914] shadow-md shadow-black/40',
      badge: '賽事情報',
      badgeColor: 'bg-blue-950/80 text-blue-300 border border-blue-800/80',
      iconBg: 'bg-white/[0.08] border border-white/10 text-blue-300',
    },
  ];

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Hero Quick Status Card - Light Background */}
      <div className="relative overflow-hidden rounded-2xl bg-white p-4 text-slate-800 shadow-md border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#5ea31b] animate-ping" />
            <span className="text-xs font-bold tracking-wider text-[#5ea31b]">
              {latestRecord?.month || '2026-08'} 本月運動數據
            </span>
          </div>
          <button
            onClick={() => onNavigate('input')}
            className="flex items-center gap-1 text-[11px] font-bold text-white bg-gradient-to-r from-[#5ea31b] to-lime-600 hover:from-[#528f17] hover:to-[#5ea31b] px-3 py-1 rounded-full shadow-sm transition"
          >
            填寫/更新
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 4 Stats Grid - Light Styled Cards */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-lime-50/70 border border-lime-200/80 rounded-xl p-2">
            <span className="text-[10px] text-slate-500 font-semibold block">累積里程</span>
            <span className="text-base font-extrabold text-[#5ea31b]">
              {latestRecord ? latestRecord.distance.toFixed(1) : '0'}
            </span>
            <span className="text-[9px] text-slate-400 font-medium block">km</span>
          </div>

          <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-2">
            <span className="text-[10px] text-slate-500 font-semibold block">消耗熱量</span>
            <span className="text-base font-extrabold text-[#ff6d00]">
              {latestRecord ? latestRecord.calories.toLocaleString() : '0'}
            </span>
            <span className="text-[9px] text-slate-400 font-medium block">kcal</span>
          </div>

          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-2">
            <span className="text-[10px] text-slate-500 font-semibold block">運動時長</span>
            <span className="text-base font-extrabold text-sky-600">
              {latestRecord ? latestRecord.minutes : '0'}
            </span>
            <span className="text-[9px] text-slate-400 font-medium block">min</span>
          </div>

          <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-2">
            <span className="text-[10px] text-slate-500 font-semibold block">記錄體重</span>
            <span className="text-base font-extrabold text-purple-600">
              {latestRecord?.weight ? `${latestRecord.weight}` : '--'}
            </span>
            <span className="text-[9px] text-slate-400 font-medium block">kg</span>
          </div>
        </div>

        {/* Dynamic Plan Teaser if available */}
        {featuredPlan && planProgress && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex-1 mr-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-600 truncate max-w-[170px] font-semibold">
                  🎯 {featuredPlan.title}
                </span>
                <span className="text-[#5ea31b] font-bold">{planProgress.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-[#5ea31b] to-[#ff6d00] h-full rounded-full transition-all duration-500"
                  style={{ width: `${planProgress.percentage}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => onNavigate('challenge_results')}
              className="text-[10px] text-lime-700 font-bold hover:underline shrink-0 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200"
            >
              看進度
            </button>
          </div>
        )}
      </div>

      {/* 6 Feature Squares Grid */}
      <div>
        <div className="flex items-center justify-between px-1 mb-2.5">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#5ea31b]" />
            核心功能導覽
          </h2>
          <span className="text-[11px] text-slate-400">點擊快速前往</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className={`p-4 rounded-2xl text-left flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] min-h-[110px] text-white ${m.bgClass}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl backdrop-blur-xs ${m.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-medium text-white/95 text-sm sm:text-base leading-snug tracking-wide">
                    {m.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Campaign Banner - Light Up Taiwan Event */}
      <div className="p-3.5 bg-gradient-to-r from-lime-50 via-emerald-50 to-orange-50 rounded-2xl border-2 border-lime-300/80 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#5ea31b] to-lime-500 text-white shadow-sm shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-slate-900 truncate">大家集氣 一起點亮台灣!</div>
            <div className="text-[10px] text-slate-600 font-medium leading-tight">用MySports運動點亮各縣市!</div>
          </div>
        </div>
        <a
          href="https://www.mysports.net.tw/mHealthWebportal/event/2603LightTW3.html"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 bg-gradient-to-r from-[#ff6d00] to-orange-500 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-extrabold rounded-xl shadow-md shadow-orange-500/20 transition active:scale-95 shrink-0 flex items-center gap-1"
        >
          參加去
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
