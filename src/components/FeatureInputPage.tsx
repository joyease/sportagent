import React, { useState, useEffect } from 'react';
import { SurveyRecord } from '../types';
import { getUserNickname } from '../utils/user';
import { SURVEY_PERIODS, APP_OPTIONS, INITIAL_SURVEY_RECORDS } from '../data/initialSurveyData';
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
  Luggage,
  ShoppingBag,
  Trophy,
  Smartphone,
  Info,
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
      period: selectedPeriod,
      periodName: periodObj?.label || selectedPeriod,
      email: displayEmail,
      nickname,
      gender: '男',
      ageGroup: '50 到69',
      weight: 70,
      height: 173,
      totalRecordsCount: 60,
      totalSteps: 600000,
      noGpsCount: 15,
      gpsCount: 45,
      mainCityCount: 50,
      otherCityCount: 8,
      abroadCount: 2,
      runningCount: 35,
      hikingCount: 10,
      walkingCount: 10,
      cyclingCount: 5,
      totalDistance: 450,
      totalCalories: 45000,
      totalMinutes: 3600,
      frequency: '每周3-5次',
      intenseFrequency: '每周1-2次',
      intenseDistance: '每次5-10公里',
      intenseSpeed: '時速5-10公里',
      domesticTrips: 3,
      domesticTrackGps: '偶爾會',
      abroadTrips: 1,
      abroadTrackGps: '每次都會',
      onlineShoppingCount: 2,
      marathonEventsCount: 1,
      outdoorEventsCount: 1,
      usedApps: ['mySports', 'Garmin Connect'],
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

  const handleToggleApp = (appName: string) => {
    setFormData((prev) => {
      const exists = prev.usedApps.includes(appName);
      const nextApps = exists
        ? prev.usedApps.filter((a) => a !== appName)
        : [...prev.usedApps, appName];
      return {
        ...prev,
        usedApps: nextApps,
      };
    });
    setSavedSuccess(false);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const recordToSave: SurveyRecord = {
      ...formData,
      email: displayEmail,
      nickname,
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

  // Calculate BMI live preview
  const bmi =
    formData.height > 0 && formData.weight > 0
      ? (formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)
      : '--';

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
                完整登錄 30 項運動特徵指標，產生個人化半年度對比與運動處方
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
              className="text-[11px] font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full flex items-center gap-1 transition"
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
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 border ${
                    isSelected
                      ? 'bg-lime-600 text-white border-lime-600 shadow-md shadow-lime-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{period.label}</span>
                  <span
                    className={`text-[9px] ${
                      isSelected ? 'text-lime-200' : hasExistingData ? 'text-emerald-600 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    {hasExistingData ? '● 已有紀錄' : '可填寫'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: 基本體能特徵 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#5ea31b]" />
              一、基本體能特徵（第 1 - 4 項）
            </h3>
            <span className="text-[11px] font-bold text-lime-700 bg-lime-50 px-2 py-0.5 rounded-full border border-lime-200">
              BMI 試算: {bmi}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* 1. 性別 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                1. 性別
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleTextOrSelectChange('gender', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="男">男</option>
                <option value="女">女</option>
              </select>
            </div>

            {/* 2. 年齡 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                2. 年齡區間
              </label>
              <select
                value={formData.ageGroup}
                onChange={(e) => handleTextOrSelectChange('ageGroup', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="29以下">29以下</option>
                <option value="30-49">30-49</option>
                <option value="50 到69">50 到69</option>
                <option value="70以上">70以上</option>
              </select>
            </div>

            {/* 3. 體重 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                3. 體重 (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={formData.weight || ''}
                onChange={(e) => handleNumberChange('weight', e.target.value)}
                placeholder="例如: 69.4"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>

            {/* 4. 身高 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                4. 身高 (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="100"
                max="230"
                value={formData.height || ''}
                onChange={(e) => handleNumberChange('height', e.target.value)}
                placeholder="例如: 173"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: 運動總量與步數 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-orange-500" />
            二、運動總量統計（第 5 - 6, 16 - 18 項）
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* 5. 總計運動記錄次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                5. 總計運動記錄次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.totalRecordsCount}
                onChange={(e) => handleNumberChange('totalRecordsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 6. 總計運動步數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                6. 總計運動步數 (步)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.totalSteps}
                onChange={(e) => handleNumberChange('totalSteps', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 16. 總計運動距離 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                16. 總運動距離 (公里)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.totalDistance}
                onChange={(e) => handleNumberChange('totalDistance', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 17. 總計運動卡路里 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                17. 總消耗卡路里 (kcal)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.totalCalories}
                onChange={(e) => handleNumberChange('totalCalories', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 18. 總計運動時間 */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                18. 總運動時間 (分鐘)
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={formData.totalMinutes}
                onChange={(e) => handleNumberChange('totalMinutes', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: 軌跡與地點分佈 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-500" />
            三、軌跡記錄與地點分佈（第 7 - 11 項）
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* 7. 無軌跡運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                7. 無軌跡運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.noGpsCount}
                onChange={(e) => handleNumberChange('noGpsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 8. 有軌跡運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                8. 有軌跡運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.gpsCount}
                onChange={(e) => handleNumberChange('gpsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 9. 主要縣市運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                9. 主要縣市運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.mainCityCount}
                onChange={(e) => handleNumberChange('mainCityCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 10. 其他縣市運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                10. 其他縣市運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.otherCityCount}
                onChange={(e) => handleNumberChange('otherCityCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 11. 國外運動次數 */}
            <div className="col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                11. 國外運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.abroadCount}
                onChange={(e) => handleNumberChange('abroadCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: 運動項目次數細分 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-emerald-600" />
            四、運動項目次數細分（第 12 - 15 項）
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* 12. 跑步運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                12. 跑步運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.runningCount}
                onChange={(e) => handleNumberChange('runningCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 13. 登山運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                13. 登山運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.hikingCount}
                onChange={(e) => handleNumberChange('hikingCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 14. 步行運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                14. 步行運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.walkingCount}
                onChange={(e) => handleNumberChange('walkingCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 15. 自行車運動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                15. 自行車運動次數
              </label>
              <input
                type="number"
                min="0"
                value={formData.cyclingCount}
                onChange={(e) => handleNumberChange('cyclingCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        {/* Section 5: 運動頻率與強度 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            五、運動頻率與強度（第 19 - 22 項）
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 19. 運動頻率 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                19. 運動頻率
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => handleTextOrSelectChange('frequency', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="每天運動">每天運動</option>
                <option value="每周3-5次">每周3-5次</option>
                <option value="每周1-2次">每周1-2次</option>
                <option value="更少">更少</option>
              </select>
            </div>

            {/* 20. 較強的運動頻率 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                20. 較強的運動頻率
              </label>
              <select
                value={formData.intenseFrequency}
                onChange={(e) => handleTextOrSelectChange('intenseFrequency', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="每天運動">每天運動</option>
                <option value="每周3-5次">每周3-5次</option>
                <option value="每周1-2次">每周1-2次</option>
                <option value="更少">更少</option>
              </select>
            </div>

            {/* 21. 較強的運動距離 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                21. 較強的運動距離
              </label>
              <select
                value={formData.intenseDistance}
                onChange={(e) => handleTextOrSelectChange('intenseDistance', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="每次1 ~3公里">每次1 ~3公里</option>
                <option value="每次3-5公里">每次3-5公里</option>
                <option value="每次5-10公里">每次5-10公里</option>
                <option value="每次10-20公里">每次10-20公里</option>
                <option value="每次20公里以上">每次20公里以上</option>
              </select>
            </div>

            {/* 22. 較強的運動強度 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                22. 較強的運動強度
              </label>
              <select
                value={formData.intenseSpeed}
                onChange={(e) => handleTextOrSelectChange('intenseSpeed', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="時速3公里以下">時速3公里以下</option>
                <option value="時速3-5公里">時速3-5公里</option>
                <option value="時速5-10公里">時速5-10公里</option>
                <option value="時速10公里以上">時速10公里以上</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 6: 旅遊運動習慣 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Luggage className="w-4 h-4 text-purple-600" />
            六、旅遊與戶外運動習慣（第 23 - 26 項）
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* 23. 國內住宿旅遊次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                23. 國內住宿旅遊 (半年內幾次)
              </label>
              <input
                type="number"
                min="0"
                value={formData.domesticTrips}
                onChange={(e) => handleNumberChange('domesticTrips', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 24. 國內旅遊會運動記錄軌跡嗎 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                24. 國內旅遊會記錄軌跡嗎
              </label>
              <select
                value={formData.domesticTrackGps}
                onChange={(e) => handleTextOrSelectChange('domesticTrackGps', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="每次都會">每次都會</option>
                <option value="偶爾會">偶爾會</option>
                <option value="不會">不會</option>
              </select>
            </div>

            {/* 25. 國外住宿旅遊次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                25. 國外住宿旅遊 (半年內幾次)
              </label>
              <input
                type="number"
                min="0"
                value={formData.abroadTrips}
                onChange={(e) => handleNumberChange('abroadTrips', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 26. 國外旅遊會運動記錄軌跡嗎 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                26. 國外旅遊會記錄軌跡嗎
              </label>
              <select
                value={formData.abroadTrackGps}
                onChange={(e) => handleTextOrSelectChange('abroadTrackGps', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              >
                <option value="每次都會">每次都會</option>
                <option value="偶爾會">偶爾會</option>
                <option value="不會">不會</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 7: 賽事參與與消費習慣 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            七、賽事參與與消費習慣（第 27 - 29 項）
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 27. 網路購買運動商品次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-pink-500" />
                27. 網購運動商品 (半年次數)
              </label>
              <input
                type="number"
                min="0"
                value={formData.onlineShoppingCount}
                onChange={(e) => handleNumberChange('onlineShoppingCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 28. 報名參加路跑賽事次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                28. 報名路跑賽事 (次數)
              </label>
              <input
                type="number"
                min="0"
                value={formData.marathonEventsCount}
                onChange={(e) => handleNumberChange('marathonEventsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>

            {/* 29. 報名參加登山健行單車活動次數 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                29. 報名登山健行單車 (次數)
              </label>
              <input
                type="number"
                min="0"
                value={formData.outdoorEventsCount}
                onChange={(e) => handleNumberChange('outdoorEventsCount', e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        {/* Section 8: 使用那些運動 App */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              八、運動 App 生態偏好（第 30 項）
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">可多選</span>
          </div>

          <p className="text-[11px] text-slate-500">
            30. 請勾選您平日記錄運動時常用的運動 App：
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {APP_OPTIONS.map((app) => {
              const isChecked = formData.usedApps.includes(app);
              return (
                <button
                  key={app}
                  type="button"
                  onClick={() => handleToggleApp(app)}
                  className={`p-2.5 rounded-xl text-xs font-bold text-left transition flex items-center gap-2 border ${
                    isChecked
                      ? 'bg-lime-50 text-[#5ea31b] border-lime-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                      isChecked
                        ? 'bg-[#5ea31b] border-[#5ea31b] text-white'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate">{app}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>儲存成功！</strong> 已成功將 <strong>{formData.periodName}</strong> 運動特徵存入 Firestore 雲端資料庫。
              </span>
            </div>
            {onNavigateToAdvice && (
              <button
                type="button"
                onClick={onNavigateToAdvice}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shrink-0 transition"
              >
                看對比建議
              </button>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#5ea31b] to-lime-600 hover:from-[#528f17] hover:to-[#5ea31b] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-lg shadow-lime-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                正在寫入 Firestore 雲端資料庫...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                確認送出並存入 Firestore
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
