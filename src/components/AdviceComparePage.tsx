import React, { useState, useMemo } from 'react';
import { SurveyRecord } from '../types';
import { getUserNickname } from '../utils/user';
import { SURVEY_PERIODS, INITIAL_SURVEY_RECORDS } from '../data/initialSurveyData';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  Activity,
  Flame,
  Scale,
  Calendar,
  Zap,
  Navigation,
  Luggage,
  Trophy,
  ShoppingBag,
  Smartphone,
  ChevronRight,
  HeartPulse,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface AdviceComparePageProps {
  userEmail: string | null;
  surveyRecords: Record<string, SurveyRecord>;
  onNavigateToFeatureInput?: () => void;
}

export const AdviceComparePage: React.FC<AdviceComparePageProps> = ({
  userEmail,
  surveyRecords,
  onNavigateToFeatureInput,
}) => {
  const displayEmail = userEmail || 'hermann@trip.com';
  const nickname = getUserNickname(displayEmail);

  // Period Selection for Comparison
  const [periodAId, setPeriodAId] = useState<string>('2025H2');
  const [periodBId, setPeriodBId] = useState<string>('2026H1');

  // Retrieve Survey Record A and B with fallback to realistic initial defaults
  const recordA: SurveyRecord = useMemo(() => {
    return (
      surveyRecords[periodAId] ||
      INITIAL_SURVEY_RECORDS[periodAId] || {
        ...INITIAL_SURVEY_RECORDS['2025H2'],
        period: periodAId,
        periodName: SURVEY_PERIODS.find((p) => p.id === periodAId)?.label || periodAId,
      }
    );
  }, [surveyRecords, periodAId]);

  const recordB: SurveyRecord = useMemo(() => {
    return (
      surveyRecords[periodBId] ||
      INITIAL_SURVEY_RECORDS[periodBId] || {
        ...INITIAL_SURVEY_RECORDS['2026H1'],
        period: periodBId,
        periodName: SURVEY_PERIODS.find((p) => p.id === periodBId)?.label || periodBId,
      }
    );
  }, [surveyRecords, periodBId]);

  // Comparison Math Calculations
  const diffs = useMemo(() => {
    const calcDiff = (valB: number, valA: number) => {
      const diff = valB - valA;
      const rate = valA > 0 ? (diff / valA) * 100 : 0;
      return { diff, rate };
    };

    const count = calcDiff(recordB.totalRecordsCount, recordA.totalRecordsCount);
    const steps = calcDiff(recordB.totalSteps, recordA.totalSteps);
    const distance = calcDiff(recordB.totalDistance, recordA.totalDistance);
    const calories = calcDiff(recordB.totalCalories, recordA.totalCalories);
    const minutes = calcDiff(recordB.totalMinutes, recordA.totalMinutes);
    const weightDiff = recordB.weight - recordA.weight;

    const bmiA =
      recordA.height > 0 && recordA.weight > 0
        ? recordA.weight / Math.pow(recordA.height / 100, 2)
        : 0;
    const bmiB =
      recordB.height > 0 && recordB.weight > 0
        ? recordB.weight / Math.pow(recordB.height / 100, 2)
        : 0;

    const gpsRateA =
      recordA.gpsCount + recordA.noGpsCount > 0
        ? (recordA.gpsCount / (recordA.gpsCount + recordA.noGpsCount)) * 100
        : 0;
    const gpsRateB =
      recordB.gpsCount + recordB.noGpsCount > 0
        ? (recordB.gpsCount / (recordB.gpsCount + recordB.noGpsCount)) * 100
        : 0;

    return {
      count,
      steps,
      distance,
      calories,
      minutes,
      weightDiff,
      bmiA,
      bmiB,
      gpsRateA,
      gpsRateB,
    };
  }, [recordA, recordB]);

  // Sports items comparison
  const sportsCategories = useMemo(() => {
    return [
      {
        name: '跑步',
        icon: '🏃',
        valA: recordA.runningCount,
        valB: recordB.runningCount,
        color: 'from-lime-500 to-[#5ea31b]',
      },
      {
        name: '登山健行',
        icon: '⛰️',
        valA: recordA.hikingCount,
        valB: recordB.hikingCount,
        color: 'from-emerald-500 to-teal-600',
      },
      {
        name: '步行健走',
        icon: '🚶',
        valA: recordA.walkingCount,
        valB: recordB.walkingCount,
        color: 'from-sky-500 to-blue-600',
      },
      {
        name: '自行車',
        icon: '🚴',
        valA: recordA.cyclingCount,
        valB: recordB.cyclingCount,
        color: 'from-amber-500 to-orange-600',
      },
    ];
  }, [recordA, recordB]);

  const maxSportVal = Math.max(
    ...sportsCategories.flatMap((s) => [s.valA, s.valB]),
    10
  );

  // Dynamic Personalized Smart Prescriptions
  const prescriptions = useMemo(() => {
    const list = [];

    // 1. 心肺與耐力處方
    if (diffs.distance.diff > 0) {
      list.push({
        title: '心肺與跑量進階處方',
        tag: '耐力提升',
        color: 'emerald',
        icon: TrendingUp,
        content: `恭喜！${recordB.periodName} 總運動距離達 ${recordB.totalDistance} km，比基準期成長了 ${diffs.distance.rate.toFixed(1)}% (+${diffs.distance.diff.toFixed(1)} km)。建議下個階段每週安排 1 次漸進式長距離耐力跑（LSD 8-12km），配速控制在最大心率 65-75%，讓有氧心肺基礎更加穩固。`,
      });
    } else {
      list.push({
        title: '運動量維持與課表規劃',
        tag: '穩定維持',
        color: 'amber',
        icon: Activity,
        content: `目前運動總量持平或略有調降，建議每週固定鎖定 3 個運動日（如二、四、六），每次維持 30-45 分鐘中等強度運動，避免因天候或忙碌中斷訓練習慣。`,
      });
    }

    // 2. 體態與熱量管理
    if (diffs.weightDiff < 0) {
      list.push({
        title: '體態雕塑與減脂處方',
        tag: '體態優化',
        color: 'purple',
        icon: Scale,
        content: `體重從 ${recordA.weight} kg 降至 ${recordB.weight} kg（成功減輕 ${Math.abs(diffs.weightDiff).toFixed(1)} kg，BMI 降為 ${diffs.bmiB.toFixed(1)}）。卡路里總消耗增長 ${diffs.calories.rate.toFixed(1)}%，燃脂效率相當優異！建議運動後 30 分鐘內補充優質蛋白質（如豆漿、水煮蛋、乳清），維持肌肉量。`,
      });
    } else {
      list.push({
        title: '代謝提升與能量平衡處方',
        tag: '熱量管理',
        color: 'sky',
        icon: Flame,
        content: `目前體重維持在 ${recordB.weight} kg（BMI: ${diffs.bmiB.toFixed(1)}）。若想進一步提升線條，建議每週加入 2 次高強度間歇訓練（HIIT 或間歇跑），可加速運動後後燃效應（EPOC），提升全日基礎代謝率。`,
      });
    }

    // 3. 運動傷害防護與肌力平衡
    list.push({
      title: '關節防護與交叉訓練建議',
      tag: '運動防護',
      color: 'lime',
      icon: ShieldCheck,
      content: `運動記錄中跑步佔比最高（${recordB.runningCount} 次），登山（${recordB.hikingCount} 次）與單車（${recordB.cyclingCount} 次）為輔。建議每週安排 1 次深蹲、弓步蹲等下肢與核心肌群訓練，可大幅降低跑者膝（ITBS）與足底筋膜炎風險，並於運動後確實進行下肢肌群靜態伸展 15 分鐘。`,
    });

    // 4. 運動旅遊與賽事備戰
    if (recordB.marathonEventsCount > 0 || recordB.outdoorEventsCount > 0) {
      list.push({
        title: '下半年賽事備戰與戶外旅遊指南',
        tag: '賽事挑戰',
        color: 'orange',
        icon: Trophy,
        content: `您在 ${recordB.periodName} 報名了 ${recordB.marathonEventsCount} 場路跑賽事與 ${recordB.outdoorEventsCount} 場登山單車活動，且國內外旅遊運動記錄習慣高達 ${(diffs.gpsRateB).toFixed(0)}%！建議賽前 4 週進行模擬配速跑，並善用 ${recordB.usedApps.join('、')} 追蹤心率區間，以最佳狀態迎戰賽事。`,
      });
    }

    return list;
  }, [diffs, recordA, recordB]);

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5ea31b] to-emerald-400 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">運動建議與半年比較</h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-xs">
                  化繁為簡
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                透過跨半年運動特徵多維度對比，產生個人化智慧運動處方
              </p>
            </div>
          </div>
        </div>

        {/* User Info & Navigation */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{nickname}</span>
            <span className="text-emerald-300/70 font-mono text-[11px]">({displayEmail})</span>
          </div>

          {onNavigateToFeatureInput && (
            <button
              type="button"
              onClick={onNavigateToFeatureInput}
              className="text-[11px] font-bold text-white bg-emerald-700/80 hover:bg-emerald-600 px-3 py-1.5 rounded-full flex items-center gap-1 transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              修改/輸入特徵資料
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Period Selection Selector Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#5ea31b]" />
            選擇比較區間
          </h2>
          <span className="text-[11px] text-slate-400">跨半年指標自動比對</span>
        </div>

        <div className="grid grid-cols-11 gap-2 items-center">
          {/* Period A */}
          <div className="col-span-5">
            <label className="block text-[10px] font-bold text-slate-500 mb-1">
              基準期 (前期)
            </label>
            <select
              value={periodAId}
              onChange={(e) => setPeriodAId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
            >
              {SURVEY_PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* VS Divider */}
          <div className="col-span-1 text-center font-black text-slate-400 text-xs pt-4">
            VS
          </div>

          {/* Period B */}
          <div className="col-span-5">
            <label className="block text-[10px] font-bold text-slate-500 mb-1">
              比較期 (目標期)
            </label>
            <select
              value={periodBId}
              onChange={(e) => setPeriodBId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-lime-50 border border-lime-300 rounded-xl font-bold text-[#5ea31b] focus:bg-white focus:ring-2 focus:ring-lime-500"
            >
              {SURVEY_PERIODS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Comparison Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* 1. 總運動次數 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-lime-600" />
              運動總次數
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                diffs.count.diff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {diffs.count.diff >= 0 ? `+${diffs.count.rate.toFixed(0)}%` : `${diffs.count.rate.toFixed(0)}%`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{recordB.totalRecordsCount}</span>
            <span className="text-xs text-slate-400 font-semibold">次</span>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              (前期 {recordA.totalRecordsCount})
            </span>
          </div>
        </div>

        {/* 2. 總運動距離 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-bold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              累積運動距離
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                diffs.distance.diff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {diffs.distance.diff >= 0 ? `+${diffs.distance.rate.toFixed(0)}%` : `${diffs.distance.rate.toFixed(0)}%`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{recordB.totalDistance}</span>
            <span className="text-xs text-slate-400 font-semibold">km</span>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              (前期 {recordA.totalDistance})
            </span>
          </div>
        </div>

        {/* 3. 消耗熱量 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              消耗總卡路里
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                diffs.calories.diff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {diffs.calories.diff >= 0 ? `+${diffs.calories.rate.toFixed(0)}%` : `${diffs.calories.rate.toFixed(0)}%`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{recordB.totalCalories.toLocaleString()}</span>
            <span className="text-xs text-slate-400 font-semibold">kcal</span>
          </div>
        </div>

        {/* 4. 體重與 BMI 變化 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-bold flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-purple-600" />
              體重與 BMI
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                diffs.weightDiff <= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {diffs.weightDiff <= 0 ? `${diffs.weightDiff.toFixed(1)} kg` : `+${diffs.weightDiff.toFixed(1)} kg`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{recordB.weight}</span>
            <span className="text-xs text-slate-400 font-semibold">kg</span>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              BMI: {diffs.bmiB.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Sport Category Breakdown Progress Compare */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-black text-slate-800">各項運動次數分佈對比</h3>
            <p className="text-[10px] text-slate-400">跑步、登山、步行、自行車半年期次數變化</p>
          </div>
          <span className="text-[10px] font-bold text-lime-700 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200">
            {recordA.periodName} (灰) vs {recordB.periodName} (綠)
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {sportsCategories.map((item, idx) => {
            const pctA = Math.min(100, Math.round((item.valA / maxSportVal) * 100));
            const pctB = Math.min(100, Math.round((item.valB / maxSportVal) * 100));
            const delta = item.valB - item.valA;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px] font-normal">{item.valA} 次 ➔</span>
                    <span className="text-[#5ea31b] font-black">{item.valB} 次</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        delta >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {delta >= 0 ? `+${delta}` : `${delta}`}
                    </span>
                  </div>
                </div>

                {/* Progress bars pair */}
                <div className="space-y-1">
                  {/* Period A (Gray) */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-300 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pctA}%` }}
                    />
                  </div>
                  {/* Period B (Colored) */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} h-full rounded-full transition-all duration-500 shadow-xs`}
                      style={{ width: `${pctB}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Behavioral & Strength Comparison Grid */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          運動強度、軌跡與習慣轉變
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">運動頻率習慣</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {recordA.frequency} <span className="text-slate-400">➔</span>{' '}
              <span className="text-[#5ea31b] font-extrabold">{recordB.frequency}</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">較強運動頻率</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {recordA.intenseFrequency} <span className="text-slate-400">➔</span>{' '}
              <span className="text-orange-600 font-extrabold">{recordB.intenseFrequency}</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">有軌跡運動佔比</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {diffs.gpsRateA.toFixed(0)}% <span className="text-slate-400">➔</span>{' '}
              <span className="text-sky-600 font-extrabold">{diffs.gpsRateB.toFixed(0)}%</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">路跑與戶外賽事</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {recordA.marathonEventsCount + recordA.outdoorEventsCount} 場 <span className="text-slate-400">➔</span>{' '}
              <span className="text-purple-600 font-extrabold">
                {recordB.marathonEventsCount + recordB.outdoorEventsCount} 場
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Personalized Prescriptions (化繁為簡) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            化繁為簡 • 專屬運動處方與健康建議
          </h2>
          <span className="text-[10px] text-slate-400 font-bold">個人化演算</span>
        </div>

        {prescriptions.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2 hover:border-lime-400 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-lime-50 text-[#5ea31b] border border-lime-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900">{p.title}</h4>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {p.tag}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-1">{p.content}</p>
            </div>
          );
        })}
      </div>

      {/* Action Footer Bar */}
      <div className="pt-2">
        <button
          onClick={onNavigateToFeatureInput}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border-2 border-lime-600 text-lime-700 font-extrabold text-xs rounded-2xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4" />
          更新特徵數據並重新生成處方
        </button>
      </div>
    </div>
  );
};
