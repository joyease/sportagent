import React, { useState, useEffect } from 'react';
import { SurveyRecord } from '../types';
import { getUserNickname } from '../utils/user';
import {
  SURVEY_PERIODS,
  INITIAL_SURVEY_RECORDS,
  OS_OPTIONS,
  WEARABLE_OPTIONS,
  GENDER_OPTIONS,
  AGE_GROUP_OPTIONS,
  SPORTS_TYPE_COUNT_OPTIONS,
  YES_NO_OPTIONS,
  CITY_OPTIONS,
  OVERSEAS_OPTIONS,
  MULTIMEDIA_APP_OPTIONS,
  SPORTS_APP_OPTIONS,
} from '../data/initialSurveyData';
import {
  ClipboardList,
  User,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Activity,
  MapPin,
  Flame,
  Clock,
  Navigation,
  Globe,
  Trophy,
  Tv,
  Smartphone,
  Watch,
  Footprints,
  Bike,
  Shield,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeatureInputPageProps {
  userEmail: string | null;
  surveyRecords: Record<string, SurveyRecord>;
  onSaveSurveyRecord: (record: SurveyRecord) => Promise<void> | void;
  onNavigateToAdvice?: () => void;
}

export const FeatureInputPage: React.FC<FeatureInputPageProps> = ({
  userEmail,
  surveyRecords,
  onSaveSurveyRecord,
  onNavigateToAdvice,
}) => {
  const displayEmail = userEmail || 'hermann@trip.com';
  const nickname = getUserNickname(displayEmail);

  // Selected Survey Period
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026H1');

  // Form State initialized from records or fallback defaults
  const [formData, setFormData] = useState<SurveyRecord>(() => {
    const existing = surveyRecords['2026H1'] || INITIAL_SURVEY_RECORDS['2026H1'];
    return {
      ...existing,
      email: displayEmail,
      nickname,
      period: '2026H1',
      periodName: '2026上半年',
    };
  });

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // When period changes, reload matching record
  useEffect(() => {
    const periodObj = SURVEY_PERIODS.find((p) => p.id === selectedPeriod);
    const existing = surveyRecords[selectedPeriod] || INITIAL_SURVEY_RECORDS[selectedPeriod] || {
      nickname,
      period: selectedPeriod,
      periodName: periodObj?.label || selectedPeriod,
      email: displayEmail,
      userId: '88392',
      osType: 'iOS',
      wearableDevice: 'garmin',
      gender: '男',
      ageGroup: '50 到69',
      height: 173,
      weight: 70,
      sportsTypeCount: '3種以上',
      totalRecordsCount: 60,
      walkingCount: 15,
      runningCount: 35,
      cyclingCount: 10,
      dailyStepsCount: 150,
      dailyStepsCalories: 50000,
      walkingKm: 60,
      runningKm: 300,
      cyclingKm: 100,
      indoorMinutes: 400,
      otherMinutes: 180,
      weekdayCount: 20,
      weekendCount: 12,
      primaryCity: '台北市',
      crossCity: 'Y',
      overseasRegion: '日本',
      marathonEvent: 'Y',
      roamingAbroad: 'Y',
      travelWebsite: 'Y',
      weatherWebsite: 'Y',
      momoShopping: 'Y',
      multimediaApps: ['MyVideo', 'Spotify'],
      sportsApps: ['NikeRunC', 'Strava APP'],
    };

    setFormData({
      ...existing,
      period: selectedPeriod,
      periodName: periodObj?.label || selectedPeriod,
      email: displayEmail,
      nickname,
    });
    setSavedSuccess(false);
  }, [selectedPeriod, surveyRecords, displayEmail, nickname]);

  // Form field update helpers
  const handleTextOrSelectChange = (
    field: keyof SurveyRecord,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSavedSuccess(false);
  };

  const handleNumberChange = (
    field: keyof SurveyRecord,
    value: string
  ) => {
    const num = parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(num) ? 0 : num,
    }));
    setSavedSuccess(false);
  };

  const handleToggleMultiApp = (appName: string) => {
    setFormData((prev) => {
      const currentList = prev.multimediaApps || [];
      const exists = currentList.includes(appName);
      const nextList = exists
        ? currentList.filter((a) => a !== appName)
        : [...currentList, appName];
      return {
        ...prev,
        multimediaApps: nextList,
      };
    });
    setSavedSuccess(false);
  };

  const handleToggleSportsApp = (appName: string) => {
    setFormData((prev) => {
      const currentList = prev.sportsApps || [];
      const exists = currentList.includes(appName);
      const nextList = exists
        ? currentList.filter((a) => a !== appName)
        : [...currentList, appName];
      return {
        ...prev,
        sportsApps: nextList,
        usedApps: nextList, // keep backward compat
      };
    });
    setSavedSuccess(false);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const calculatedTotalDist =
      (formData.walkingKm || 0) + (formData.runningKm || 0) + (formData.cyclingKm || 0);

    const recordToSave: SurveyRecord = {
      ...formData,
      email: displayEmail,
      nickname,
      totalDistance: calculatedTotalDist,
      totalCalories: formData.dailyStepsCalories || formData.totalCalories || 0,
      totalMinutes: (formData.indoorMinutes || 0) + (formData.otherMinutes || 0) + 3000,
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSaveSurveyRecord(recordToSave);
      setSavedSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => {
        setSavedSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error saving survey record:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate live metrics
  const bmi =
    formData.height > 0 && formData.weight > 0
      ? (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)
      : '--';

  const totalDistanceKm = (formData.walkingKm || 0) + (formData.runningKm || 0) + (formData.cyclingKm || 0);

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* Page Title & Profile Header */}
      <div className="bg-gradient-to-r from-lime-800 via-[#3a6811] to-[#25440a] rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lime-300 shadow-inner">
              <ClipboardList className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">輸入運動特徵</h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-lime-400 text-slate-900 shadow-xs">
                  Firestore 雲端同步
                </span>
              </div>
              <p className="text-xs text-lime-100/80 mt-0.5">
                完整登錄個人化運動特徵指標，即時同步至雲端並產生運動處方
              </p>
            </div>
          </div>
        </div>

        {/* User Identity Info Card */}
        <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-xs">
              {nickname.charAt(0)}
            </div>
            <span className="font-bold text-white">{nickname}</span>
            <span className="text-lime-200/70 font-mono text-[11px]">({displayEmail})</span>
          </div>

          {onNavigateToAdvice && (
            <button
              type="button"
              onClick={onNavigateToAdvice}
              className="text-[11px] font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-lime-300" />
              查看運動建議與半年比較
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Survey Period Selector */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <label className="block text-xs font-black text-slate-800 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#5ea31b]" />
            調查期間（請選擇欲填寫或修改的半年期）：
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SURVEY_PERIODS.map((period) => {
              const isSelected = selectedPeriod === period.id;
              const hasExistingData = !!surveyRecords[period.id];
              return (
                <button
                  key={period.id}
                  type="button"
                  onClick={() => setSelectedPeriod(period.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-lime-500/15 border-[#5ea31b] text-lime-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm font-black">{period.label}</span>
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    {period.id}
                    {hasExistingData && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. 基本資訊與裝置特徵 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <User className="w-4 h-4 text-[#5ea31b]" />
            <h2 className="text-sm font-bold text-slate-900">1. 基本資訊與裝置特徵</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Nickname */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">用戶暱稱</label>
              <input
                type="text"
                value={formData.nickname || ''}
                onChange={(e) => handleTextOrSelectChange('nickname', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] focus:ring-1 focus:ring-[#5ea31b] outline-none font-bold"
                placeholder="hermann"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">電子信箱</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleTextOrSelectChange('email', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] focus:ring-1 focus:ring-[#5ea31b] outline-none font-mono"
                placeholder="hermann@trip.com"
              />
            </div>

            {/* OS TYPE */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Smartphone className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                OS TYPE
              </label>
              <select
                value={formData.osType || 'iOS'}
                onChange={(e) => handleTextOrSelectChange('osType', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-bold"
              >
                {OS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 穿戴裝置 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Watch className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                穿戴裝置
              </label>
              <select
                value={formData.wearableDevice || 'garmin'}
                onChange={(e) => handleTextOrSelectChange('wearableDevice', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-bold"
              >
                {WEARABLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 性別 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">性別</label>
              <div className="flex gap-2">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleTextOrSelectChange('gender', g)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.gender === g
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 年齡區間 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">年齡區間</label>
              <select
                value={formData.ageGroup || '50 到69'}
                onChange={(e) => handleTextOrSelectChange('ageGroup', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-bold"
              >
                {AGE_GROUP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* 身高 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">身高 (cm)</label>
              <input
                type="number"
                value={formData.height || ''}
                onChange={(e) => handleNumberChange('height', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="173"
              />
            </div>

            {/* 體重 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">體重 (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight || ''}
                onChange={(e) => handleNumberChange('weight', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="69.4"
              />
            </div>
          </div>

          {/* BMI Live Box */}
          <div className="bg-lime-50 rounded-xl p-2.5 border border-lime-200 flex items-center justify-between text-xs text-lime-900">
            <span className="font-medium">
              即時計算身體質量指數 (BMI)：<strong className="text-sm font-black">{bmi}</strong>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-lime-200/70 font-bold">
              {bmi !== '--' && parseFloat(bmi) < 24 ? '標準體態' : '持續維持'}
            </span>
          </div>
        </div>

        {/* 2. 參加運動種類與次數 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Activity className="w-4 h-4 text-[#5ea31b]" />
            <h2 className="text-sm font-bold text-slate-900">2. 參加運動種類與次數</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 參加的運動種類 */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                參加的運動種類
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SPORTS_TYPE_COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleTextOrSelectChange('sportsTypeCount', opt)}
                    className={`py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
                      formData.sportsTypeCount === opt
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 運動紀錄總次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                運動紀錄總次數
              </label>
              <input
                type="number"
                value={formData.totalRecordsCount || ''}
                onChange={(e) => handleNumberChange('totalRecordsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="96"
              />
            </div>

            {/* 每日步數次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                每日步數次數 (天)
              </label>
              <input
                type="number"
                value={formData.dailyStepsCount || ''}
                onChange={(e) => handleNumberChange('dailyStepsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="175"
              />
            </div>

            {/* 每日步數大卡 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Flame className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                每日步數大卡 (kcal)
              </label>
              <input
                type="number"
                value={formData.dailyStepsCalories || ''}
                onChange={(e) => handleNumberChange('dailyStepsCalories', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="76500"
              />
            </div>

            {/* 健走次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Footprints className="w-3.5 h-3.5 inline mr-1 text-emerald-500" />
                健走次數
              </label>
              <input
                type="number"
                value={formData.walkingCount || ''}
                onChange={(e) => handleNumberChange('walkingCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="20"
              />
            </div>

            {/* 跑步次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-[#5ea31b]" />
                跑步次數
              </label>
              <input
                type="number"
                value={formData.runningCount || ''}
                onChange={(e) => handleNumberChange('runningCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="56"
              />
            </div>

            {/* 單車次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Bike className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                單車次數
              </label>
              <input
                type="number"
                value={formData.cyclingCount || ''}
                onChange={(e) => handleNumberChange('cyclingCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="15"
              />
            </div>
          </div>
        </div>

        {/* 3. 累積運動距離長度與時間 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#5ea31b]" />
              <h2 className="text-sm font-bold text-slate-900">3. 累積運動距離長度與時間</h2>
            </div>
            <span className="text-[11px] font-mono font-bold bg-lime-100 text-lime-900 px-2 py-0.5 rounded-full">
              總里程：{totalDistanceKm} km
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 健走(km) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">健走 (km)</label>
              <input
                type="number"
                value={formData.walkingKm || ''}
                onChange={(e) => handleNumberChange('walkingKm', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="95"
              />
            </div>

            {/* 跑步(km) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">跑步 (km)</label>
              <input
                type="number"
                value={formData.runningKm || ''}
                onChange={(e) => handleNumberChange('runningKm', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="480"
              />
            </div>

            {/* 騎行(km) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">騎行 (km)</label>
              <input
                type="number"
                value={formData.cyclingKm || ''}
                onChange={(e) => handleNumberChange('cyclingKm', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="170"
              />
            </div>

            {/* 室內運動(分鐘) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                室內運動 (分鐘)
              </label>
              <input
                type="number"
                value={formData.indoorMinutes || ''}
                onChange={(e) => handleNumberChange('indoorMinutes', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="620"
              />
            </div>

            {/* 其它運動(分鐘) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                其它運動 (分鐘)
              </label>
              <input
                type="number"
                value={formData.otherMinutes || ''}
                onChange={(e) => handleNumberChange('otherMinutes', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="300"
              />
            </div>
          </div>
        </div>

        {/* 4. 運動時段與地點分佈 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <MapPin className="w-4 h-4 text-[#5ea31b]" />
            <h2 className="text-sm font-bold text-slate-900">4. 運動時段、地點與馬拉松賽事</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 平日(次數) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                平日 (次數)
              </label>
              <input
                type="number"
                value={formData.weekdayCount || ''}
                onChange={(e) => handleNumberChange('weekdayCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="28"
              />
            </div>

            {/* 假日+週末 (次數) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                假日+週末 (次數)
              </label>
              <input
                type="number"
                value={formData.weekendCount || ''}
                onChange={(e) => handleNumberChange('weekendCount', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-mono font-bold"
                placeholder="18"
              />
            </div>

            {/* 經常運動縣巿1st */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                經常運動縣巿 1st
              </label>
              <select
                value={formData.primaryCity || '台北市'}
                onChange={(e) => handleTextOrSelectChange('primaryCity', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-bold"
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 跨縣市運動 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                跨縣市運動
              </label>
              <div className="flex gap-2">
                {YES_NO_OPTIONS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleTextOrSelectChange('crossCity', val)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.crossCity === val
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {val === 'Y' ? '是 (Y)' : '否 (N)'}
                  </button>
                ))}
              </div>
            </div>

            {/* 海外運動 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Globe className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                海外運動
              </label>
              <select
                value={formData.overseasRegion || '日本'}
                onChange={(e) => handleTextOrSelectChange('overseasRegion', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#5ea31b] outline-none font-bold"
              >
                {OVERSEAS_OPTIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* 馬拉松賽事 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                <Trophy className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                馬拉松賽事
              </label>
              <div className="flex gap-2">
                {YES_NO_OPTIONS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleTextOrSelectChange('marathonEvent', val)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.marathonEvent === val
                        ? 'bg-amber-500/20 border-amber-600 text-amber-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {val === 'Y' ? '有參賽 (Y)' : '無參賽 (N)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. 生態系與生活網站行為 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Layers className="w-4 h-4 text-[#5ea31b]" />
            <h2 className="text-sm font-bold text-slate-900">5. 生態系與生活網站行為</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* 出國漫遊 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">出國漫遊</label>
              <div className="flex gap-1.5">
                {YES_NO_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleTextOrSelectChange('roamingAbroad', v)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.roamingAbroad === v
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* 旅遊網站 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">旅遊網站</label>
              <div className="flex gap-1.5">
                {YES_NO_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleTextOrSelectChange('travelWebsite', v)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.travelWebsite === v
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* 氣象網站 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">氣象網站</label>
              <div className="flex gap-1.5">
                {YES_NO_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleTextOrSelectChange('weatherWebsite', v)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.weatherWebsite === v
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* MOMO網站 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">MOMO網站</label>
              <div className="flex gap-1.5">
                {YES_NO_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleTextOrSelectChange('momoShopping', v)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formData.momoShopping === v
                        ? 'bg-lime-500/20 border-[#5ea31b] text-lime-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. 影音多媒體與運動 App 使用行為 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Tv className="w-4 h-4 text-[#5ea31b]" />
            <h2 className="text-sm font-bold text-slate-900">6. Used Multimedia & Sports APP</h2>
          </div>

          {/* Used Multimedia App */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-700">
              Used Multimedia App（多選）：
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MULTIMEDIA_APP_OPTIONS.map((app) => {
                const isChecked = (formData.multimediaApps || []).includes(app);
                return (
                  <button
                    key={app}
                    type="button"
                    onClick={() => handleToggleMultiApp(app)}
                    className={`p-2 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-purple-500/15 border-purple-500 text-purple-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{app}</span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-purple-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Used Sports APP */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-700">
              Used Sports APP（多選）：
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SPORTS_APP_OPTIONS.map((app) => {
                const isChecked = (formData.sportsApps || []).includes(app);
                return (
                  <button
                    key={app}
                    type="button"
                    onClick={() => handleToggleSportsApp(app)}
                    className={`p-2 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-lime-500/15 border-[#5ea31b] text-lime-950 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{app}</span>
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-[#5ea31b] text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Bar & Action */}
        <div className="sticky bottom-20 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-lime-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            {savedSuccess ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                特徵已成功儲存並同步至雲端 Firestore！
              </span>
            ) : (
              <span>
                填寫完成後點擊右方按鈕，即刻更新 <strong>{formData.periodName}</strong> 特徵資料庫。
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#5ea31b] to-lime-600 hover:from-[#4d8716] hover:to-lime-500 text-white text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? '同步儲存中...' : '儲存特徵並同步至雲端'}</span>
            </button>

            {onNavigateToAdvice && (
              <button
                type="button"
                onClick={onNavigateToAdvice}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>看對比建議</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
