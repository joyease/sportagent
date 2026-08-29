import React, { useState } from 'react';
import { UserRecord } from '../types';
import { BADGE_DEFINITIONS } from '../utils/badges';
import {
  Award,
  TrendingUp,
  Scale,
  Calendar,
  Sparkles,
  CheckCircle,
  Lock,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BadgesAndChartsPageProps {
  records: Record<string, UserRecord>;
  onNavigateToInput: () => void;
}

export const BadgesAndChartsPage: React.FC<BadgesAndChartsPageProps> = ({
  records,
  onNavigateToInput,
}) => {
  const sortedRecords: UserRecord[] = (Object.values(records) as UserRecord[]).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
  const months: string[] = sortedRecords.map((r) => r.month);

  const [selectedMonth, setSelectedMonth] = useState<string>(
    months.length > 0 ? months[months.length - 1] : '2026-08'
  );
  const [activeMetricTab, setActiveMetricTab] = useState<'distance' | 'calories' | 'minutes'>('distance');

  const currentRecord: UserRecord | undefined = records[selectedMonth];
  const allRecordsArray: UserRecord[] = sortedRecords;

  // Trigger confetti for fun on unlocked badge click
  const handleBadgeClick = (isUnlocked: boolean) => {
    if (isUnlocked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // Aggregated totals
  const totalDistance: number = sortedRecords.reduce((acc, r) => acc + (r.distance || 0), 0);
  const totalCalories: number = sortedRecords.reduce((acc, r) => acc + (r.calories || 0), 0);
  const totalMinutes: number = sortedRecords.reduce((acc, r) => acc + (r.minutes || 0), 0);
  const latestWeight: number =
    currentRecord?.weight || (sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1].weight : 70);

  // Maximum value calculation for bar chart normalization
  const maxDistance: number = Math.max(...sortedRecords.map((r) => r.distance || 0), 120);
  const maxCalories: number = Math.max(...sortedRecords.map((r) => r.calories || 0), 12000);
  const maxMinutes: number = Math.max(...sortedRecords.map((r) => r.minutes || 0), 1200);

  // Weight chart limits
  const weights: number[] = sortedRecords.map((r) => r.weight).filter((w) => typeof w === 'number' && w > 0);
  const minWeight: number = weights.length > 0 ? Math.min(...weights, 65) - 2 : 65;
  const maxWeight: number = weights.length > 0 ? Math.max(...weights, 75) + 2 : 75;

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header & Month Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900">運動與體重徽章</h1>
            <p className="text-[11px] text-slate-500">歷史紀錄趨勢圖表與成就榮譽點亮</p>
          </div>
        </div>

        {/* Month Selector dropdown */}
        <div className="flex items-center gap-1 bg-white border border-lime-300 rounded-xl px-2 py-1 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-lime-600 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m} {m === months[months.length - 1] ? '(當月)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-slate-800">
              {selectedMonth} 月度成就徽章
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            {BADGE_DEFINITIONS.filter((b) => b.check(currentRecord, allRecordsArray)).length} /{' '}
            {BADGE_DEFINITIONS.length} 已點亮
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {BADGE_DEFINITIONS.map((badge) => {
            const isUnlocked = badge.check(currentRecord, allRecordsArray);
            return (
              <div
                key={badge.id}
                onClick={() => handleBadgeClick(isUnlocked)}
                className={`p-3 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                  isUnlocked
                    ? `${badge.accentBg} shadow-sm hover:scale-[1.02]`
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <span className="text-lg">{badge.title.split(' ')[0]}</span>
                  {isUnlocked ? (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950">
                      <CheckCircle className="w-3 h-3" />
                      已達成
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500">
                      <Lock className="w-2.5 h-2.5" />
                      未解鎖
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-xs text-slate-900">
                    {badge.title.split(' ')[1]}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{badge.rule}</p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] font-semibold text-slate-600">
                  {badge.progressText(currentRecord, allRecordsArray)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sport Performance Trend Chart */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#5ea31b]" />
            <h2 className="text-xs font-bold text-slate-800">運動表現趨勢圖</h2>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => setActiveMetricTab('distance')}
              className={`px-2 py-1 rounded-md transition ${
                activeMetricTab === 'distance'
                  ? 'bg-[#5ea31b] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              公里 (km)
            </button>
            <button
              onClick={() => setActiveMetricTab('calories')}
              className={`px-2 py-1 rounded-md transition ${
                activeMetricTab === 'calories'
                  ? 'bg-[#ff6d00] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              卡路里 (kcal)
            </button>
            <button
              onClick={() => setActiveMetricTab('minutes')}
              className={`px-2 py-1 rounded-md transition ${
                activeMetricTab === 'minutes'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              分鐘 (min)
            </button>
          </div>
        </div>

        {/* Custom SVG Bar Chart */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-end justify-between h-40 pt-4 px-2 gap-3">
            {sortedRecords.map((r) => {
              let val = r.distance;
              let max = maxDistance;
              let colorClass = 'bg-gradient-to-t from-[#5ea31b] to-lime-400';

              if (activeMetricTab === 'calories') {
                val = r.calories;
                max = maxCalories;
                colorClass = 'bg-gradient-to-t from-[#ff6d00] to-amber-400';
              } else if (activeMetricTab === 'minutes') {
                val = r.minutes;
                max = maxMinutes;
                colorClass = 'bg-gradient-to-t from-sky-600 to-cyan-400';
              }

              const heightPercent = max > 0 ? Math.max(12, Math.round((val / max) * 100)) : 10;
              const isCurrent = r.month === selectedMonth;

              return (
                <div
                  key={r.month}
                  onClick={() => setSelectedMonth(r.month)}
                  className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-slate-700 mb-1 group-hover:text-black">
                    {val.toLocaleString()}
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-200/80 rounded-t-lg overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full ${colorClass} rounded-t-lg transition-all duration-500 ${
                        isCurrent ? 'ring-2 ring-slate-800 shadow-md' : 'opacity-85 hover:opacity-100'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-bold ${
                      isCurrent ? 'text-slate-900 underline underline-offset-2' : 'text-slate-400'
                    }`}
                  >
                    {r.month.split('-')[1]}月
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-center text-[10px] text-slate-400 font-medium">
            點擊月份柱狀可切換檢視該月徽章與數據
          </div>
        </div>
      </div>

      {/* Weight Progression Trend Chart */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-800">每月體重變化趨勢圖 (kg)</h2>
          </div>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            目標 ≦ 70.0 kg
          </span>
        </div>

        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="relative h-36 flex items-center justify-between px-4">
            {/* 70kg Goal Line */}
            <div
              className="absolute left-0 right-0 border-b-2 border-dashed border-red-400/80 pointer-events-none"
              style={{
                top: `${((maxWeight - 70) / (maxWeight - minWeight)) * 100}%`,
              }}
            >
              <span className="absolute right-2 -top-4 text-[9px] font-bold text-red-500 bg-white/90 px-1 rounded">
                標準線 70kg
              </span>
            </div>

            {/* SVG Connecting Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none px-6">
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={sortedRecords
                  .map((r, i) => {
                    const x = ((i + 0.5) / sortedRecords.length) * 100;
                    const y = ((maxWeight - (r.weight || 70)) / (maxWeight - minWeight)) * 100;
                    return `${x}%,${y}%`;
                  })
                  .join(' ')}
              />
            </svg>

            {/* Nodes on top */}
            {sortedRecords.map((r) => {
              const isUnder70 = (r.weight || 70) <= 70;
              const yPercent = ((maxWeight - (r.weight || 70)) / (maxWeight - minWeight)) * 100;
              const isCurrent = r.month === selectedMonth;

              return (
                <div
                  key={r.month}
                  onClick={() => setSelectedMonth(r.month)}
                  className="z-10 flex flex-col items-center cursor-pointer"
                  style={{
                    transform: `translateY(${yPercent - 50}%)`,
                  }}
                >
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shadow-sm mb-1 ${
                      isUnder70 ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white'
                    } ${isCurrent ? 'ring-2 ring-orange-500' : ''}`}
                  >
                    {r.weight}kg
                  </span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md ${
                      isUnder70 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 font-bold mt-1">
                    {r.month.split('-')[1]}月
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
            <span>
              當前記錄體重：<strong className="text-slate-800 font-bold">{latestWeight} kg</strong>
            </span>
            <span className={latestWeight <= 70 ? 'text-emerald-600 font-bold' : 'text-orange-600 font-bold'}>
              {latestWeight <= 70 ? '✅ 體態達標維持中' : '🔥 距離 70kg 仍需努力'}
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Lifetime Overview */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md border border-slate-700">
        <div className="text-xs font-bold text-lime-400 mb-2 flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          全歷史累計成果
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-300 block">總運動里程</span>
            <span className="text-base font-black text-lime-300">{totalDistance.toFixed(1)}</span>
            <span className="text-[9px] text-slate-400 block">km</span>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-300 block">總燃燒熱量</span>
            <span className="text-base font-black text-orange-400">
              {totalCalories.toLocaleString()}
            </span>
            <span className="text-[9px] text-slate-400 block">kcal</span>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-300 block">總運動分鐘</span>
            <span className="text-base font-black text-sky-300">{totalMinutes}</span>
            <span className="text-[9px] text-slate-400 block">min</span>
          </div>
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={onNavigateToInput}
            className="w-full py-2.5 bg-gradient-to-r from-[#5ea31b] to-lime-500 hover:from-[#528f17] hover:to-[#5ea31b] text-white font-bold text-xs rounded-xl shadow transition"
          >
            ✍️ 前往輸入或修正歷史月度數據
          </button>
        </div>
      </div>
    </div>
  );
};
