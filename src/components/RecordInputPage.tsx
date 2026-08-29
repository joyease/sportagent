import React, { useState, useEffect } from 'react';
import { UserRecord } from '../types';
import {
  Edit3,
  Calendar,
  Activity,
  Flame,
  Clock,
  Scale,
  Save,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecordInputPageProps {
  records: Record<string, UserRecord>;
  onSaveRecord: (record: UserRecord) => void;
  onNavigateToBadges: () => void;
}

export const RecordInputPage: React.FC<RecordInputPageProps> = ({
  records,
  onSaveRecord,
  onNavigateToBadges,
}) => {
  const [month, setMonth] = useState('2026-08');
  const [distance, setDistance] = useState('124.0');
  const [minutes, setMinutes] = useState('1180');
  const [calories, setCalories] = useState('12200');
  const [weight, setWeight] = useState('69.4');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // When month changes, pre-fill with existing data if available
  useEffect(() => {
    if (records[month]) {
      const rec = records[month];
      setDistance(String(rec.distance));
      setMinutes(String(rec.minutes));
      setCalories(String(rec.calories));
      setWeight(String(rec.weight));
      setNotes(rec.notes || '');
    } else {
      // Find latest previous record to suggest starting weight
      const allSorted: UserRecord[] = (Object.values(records) as UserRecord[]).sort((a, b) =>
        a.month.localeCompare(b.month)
      );
      const lastWeight = allSorted.length > 0 ? allSorted[allSorted.length - 1].weight : 70.0;
      setDistance('0');
      setMinutes('0');
      setCalories('0');
      setWeight(String(lastWeight));
      setNotes('');
    }
  }, [month, records]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dNum = parseFloat(distance) || 0;
    const mNum = parseInt(minutes, 10) || 0;
    const cNum = parseInt(calories, 10) || 0;
    const wNum = parseFloat(weight) || 0;

    const newRecord: UserRecord = {
      month,
      distance: Math.round(dNum * 10) / 10,
      minutes: mNum,
      calories: cNum,
      weight: Math.round(wNum * 10) / 10,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    onSaveRecord(newRecord);
    setSavedSuccess(true);

    // Trigger celebration if key milestones met
    if (dNum >= 100 || cNum >= 10000 || wNum <= 70) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleQuickAdd = (addKm: number, addMin: number, addCal: number) => {
    const curD = parseFloat(distance) || 0;
    const curM = parseInt(minutes, 10) || 0;
    const curC = parseInt(calories, 10) || 0;

    setDistance((curD + addKm).toFixed(1));
    setMinutes(String(curM + addMin));
    setCalories(String(curC + addCal));
  };

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#5ea31b] text-white shadow-sm">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900">輸入每月運動紀錄</h1>
            <p className="text-[11px] text-slate-500">覆蓋寫入每月里程、熱量、時間與體態數據</p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <div className="text-xs font-bold">{month} 數據儲存成功 (覆蓋更新)！</div>
              <div className="text-[10px] text-emerald-100">徽章與圖表已同步重新計算</div>
            </div>
          </div>
          <button
            onClick={onNavigateToBadges}
            className="px-3 py-1 bg-white text-emerald-800 rounded-lg text-xs font-bold shadow-sm"
          >
            看徽章 ➔
          </button>
        </div>
      )}

      {/* Main Form - Dark High-Contrast Theme */}
      <form onSubmit={handleSubmit} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4 text-white">
        {/* Month Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-lime-400" />
            記錄月份 (YYYY-MM)
          </label>
          <div className="flex gap-2">
            <input
              type="month"
              required
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold bg-slate-800/90 border border-slate-700 text-white rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
            />
            <button
              type="button"
              onClick={() => setMonth('2026-08')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 shrink-0 transition"
            >
              設為當月
            </button>
          </div>
        </div>

        {/* 4 Numeric inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              累積公里數 (KM)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              required
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="例如: 120.5"
              className="w-full px-3 py-2 text-sm font-extrabold bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:ring-2 focus:ring-lime-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#ff7d1a]" />
              累積卡路里 (Kcal)
            </label>
            <input
              type="number"
              min="0"
              required
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="例如: 10500"
              className="w-full px-3 py-2 text-sm font-extrabold bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              累積運動分鐘 (Min)
            </label>
            <input
              type="number"
              min="0"
              required
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="例如: 1020"
              className="w-full px-3 py-2 text-sm font-extrabold bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              本月記錄體重 (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="30"
              max="200"
              required
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="例如: 69.5"
              className="w-full px-3 py-2 text-sm font-extrabold bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Add buttons for easy day-to-day increment */}
        <div className="p-3 bg-slate-800/70 rounded-xl border border-slate-700/80">
          <div className="text-[11px] font-bold text-lime-400 mb-1.5 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-lime-400" />
            快速單次運動累加捷徑：
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleQuickAdd(5, 30, 320)}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-200 font-bold text-[10px] text-center transition"
            >
              🏃 晨跑 +5km<br /><span className="text-slate-400">(+30分 / +320卡)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(10, 60, 650)}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-200 font-bold text-[10px] text-center transition"
            >
              🚴 騎車 +10km<br /><span className="text-slate-400">(+60分 / +650卡)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(21, 120, 1400)}
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-200 font-bold text-[10px] text-center transition"
            >
              🏅 半馬 +21km<br /><span className="text-slate-400">(+120分 / +1400卡)</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-200 mb-1">
            運動備註與體態心得 (選填)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="例如: 週末參加河濱 10K 跑，體力恢復良好..."
            className="w-full px-3 py-2 text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-lime-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5ea31b] to-[#70b828] hover:from-[#528f17] hover:to-[#5ea31b] text-white font-bold text-sm shadow-lg shadow-lime-950/40 flex items-center justify-center gap-2 transition active:scale-[0.99]"
        >
          <Save className="w-4 h-4" />
          儲存並送出
        </button>
      </form>
    </div>
  );
};
