import { UserRecord, BadgeItem } from '../types';

export const BADGE_DEFINITIONS: BadgeItem[] = [
  {
    id: 'badge-km',
    title: '🥇 百里跑者',
    icon: 'Award',
    rule: '當月運動里程突破 100 KM',
    color: 'from-amber-400 to-yellow-500 text-amber-950',
    accentBg: 'bg-amber-100 border-amber-300 text-amber-800',
    check: (rec) => !!rec && rec.distance > 100,
    progressText: (rec) => (rec ? `${rec.distance.toFixed(1)} / 100 km (${Math.min(100, Math.round((rec.distance / 100) * 100))}%)` : '0 / 100 km'),
  },
  {
    id: 'badge-cal',
    title: '🔥 萬卡燃燒',
    icon: 'Flame',
    rule: '當月消耗熱量突破 10,000 大卡',
    color: 'from-orange-500 to-red-500 text-white',
    accentBg: 'bg-orange-100 border-orange-300 text-orange-800',
    check: (rec) => !!rec && rec.calories > 10000,
    progressText: (rec) => (rec ? `${rec.calories.toLocaleString()} / 10,000 kcal (${Math.min(100, Math.round((rec.calories / 10000) * 100))}%)` : '0 / 10,000 kcal'),
  },
  {
    id: 'badge-min',
    title: '⏱️ 千分耐力',
    icon: 'Timer',
    rule: '當月累積運動時長突破 1,000 分鐘',
    color: 'from-emerald-500 to-teal-600 text-white',
    accentBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    check: (rec) => !!rec && rec.minutes > 1000,
    progressText: (rec) => (rec ? `${rec.minutes} / 1,000 分鐘 (${Math.min(100, Math.round((rec.minutes / 1000) * 100))}%)` : '0 / 1,000 分鐘'),
  },
  {
    id: 'badge-weight',
    title: '⚖️ 體重達標',
    icon: 'Scale',
    rule: '當月紀錄體態維持在 70.0 KG 以下',
    color: 'from-blue-500 to-indigo-600 text-white',
    accentBg: 'bg-blue-100 border-blue-300 text-blue-800',
    check: (rec) => !!rec && rec.weight > 0 && rec.weight <= 70.0,
    progressText: (rec) => (rec ? `目前: ${rec.weight} kg (目標 ≦ 70kg)` : '未記錄'),
  },
  {
    id: 'badge-triathlete',
    title: '👑 全能鐵人',
    icon: 'Sparkles',
    rule: '當月同時解鎖跑者、燃燒與耐力三大指標',
    color: 'from-purple-500 to-pink-600 text-white',
    accentBg: 'bg-purple-100 border-purple-300 text-purple-800',
    check: (rec) => !!rec && rec.distance > 100 && rec.calories > 10000 && rec.minutes > 1000,
    progressText: (rec) => (rec && rec.distance > 100 && rec.calories > 10000 && rec.minutes > 1000 ? '三項達標！' : '尚未達成三冠'),
  },
  {
    id: 'badge-cumulative',
    title: '🚀 榮譽三萬米',
    icon: 'Zap',
    rule: '歷史累計運動里程超過 300 KM',
    color: 'from-lime-500 to-emerald-600 text-white',
    accentBg: 'bg-lime-100 border-lime-300 text-lime-800',
    check: (_, all) => {
      const sum = (all || []).reduce((acc, r) => acc + (r?.distance || 0), 0);
      return sum >= 300;
    },
    progressText: (_, all) => {
      const sum = (all || []).reduce((acc, r) => acc + (r?.distance || 0), 0);
      return `總累積: ${sum.toFixed(1)} / 300 km (${Math.min(100, Math.round((sum / 300) * 100))}%)`;
    },
  },
];
