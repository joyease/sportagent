import React, { useState, useEffect } from 'react';
import { UserPlan, UserRecord } from '../types';
import { calculatePlanProgress } from '../utils/planCalc';
import { getUserNickname } from '../utils/user';
import {
  Trophy,
  Target,
  User,
  Mail,
  Zap,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Award,
  Flame,
  Calendar,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

interface ChallengeResultsPageProps {
  plans: UserPlan[];
  records: Record<string, UserRecord>;
  userEmail: string | null;
  onNavigateToCompletedPlans?: () => void;
  onNavigateToProfile?: () => void;
}

const STORAGE_KEY_UID = 'sportpal_user_uid_v1';

export const ChallengeResultsPage: React.FC<ChallengeResultsPageProps> = ({
  plans,
  records,
  userEmail,
  onNavigateToCompletedPlans,
  onNavigateToProfile,
}) => {
  const displayEmail = userEmail || 'hermann@trip.com';

  const [nickname, setNickname] = useState<string>(() => {
    return getUserNickname(displayEmail);
  });

  useEffect(() => {
    setNickname(getUserNickname(displayEmail));
  }, [displayEmail]);

  const [uid] = useState<string>(() => {
    let savedUid = localStorage.getItem(STORAGE_KEY_UID);
    if (!savedUid) {
      savedUid = String(Math.floor(10000 + Math.random() * 90000));
    }
    return savedUid.replace(/^UID-/, '');
  });

  const activePlans = plans.filter((p) => p.status === 'active');

  // Helper for generating dynamic encouragement & reminders
  const getEncouragementText = (percentage: number, plan: UserPlan, currentVal: number, targetVal: number, unit: string) => {
    if (plan.challengeTypes.includes('weight')) {
      if (currentVal <= targetVal) {
        return `🎉 太驚艷了！目前體重已達標 ${currentVal} kg，完美達成目標！持續保持健康作息與有氧運動！`;
      }
      const remaining = Math.round((currentVal - targetVal) * 10) / 10;
      if (percentage >= 70) {
        return `🔥 距離理想體重僅差 ${remaining} kg！目前減重進度非常順利，堅持均衡飲食，勝利就在眼前！`;
      }
      return `💪 規律運動是最好的減重良方，每週維持 3 次 30 分鐘有氧，持續累積微小進步！`;
    }

    if (percentage >= 100) {
      return `🏆 恭喜！你已突破 100% 完賽目標！展現了無與倫比的自律與毅力，為自己喝采！`;
    }
    if (percentage >= 80) {
      const remaining = Math.round((targetVal - currentVal) * 10) / 10;
      return `⚡ 達成率已達 ${percentage}%！僅差 ${remaining.toLocaleString()} ${unit} 即可達標，最後一哩路全力衝刺！`;
    }
    if (percentage >= 50) {
      return `🌟 進度已跨過半程大關（${percentage}%）！維持目前訓練節奏，每週規律打卡，目標手到擒來！`;
    }
    if (percentage > 0) {
      const remaining = Math.round((targetVal - currentVal) * 10) / 10;
      return `🏃‍♂️ 運動是跟自己的約定，已累積 ${currentVal.toLocaleString()} ${unit}，保持步頻與熱情，一步一步向前邁進！`;
    }
    return `🎯 新的挑戰已經啟動！穿上跑鞋邁出第一步，今天就是刷新紀錄的最佳起點！`;
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">運動挑戰成果</h1>
          </div>
        </div>
      </div>

      {/* Top User Info Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5ea31b] to-emerald-600 flex items-center justify-center text-white shadow-md shadow-lime-500/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 leading-tight">
                {nickname}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{displayEmail}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">專屬 UID</span>
            <span className="text-xs font-bold text-[#5ea31b] bg-lime-50 px-2.5 py-0.5 rounded-lg border border-lime-200 font-mono inline-block">
              {uid}
            </span>
          </div>
        </div>
      </div>

      {/* (A) 第一個區塊：進行中的挑戰 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-5 text-white space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">進行中的挑戰</h2>
          </div>
          <span className="text-xs font-medium text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-900">
            {activePlans.length} 個進行中
          </span>
        </div>

        {activePlans.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            目前尚無進行中的挑戰目標
          </div>
        ) : (
          <div className="space-y-5">
            {activePlans.map((plan, index) => {
              const progress = calculatePlanProgress(plan, records);
              const encouragement = getEncouragementText(
                progress.percentage,
                plan,
                progress.currentVal,
                progress.targetVal,
                progress.unit
              );

              return (
                <div
                  key={plan.id}
                  className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-2.5"
                >
                  {/* 第一列：挑戰主題 */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-sm font-bold text-white leading-snug">
                      <span className="text-red-400 mr-1.5 font-mono">挑戰主題 {index + 1}：</span>
                      <span>{plan.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-mono bg-slate-700/70 px-2 py-0.5 rounded-md whitespace-nowrap border border-slate-600">
                      {plan.startMonth} ~ {plan.endMonth}
                    </span>
                  </div>

                  {/* 第二列：目標 */}
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">目標：</span>
                    <span className="font-bold text-amber-300 font-mono">
                      {plan.challengeTypes.includes('weight')
                        ? `目標體重 ${plan.target} 公斤 (kg)`
                        : `累積 ${plan.target.toLocaleString()} ${progress.unit}`}
                    </span>
                  </div>

                  {/* 第三列：進度 */}
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span className="text-slate-400">進度：</span>
                    <span className="font-bold text-sky-300 font-mono">
                      {plan.challengeTypes.includes('weight')
                        ? `目前體重 ${progress.currentVal} 公斤 (kg)`
                        : `累積已達 ${progress.currentVal.toLocaleString()} ${progress.unit}`}
                    </span>
                  </div>

                  {/* 第四列：達成率 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">達成率：</span>
                      <span className="font-extrabold text-lime-400 font-mono text-sm">
                        {progress.percentage}%
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress.percentage >= 100
                            ? 'bg-gradient-to-r from-lime-500 to-emerald-400'
                            : progress.percentage >= 50
                            ? 'bg-gradient-to-r from-amber-500 to-lime-500'
                            : 'bg-gradient-to-r from-red-500 to-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(2, progress.percentage))}%` }}
                      />
                    </div>
                  </div>

                  {/* 第五列：激勵與提醒 */}
                  <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-700/60 mt-2">
                    <div className="text-[11px] text-slate-400 font-medium mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>激勵與提醒：</span>
                    </div>
                    <div className="text-xs text-lime-200 leading-relaxed font-normal">
                      {encouragement}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation Links */}
      <div className="pt-2 px-1 space-y-2.5">
        <div>
          <button
            onClick={onNavigateToCompletedPlans}
            className="text-xs font-semibold text-slate-600 hover:text-[#5ea31b] hover:underline flex items-center gap-1 transition"
          >
            <span>查詢已結束的挑戰&gt;&gt;&gt;</span>
          </button>
        </div>
        <div>
          <button
            onClick={onNavigateToProfile}
            className="text-xs font-semibold text-slate-600 hover:text-[#5ea31b] hover:underline flex items-center gap-1 transition"
          >
            <span>保持衝勁立馬留言去&gt;&gt;&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
