import React, { useState, useMemo } from 'react';
import { UserRecord } from '../types';
import {
  BarChart3,
  User,
  Mail,
  Calendar,
  Activity,
  Flame,
  Clock,
  Scale,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface SportsStatsPageProps {
  records: Record<string, UserRecord>;
  userEmail: string | null;
  onNavigateToProfile?: () => void;
}

const STORAGE_KEY_NICKNAME = 'sportpal_user_nickname_v1';
const STORAGE_KEY_UID = 'sportpal_user_uid_v1';

const MONTH_LABELS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export const SportsStatsPage: React.FC<SportsStatsPageProps> = ({
  records,
  userEmail,
  onNavigateToProfile,
}) => {
  // User info
  const [nickname] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_NICKNAME) || '健跑達人 Hermann';
  });

  const [uid] = useState<string>(() => {
    let savedUid = localStorage.getItem(STORAGE_KEY_UID);
    if (!savedUid) {
      savedUid = String(Math.floor(10000 + Math.random() * 90000));
    }
    return savedUid.replace(/^UID-/, '');
  });

  const displayEmail = userEmail || 'hermanntalk@gmail.com';

  // Selected year state
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const availableYears = [2026, 2025, 2024];

  // Active hover/touch tooltip state for each chart
  const [activeDistanceMonth, setActiveDistanceMonth] = useState<number | null>(null);
  const [activeCaloriesMonth, setActiveCaloriesMonth] = useState<number | null>(null);
  const [activeMinutesMonth, setActiveMinutesMonth] = useState<number | null>(null);
  const [activeWeightMonth, setActiveWeightMonth] = useState<number | null>(null);

  // Extract 12 months data for selected year
  const yearlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthKey = `${selectedYear}-${String(monthNum).padStart(2, '0')}`;
      const record = records[monthKey];

      return {
        monthIndex: i,
        monthLabel: MONTH_LABELS[i],
        monthKey,
        hasData: !!record,
        distance: record ? record.distance : 0,
        calories: record ? record.calories : 0,
        minutes: record ? record.minutes : 0,
        weight: record && record.weight > 0 ? record.weight : null,
      };
    });

    // Compute aggregates
    const validDistanceMonths = months.filter((m) => m.distance > 0);
    const validCaloriesMonths = months.filter((m) => m.calories > 0);
    const validMinutesMonths = months.filter((m) => m.minutes > 0);
    const validWeightMonths = months.filter((m) => m.weight !== null && m.weight > 0);

    const totalDistance = months.reduce((acc, cur) => acc + cur.distance, 0);
    const avgDistance = validDistanceMonths.length > 0 ? Math.round((totalDistance / validDistanceMonths.length) * 10) / 10 : 0;
    const maxDistanceMonth = [...months].sort((a, b) => b.distance - a.distance)[0];

    const totalCalories = months.reduce((acc, cur) => acc + cur.calories, 0);
    const avgCalories = validCaloriesMonths.length > 0 ? Math.round(totalCalories / validCaloriesMonths.length) : 0;
    const maxCaloriesMonth = [...months].sort((a, b) => b.calories - a.calories)[0];

    const totalMinutes = months.reduce((acc, cur) => acc + cur.minutes, 0);
    const avgMinutes = validMinutesMonths.length > 0 ? Math.round(totalMinutes / validMinutesMonths.length) : 0;
    const maxMinutesMonth = [...months].sort((a, b) => b.minutes - a.minutes)[0];

    const latestWeight = validWeightMonths.length > 0 ? validWeightMonths[validWeightMonths.length - 1].weight : null;
    const firstWeight = validWeightMonths.length > 0 ? validWeightMonths[0].weight : null;
    const weightDiff = latestWeight && firstWeight ? Math.round((latestWeight - firstWeight) * 10) / 10 : null;

    return {
      months,
      totalDistance: Math.round(totalDistance * 10) / 10,
      avgDistance,
      maxDistanceMonth,
      totalCalories,
      avgCalories,
      maxCaloriesMonth,
      totalMinutes,
      avgMinutes,
      maxMinutesMonth,
      latestWeight,
      firstWeight,
      weightDiff,
      hasRecords: validDistanceMonths.length > 0 || validCaloriesMonths.length > 0,
    };
  }, [records, selectedYear]);

  // Helper for responsive SVG Line/Area Charts
  const renderTrendChart = (
    data: { monthLabel: string; value: number | null; hasData: boolean }[],
    config: {
      color: string;
      gradientId: string;
      unit: string;
      isWeight?: boolean;
      activeMonth: number | null;
      setActiveMonth: (idx: number | null) => void;
    }
  ) => {
    const width = 340;
    const height = 140;
    const paddingLeft = 32;
    const paddingRight = 14;
    const paddingTop = 16;
    const paddingBottom = 26;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Filter valid values for min/max
    const validValues = data
      .map((d) => d.value)
      .filter((v): v is number => v !== null && (config.isWeight ? v > 0 : v >= 0));

    let minVal = 0;
    let maxVal = 100;

    if (config.isWeight) {
      if (validValues.length > 0) {
        minVal = Math.floor(Math.min(...validValues) - 2);
        maxVal = Math.ceil(Math.max(...validValues) + 2);
      } else {
        minVal = 60;
        maxVal = 80;
      }
    } else {
      if (validValues.length > 0) {
        const rawMax = Math.max(...validValues);
        maxVal = rawMax > 0 ? Math.ceil(rawMax * 1.15) : 100;
        minVal = 0;
      }
    }

    const valRange = maxVal - minVal || 1;

    // Generate points
    const points = data.map((d, i) => {
      const x = paddingLeft + (i / 11) * chartW;
      const val = d.value !== null ? d.value : (config.isWeight ? null : 0);
      const y = val !== null ? paddingTop + chartH - ((val - minVal) / valRange) * chartH : null;
      return { x, y, value: d.value, label: d.monthLabel, hasData: d.hasData };
    });

    // Build SVG Path
    const validPoints = points.filter((p): p is { x: number; y: number; value: number | null; label: string; hasData: boolean } => p.y !== null);

    let linePath = '';
    let areaPath = '';

    if (validPoints.length > 0) {
      linePath = validPoints.reduce((acc, p, i) => {
        return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
      }, '');

      const firstPoint = validPoints[0];
      const lastPoint = validPoints[validPoints.length - 1];
      const baselineY = paddingTop + chartH;
      areaPath = `${linePath} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`;
    }

    // Grid lines count
    const yGridLevels = [0, 0.5, 1];

    return (
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity="0.38" />
              <stop offset="100%" stopColor={config.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yGridLevels.map((level, idx) => {
            const y = paddingTop + chartH - level * chartH;
            const labelVal = Math.round(minVal + level * valRange);
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#334155"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                >
                  {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill={`url(#${config.gradientId})`}
            />
          )}

          {/* Main Trend Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={config.color}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Monthly X-Axis Labels & Touch Target Columns */}
          {points.map((p, i) => {
            const isSelected = config.activeMonth === i;
            const hasRecord = p.hasData && p.value !== null && p.value > 0;

            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => config.setActiveMonth(i)}
                onClick={() => config.setActiveMonth(isSelected ? null : i)}
              >
                {/* Invisible wide hit area for easy tapping on mobile */}
                <rect
                  x={p.x - chartW / 24}
                  y={paddingTop}
                  width={chartW / 12}
                  height={chartH + paddingBottom}
                  fill="transparent"
                />

                {/* Vertical cursor guide when hovered/active */}
                {isSelected && (
                  <line
                    x1={p.x}
                    y1={paddingTop}
                    x2={p.x}
                    y2={paddingTop + chartH}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Data point dot */}
                {p.y !== null && (hasRecord || (config.isWeight && p.value !== null)) && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 4.5 : 2.5}
                    fill={isSelected ? '#ffffff' : config.color}
                    stroke={config.color}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-all duration-150"
                  />
                )}

                {/* X-Axis Month Text */}
                <text
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isSelected ? '#ffffff' : '#64748b'}
                  fontSize={isSelected ? '9' : '8'}
                  fontWeight={isSelected ? '700' : '500'}
                >
                  {i + 1}月
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip Badge on Active Month */}
        {config.activeMonth !== null && (
          <div className="mt-1.5 flex items-center justify-between text-xs bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-slate-300 font-medium">
              📅 {selectedYear}年 {config.activeMonth + 1}月：
            </span>
            <span className="font-bold text-white font-mono flex items-center gap-1">
              {data[config.activeMonth].value !== null && (data[config.activeMonth].value as number) > 0
                ? `${data[config.activeMonth].value?.toLocaleString()} ${config.unit}`
                : <span className="text-slate-400 font-normal">無運動紀錄</span>}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* (A) Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">運動統計區</h1>
          </div>
        </div>

        {/* Year Selector Dropdown in Header */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            {availableYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr} 年度
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* (B) Top User Info Card */}
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

      {/* (C) 4 Dark Themed Monthly Trend Charts */}
      <div className="space-y-4">
        {/* 1. 每月運動公里數 (km) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400 border border-lime-500/30">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">每月運動公里數 (km)</h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-lime-300 bg-lime-950/80 px-2.5 py-0.5 rounded-full border border-lime-900">
              <span>年總計: {yearlyData.totalDistance} km</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">月均跑量</span>
              <span className="font-bold text-white font-mono">{yearlyData.avgDistance} km</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">單月最高</span>
              <span className="font-bold text-lime-300 font-mono">
                {yearlyData.maxDistanceMonth.distance > 0 ? `${yearlyData.maxDistanceMonth.monthLabel} (${yearlyData.maxDistanceMonth.distance}km)` : '--'}
              </span>
            </div>
          </div>

          {/* Chart */}
          {renderTrendChart(
            yearlyData.months.map((m) => ({ monthLabel: m.monthLabel, value: m.distance, hasData: m.hasData })),
            {
              color: '#84cc16',
              gradientId: 'grad-distance',
              unit: '公里 (km)',
              activeMonth: activeDistanceMonth,
              setActiveMonth: setActiveDistanceMonth,
            }
          )}
        </div>

        {/* 2. 每月運動卡路里數 (kcal) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">每月運動卡路里數 (kcal)</h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange-300 bg-orange-950/80 px-2.5 py-0.5 rounded-full border border-orange-900">
              <span>年燃燒: {yearlyData.totalCalories.toLocaleString()} kcal</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">月均消耗</span>
              <span className="font-bold text-white font-mono">{yearlyData.avgCalories.toLocaleString()} kcal</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">單月最高</span>
              <span className="font-bold text-orange-300 font-mono">
                {yearlyData.maxCaloriesMonth.calories > 0 ? `${yearlyData.maxCaloriesMonth.monthLabel} (${yearlyData.maxCaloriesMonth.calories.toLocaleString()})` : '--'}
              </span>
            </div>
          </div>

          {/* Chart */}
          {renderTrendChart(
            yearlyData.months.map((m) => ({ monthLabel: m.monthLabel, value: m.calories, hasData: m.hasData })),
            {
              color: '#f97316',
              gradientId: 'grad-calories',
              unit: '大卡 (kcal)',
              activeMonth: activeCaloriesMonth,
              setActiveMonth: setActiveCaloriesMonth,
            }
          )}
        </div>

        {/* 3. 每月運動分鐘數 (min) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">每月運動分鐘數 (min)</h2>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-900">
              <span>總時長: {yearlyData.totalMinutes.toLocaleString()} 分鐘</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">月均時間</span>
              <span className="font-bold text-white font-mono">{yearlyData.avgMinutes.toLocaleString()} 分鐘</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">單月最高</span>
              <span className="font-bold text-sky-300 font-mono">
                {yearlyData.maxMinutesMonth.minutes > 0 ? `${yearlyData.maxMinutesMonth.monthLabel} (${yearlyData.maxMinutesMonth.minutes}分)` : '--'}
              </span>
            </div>
          </div>

          {/* Chart */}
          {renderTrendChart(
            yearlyData.months.map((m) => ({ monthLabel: m.monthLabel, value: m.minutes, hasData: m.hasData })),
            {
              color: '#0ea5e9',
              gradientId: 'grad-minutes',
              unit: '分鐘 (min)',
              activeMonth: activeMinutesMonth,
              setActiveMonth: setActiveMinutesMonth,
            }
          )}
        </div>

        {/* 4. 每月體重趨勢 (kg) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 text-white space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30">
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white tracking-wide">每月體重趨勢 (kg)</h2>
            </div>
            {yearlyData.latestWeight && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-pink-300 bg-pink-950/80 px-2.5 py-0.5 rounded-full border border-pink-900">
                <span>目前: {yearlyData.latestWeight} kg</span>
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">起初 vs 目前</span>
              <span className="font-bold text-white font-mono">
                {yearlyData.firstWeight ? `${yearlyData.firstWeight} → ${yearlyData.latestWeight} kg` : '--'}
              </span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/70 flex items-center justify-between">
              <span className="text-slate-400">年度體態變化</span>
              <span className="font-bold font-mono flex items-center gap-1">
                {yearlyData.weightDiff !== null ? (
                  yearlyData.weightDiff < 0 ? (
                    <span className="text-lime-400 flex items-center">
                      <TrendingDown className="w-3.5 h-3.5 inline mr-0.5" />
                      減輕 {Math.abs(yearlyData.weightDiff)} kg
                    </span>
                  ) : yearlyData.weightDiff > 0 ? (
                    <span className="text-amber-400 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" />
                      增加 {yearlyData.weightDiff} kg
                    </span>
                  ) : (
                    <span className="text-slate-300">維持平穩 (0 kg)</span>
                  )
                ) : (
                  <span className="text-slate-400">--</span>
                )}
              </span>
            </div>
          </div>

          {/* Chart */}
          {renderTrendChart(
            yearlyData.months.map((m) => ({ monthLabel: m.monthLabel, value: m.weight, hasData: m.hasData })),
            {
              color: '#ec4899',
              gradientId: 'grad-weight',
              unit: '公斤 (kg)',
              isWeight: true,
              activeMonth: activeWeightMonth,
              setActiveMonth: setActiveWeightMonth,
            }
          )}
        </div>
      </div>

      {/* Bottom Navigation Link */}
      <div className="pt-2 px-1">
        <button
          onClick={onNavigateToProfile}
          className="text-xs font-semibold text-slate-600 hover:text-[#5ea31b] hover:underline flex items-center gap-1 transition"
        >
          <span>保持衝勁立馬留言去&gt;&gt;&gt;</span>
        </button>
      </div>
    </div>
  );
};
