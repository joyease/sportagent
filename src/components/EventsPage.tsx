import React from 'react';
import { EVENT_NEWS } from '../data/initialData';
import {
  Flame,
  ExternalLink,
  Calendar,
  MapPin,
  Trophy,
  Sparkles,
  ArrowRight,
  Zap,
  Award,
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'light_tw':
        return (
          <span className="bg-lime-500/20 text-lime-300 border border-lime-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 text-lime-400" /> 全台點亮連線
          </span>
        );
      case 'badge_challenge':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> 年度成就挑戰
          </span>
        );
      default:
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" /> 焦點活動
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">最新活動區</h1>
            <p className="text-[11px] text-slate-500">mySports 全民熱門賽事、年度挑戰與徽章任務</p>
          </div>
        </div>
      </div>

      {/* Featured Banner - Dark Tech Theme */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-4 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-md">
            2026-2027 官方焦點企劃
          </span>
          <span className="text-xs font-medium text-slate-400">即刻加入挑戰</span>
        </div>
        <h2 className="text-base font-bold text-white mt-2">點亮台灣地圖，挑戰百萬大卡成就徽章！</h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          匯聚運動軌跡，解鎖各縣市專屬成就，讓每一步汗水化為榮譽勳章。
        </p>
      </div>

      {/* Events List - Dark Blocks */}
      <div className="space-y-4">
        {EVENT_NEWS.map((event) => {
          return (
            <div
              key={event.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-white space-y-3.5 transition hover:border-slate-700"
            >
              {/* Event Header & Title */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(event.category)}
                  </div>
                  <h3 className="font-bold text-base text-white tracking-wide">
                    {event.title}
                  </h3>
                </div>
              </div>

              {/* Date & Location Badges */}
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-medium text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  <Calendar className="w-3 h-3 text-blue-400" />
                  活動日期：{event.date}
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-200 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  <MapPin className="w-3 h-3 text-[#ff7d1a]" />
                  {event.location}
                </span>
              </div>

              {/* Event Description */}
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70">
                <p className="text-xs text-slate-200 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Highlight Pill */}
              <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-lime-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                  亮點：{event.highlight}
                </span>
              </div>

              {/* Action Link Button */}
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-950/50 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <span>前往活動專屬官網與詳情</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
