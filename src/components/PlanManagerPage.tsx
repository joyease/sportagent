import React, { useState, useEffect } from 'react';
import { UserPlan, UserRecord, ChallengeType } from '../types';
import { calculatePlanProgress } from '../utils/planCalc';
import {
  Target,
  PlusCircle,
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Activity,
  Scale,
  Edit2,
  Trash2,
  Award,
  Sparkles,
  Archive,
  Save,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlanManagerPageProps {
  plans: UserPlan[];
  records: Record<string, UserRecord>;
  onAddPlan: (plan: Omit<UserPlan, 'id' | 'createdAt'>) => void;
  onUpdatePlan: (plan: UserPlan) => void;
  onDeletePlan: (id: string) => void;
  initialTab?: 'create' | 'active' | 'completed';
}

export const PlanManagerPage: React.FC<PlanManagerPageProps> = ({
  plans,
  records,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  initialTab = 'active',
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'active' | 'completed'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Form states for creating new plan
  const [title, setTitle] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<ChallengeType[]>(['distance']);
  const [startMonth, setStartMonth] = useState('2026-06');
  const [endMonth, setEndMonth] = useState('2026-10');
  const [targetVal, setTargetVal] = useState('300');
  const [remark, setRemark] = useState('');

  // Edit Modal State
  const [editingPlan, setEditingPlan] = useState<UserPlan | null>(null);

  const handleToggleType = (type: ChallengeType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddPlan({
      title: title.trim(),
      challengeTypes: selectedTypes,
      startMonth,
      endMonth,
      target: parseFloat(targetVal) || 100,
      remark: remark.trim(),
      status: 'active',
    });

    // Reset Form & Switch to Active
    setTitle('');
    setRemark('');
    setActiveTab('active');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    onUpdatePlan(editingPlan);
    setEditingPlan(null);
  };

  const activePlans = plans.filter((p) => p.status === 'active');
  const completedPlans = plans.filter((p) => p.status === 'completed');

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-orange-500 text-white shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900">編輯個人挑戰目標</h1>
            <p className="text-[11px] text-slate-500">動態計算挑戰進度、達成率與目標追蹤</p>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex p-1 bg-slate-200/90 rounded-2xl gap-1 shadow-inner">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'active'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          進行中 ({activePlans.length})
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'create'
              ? 'bg-white text-[#5ea31b] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#5ea31b]" />
          創建新挑戰
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          已結束 ({completedPlans.length})
        </button>
      </div>

      {/* TAB (A): Create New Challenge Form - Dark Theme */}
      {activeTab === 'create' && (
        <div className="bg-slate-900 border border-slate-800 text-white p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white">建立新的自主挑戰目標</h2>
              <p className="text-[10px] text-slate-400">自訂挑戰期間、多維度數值目標與激勵心得</p>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                挑戰名稱 (Challenge Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如: 2026 年度萬卡減重挑戰班 / 秋季半馬備賽"
                className="w-full px-3 py-2.5 bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:bg-slate-800 focus:outline-none font-medium"
              />
            </div>

            {/* Multi-type checkboxes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1.5">
                選擇挑戰類型 (可多選)：
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'distance' as ChallengeType, label: '🏃 累積公里數 (KM)', icon: Activity },
                  { id: 'minutes' as ChallengeType, label: '⏱️ 累積分鐘數 (Min)', icon: Clock },
                  { id: 'calories' as ChallengeType, label: '🔥 累積卡路里 (Kcal)', icon: Flame },
                  { id: 'weight' as ChallengeType, label: '⚖️ 體重達標 (kg)', icon: Scale },
                ].map((item) => {
                  const isChecked = selectedTypes.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleToggleType(item.id)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 font-bold transition ${
                        isChecked
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-sm'
                          : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded text-amber-500 pointer-events-none accent-amber-500"
                      />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Duration Range (Start Month ~ End Month) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                挑戰期限 (開始年月 ~ 結束年月) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="month"
                  required
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 text-white rounded-xl font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <input
                  type="month"
                  required
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 text-white rounded-xl font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Target Value */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                挑戰目標數值 (Target Value) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={targetVal}
                onChange={(e) => setTargetVal(e.target.value)}
                placeholder="例如: 300 (公里/卡路里) 或 68.0 (體重)"
                className="w-full px-3 py-2.5 bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl font-extrabold focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                系統將自動累加該區間數據並追蹤進度
              </span>
            </div>

            {/* Remark */}
            <div>
              <label className="block text-[11px] font-bold text-slate-200 mb-1">
                挑戰備註說明 (選填)
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={2}
                placeholder="例如: 每週二四夜跑 5km，週末長距離，嚴格控制碳水..."
                className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-950/40 transition active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              確認創建挑戰
            </button>
          </form>
        </div>
      )}

      {/* TAB (B): Active Challenges List */}
      {activeTab === 'active' && (
        <div className="space-y-3">
          {activePlans.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Target className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">目前沒有進行中的挑戰</div>
              <p className="text-[11px] text-slate-400">
                點擊上方「➕ 創建新挑戰」設定您的專屬目標挑戰！
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-2 px-4 py-2 bg-[#5ea31b] text-white text-xs font-bold rounded-xl"
              >
                立即建立新挑戰
              </button>
            </div>
          ) : (
            activePlans.map((plan) => {
              const progress = calculatePlanProgress(plan, records);
              const isOver100 = progress.percentage >= 100;

              return (
                <div
                  key={plan.id}
                  className="bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-md space-y-3 relative overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded-lg bg-orange-500/20 text-[#ff6d00]">
                          <Flame className="w-3.5 h-3.5" />
                        </span>
                        <h3 className="font-extrabold text-sm text-white">{plan.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium mt-1">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {plan.startMonth} ~ {plan.endMonth}
                        </span>
                        <span>•</span>
                        <span className="text-slate-300">
                          {plan.challengeTypes.map((t) => {
                            if (t === 'distance') return '公里數';
                            if (t === 'calories') return '卡路里';
                            if (t === 'minutes') return '時間';
                            return '體態';
                          }).join(' / ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isOver100
                            ? 'bg-gradient-to-r from-emerald-400 to-lime-400'
                            : 'bg-gradient-to-r from-amber-400 to-[#ff6d00]'
                        }`}
                        style={{ width: `${Math.min(100, progress.percentage)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-300 font-medium">
                      <span>{progress.summaryText}</span>
                    </div>
                  </div>

                  {/* Remark note */}
                  {plan.remark && (
                    <div className="p-2.5 bg-slate-800/80 rounded-xl text-[11px] text-slate-200 border border-slate-700/60">
                      💡 <strong>備註：</strong>{plan.remark}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg flex items-center gap-1 transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      編輯挑戰
                    </button>

                    <button
                      onClick={() => {
                        onUpdatePlan({ ...plan, status: 'completed' });
                        confetti({ particleCount: 60, spread: 60 });
                      }}
                      className="px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold rounded-lg flex items-center gap-1 transition"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      標記完成
                    </button>

                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition"
                      title="刪除挑戰"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB (C): Completed Challenges */}
      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completedPlans.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Archive className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">目前沒有已結束的挑戰</div>
              <p className="text-[11px] text-slate-400">
                完成進行中挑戰後，將在此封存供隨時回顧成果！
              </p>
            </div>
          ) : (
            completedPlans.map((plan) => {
              const progress = calculatePlanProgress(plan, records);

              return (
                <div
                  key={plan.id}
                  className="bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Award className="w-4 h-4" />
                      </span>
                      <div>
                        <h3 className="font-bold text-xs text-slate-300 line-through">
                          {plan.title}
                        </h3>
                        <span className="text-[10px] text-slate-400">
                          {plan.startMonth} ~ {plan.endMonth}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
                      已結案 ({progress.percentage}%)
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300">
                    🏆 <strong>結案總結：</strong> {progress.summaryText}
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800 text-xs">
                    <button
                      onClick={() => onUpdatePlan({ ...plan, status: 'active' })}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-[11px] border border-slate-700"
                    >
                      重新啟動此挑戰
                    </button>
                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="p-1 text-slate-400 hover:text-red-400 rounded-lg"
                      title="刪除挑戰"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-orange-500" />
                編輯挑戰
              </h3>
              <button
                onClick={() => setEditingPlan(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">挑戰名稱</label>
                <input
                  type="text"
                  required
                  value={editingPlan.title}
                  onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">挑戰目標數值</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingPlan.target}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, target: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">備註說明</label>
                <textarea
                  value={editingPlan.remark || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, remark: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#ff6d00] hover:bg-[#e05f00] text-white font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  儲存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
