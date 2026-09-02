import React, { useState, useMemo } from 'react';
import { SurveyRecord } from '../types';
import { getUserNickname } from '../utils/user';
import { SURVEY_PERIODS, INITIAL_SURVEY_RECORDS } from '../data/initialSurveyData';
import {
  generateSmartPrescriptions,
  calculateSurveyDiffs,
} from '../utils/prescriptionRules';
import {
  Sparkles,
  TrendingUp,
  Activity,
  Flame,
  Scale,
  Calendar,
  Zap,
  Navigation,
  Trophy,
  ChevronRight,
  HeartPulse,
  FileSpreadsheet,
  Footprints,
  Bike,
  Clock,
  MapPin,
  Globe,
  Tv,
  Smartphone,
  Layers,
  Code2,
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

  // Comparison Math Calculations via Decision Rules Engine
  const diffs = useMemo(() => {
    return calculateSurveyDiffs(recordA, recordB);
  }, [recordA, recordB]);

  // Sports items comparison
  const sportsCategories = useMemo(() => {
    return [
      {
        name: '跑步',
        icon: '🏃',
        valA: recordA.runningCount || 0,
        valB: recordB.runningCount || 0,
        kmA: recordA.runningKm || 0,
        kmB: recordB.runningKm || 0,
        color: 'from-lime-500 to-[#5ea31b]',
      },
      {
        name: '單車騎行',
        icon: '🚴',
        valA: recordA.cyclingCount || 0,
        valB: recordB.cyclingCount || 0,
        kmA: recordA.cyclingKm || 0,
        kmB: recordB.cyclingKm || 0,
        color: 'from-amber-500 to-orange-600',
      },
      {
        name: '健走',
        icon: '🚶',
        valA: recordA.walkingCount || 0,
        valB: recordB.walkingCount || 0,
        kmA: recordA.walkingKm || 0,
        kmB: recordB.walkingKm || 0,
        color: 'from-sky-500 to-blue-600',
      },
    ];
  }, [recordA, recordB]);

  const maxSportVal = Math.max(
    ...sportsCategories.flatMap((s) => [s.valA, s.valB]),
    10
  );

  // Dynamic Personalized Smart Prescriptions generated from Decision Rules Engine
  const prescriptions = useMemo(() => {
    return generateSmartPrescriptions(recordA, recordB);
  }, [recordA, recordB]);

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
                  決策處方引擎
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                跨半年特徵多維對比 • 決策規則 Decision Rules 處方生成
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
              輸入/修改運動特徵
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
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500 outline-none"
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
              className="w-full px-3 py-2 text-xs bg-lime-50 border border-lime-300 rounded-xl font-bold text-[#5ea31b] focus:bg-white focus:ring-2 focus:ring-lime-500 outline-none"
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
                diffs.countDiff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {diffs.countDiff >= 0 ? `+${diffs.countRate.toFixed(0)}%` : `${diffs.countRate.toFixed(0)}%`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{recordB.totalRecordsCount || 0}</span>
            <span className="text-xs text-slate-400 font-semibold">次</span>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              (前期 {recordA.totalRecordsCount || 0})
            </span>
          </div>
        </div>

        {/* 2. 總運動距離 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-bold flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              累積總運動距離
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                diffs.distanceDiff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {diffs.distanceDiff >= 0 ? `+${diffs.distanceRate.toFixed(0)}%` : `${diffs.distanceRate.toFixed(0)}%`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">{diffs.totalDistanceB.toFixed(0)}</span>
            <span className="text-xs text-slate-400 font-semibold">km</span>
            <span className="text-[11px] text-slate-400 ml-auto font-mono">
              (前期 {diffs.totalDistanceA.toFixed(0)})
            </span>
          </div>
        </div>

        {/* 3. 每日步數大卡消耗 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span className="font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              每日步數大卡
            </span>
            <span
              className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                diffs.caloriesDiff >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {diffs.caloriesDiff >= 0 ? `+${diffs.caloriesRate.toFixed(0)}%` : `${diffs.caloriesRate.toFixed(0)}%`}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">
              {(recordB.dailyStepsCalories || 0).toLocaleString()}
            </span>
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
            <h3 className="text-xs font-black text-slate-800">跑步、單車、健走次數與距離比較</h3>
            <p className="text-[10px] text-slate-400">雙期運動次數與累積公里數對比</p>
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
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({item.kmB} km)
                    </span>
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

      {/* Behavioral, Schedule & Ecosystem Details */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          時段分配、生態系行為與常用 APP 轉變
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* 平日與假日次數 */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">運動時段 (平日/假日)</span>
            <div className="font-bold text-slate-800 mt-0.5">
              平日 {recordB.weekdayCount || 0} 次 / 假日 {recordB.weekendCount || 0} 次
            </div>
          </div>

          {/* 經常運動縣市與海外 */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">主要運動地點與海外</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {recordB.primaryCity || '台北市'} / 海外 {recordB.overseasRegion || '無'}
            </div>
          </div>

          {/* 馬拉松與跨縣市 */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">馬拉松賽事 / 跨縣市</span>
            <div className="font-bold text-slate-800 mt-0.5">
              馬拉松: <span className="text-amber-600">{recordB.marathonEvent || 'N'}</span> / 跨縣市: {recordB.crossCity || 'N'}
            </div>
          </div>

          {/* 穿戴裝置與 OS */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">OS TYPE 與穿戴裝置</span>
            <div className="font-bold text-slate-800 mt-0.5">
              {recordB.osType || 'iOS'} / {recordB.wearableDevice || 'garmin'}
            </div>
          </div>
        </div>

        {/* Multimedia & Sports App Pills */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Used Multimedia App：
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(recordB.multimediaApps || []).map((app) => (
                <span
                  key={app}
                  className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[10px] font-bold"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-600 block mb-1">
              Used Sports APP：
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(recordB.sportsApps || []).map((app) => (
                <span
                  key={app}
                  className="px-2 py-0.5 bg-lime-50 text-lime-800 border border-lime-200 rounded-lg text-[10px] font-bold"
                >
                  {app}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Personalized Prescriptions (化繁為簡) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-rose-500" />
            智慧運動處方與健康建議 (Decision Rules)
          </h2>
          <span className="text-[10px] text-slate-400 font-bold">即時規則運算</span>
        </div>

        {prescriptions.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2 hover:border-lime-400 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-lime-50 text-[#5ea31b] border border-lime-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{p.title}</h4>
                    <span className="text-[9px] text-slate-400 font-mono block">
                      {p.ruleTrigger}
                    </span>
                  </div>
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

      {/* Decision Rules Location Note Card */}
      <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-lime-400 font-bold text-xs">
          <Code2 className="w-4 h-4" />
          <span>處方決策規則 (Decision Rules) 存放位置說明</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          上述所有運動處方的<strong>決策門檻條件、文案範本與推薦邏輯</strong>皆獨立封裝於專屬模組：
          <code className="text-lime-300 bg-slate-800 px-1.5 py-0.5 rounded ml-1 font-mono">
            /src/utils/prescriptionRules.ts
          </code>
        </p>
        <p className="text-[10px] text-slate-400">
          您可以隨時在此檔案中自訂或擴充包含心肺、體態、運動傷害防護、生活節奏與賽事生態系的各項處方生成規則！
        </p>
      </div>

      {/* Action Footer Bar */}
      <div className="pt-1">
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
