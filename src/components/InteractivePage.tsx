import React from 'react';
import { INTERACTIVE_CHALLENGES } from '../data/initialData';
import { Gamepad2, ExternalLink, Flame, Trophy, Compass, ArrowRight, Sparkles, MapPin, Signal, Award } from 'lucide-react';

export const InteractivePage: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'Flame':
        return <Signal className="w-5 h-5 text-amber-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-purple-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-rose-400" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'Compass':
        return 'bg-emerald-500/20 border-emerald-500/30';
      case 'Flame':
        return 'bg-amber-500/20 border-amber-500/30';
      case 'Trophy':
        return 'bg-purple-500/20 border-purple-500/30';
      default:
        return 'bg-rose-500/20 border-rose-500/30';
    }
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">趣味互動區</h1>
            <p className="text-[11px] text-slate-500">3D 打卡、網路訊號快測與小百岳完登認證</p>
          </div>
        </div>
      </div>

      {/* Featured Banner - Dark Tech Theme */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-4 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-md">
            精選實用互動工具
          </span>
          <span className="text-xs font-medium text-slate-400">免登入即刻體驗</span>
        </div>
        <h2 className="text-base font-bold text-white mt-2">動手玩一玩，享受更多元運動互動樂趣！</h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          匯集 3D 地景導覽、即時訊號量測與登山認證證書，隨時開啟運動新視野。
        </p>
      </div>

      {/* Challenge Cards - Dark Blocks */}
      <div className="space-y-4">
        {INTERACTIVE_CHALLENGES.map((challenge) => {
          return (
            <div
              key={challenge.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-white space-y-3.5 transition hover:border-slate-700"
            >
              {/* Block Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${getIconBg(challenge.icon)} flex items-center justify-center`}>
                    {getIcon(challenge.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white tracking-wide">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[10px]">
                      <span className="font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {challenge.badgeTag}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {challenge.platform}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/70">
                <p className="text-xs text-slate-200 leading-relaxed font-normal">
                  {challenge.description}
                </p>
              </div>

              {/* Highlight / Feature Pill */}
              <div className="p-2.5 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-rose-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  特色：{challenge.reward}
                </span>
              </div>

              {/* Action Button */}
              <a
                href={challenge.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-950/50 flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <span>立即前往體驗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
