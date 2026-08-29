import { UserPlan, UserRecord } from '../types';

export interface PlanProgressResult {
  currentVal: number;
  targetVal: number;
  percentage: number;
  unit: string;
  isCompleted: boolean;
  summaryText: string;
}

export function calculatePlanProgress(plan: UserPlan, records: Record<string, UserRecord>): PlanProgressResult {
  const matchingRecords = Object.values(records)
    .filter((r) => r.month >= plan.startMonth && r.month <= plan.endMonth)
    .sort((a, b) => a.month.localeCompare(b.month));

  let currentVal = 0;
  let unit = '公里 (km)';
  const targetVal = plan.target;

  if (plan.challengeTypes.includes('weight')) {
    unit = '公斤 (kg)';
    if (matchingRecords.length === 0) {
      return {
        currentVal: 0,
        targetVal,
        percentage: 0,
        unit,
        isCompleted: false,
        summaryText: '尚無此區間之體重記錄',
      };
    }
    const latestWeight = matchingRecords[matchingRecords.length - 1].weight;
    const initialWeight = matchingRecords[0].weight;
    currentVal = latestWeight;

    // Weight reduction logic
    let percentage = 0;
    if (latestWeight <= targetVal) {
      percentage = 100;
    } else if (initialWeight > targetVal) {
      const neededDrop = initialWeight - targetVal;
      const actualDrop = initialWeight - latestWeight;
      percentage = Math.max(0, Math.min(100, Math.round((actualDrop / neededDrop) * 100)));
    } else {
      percentage = 50;
    }

    const isCompleted = latestWeight <= targetVal;
    return {
      currentVal: Math.round(latestWeight * 10) / 10,
      targetVal,
      percentage,
      unit,
      isCompleted,
      summaryText: `目前體重 ${latestWeight}kg，目標 ${targetVal}kg (達成率 ${percentage}%)`,
    };
  }

  // Aggregate metrics
  if (plan.challengeTypes.includes('distance')) {
    unit = '公里 (km)';
    currentVal = matchingRecords.reduce((sum, r) => sum + (r.distance || 0), 0);
  } else if (plan.challengeTypes.includes('minutes')) {
    unit = '分鐘 (min)';
    currentVal = matchingRecords.reduce((sum, r) => sum + (r.minutes || 0), 0);
  } else if (plan.challengeTypes.includes('calories')) {
    unit = '大卡 (kcal)';
    currentVal = matchingRecords.reduce((sum, r) => sum + (r.calories || 0), 0);
  } else {
    currentVal = matchingRecords.reduce((sum, r) => sum + (r.distance || 0), 0);
  }

  currentVal = Math.round(currentVal * 10) / 10;
  const percentage = targetVal > 0 ? Math.min(100, Math.round((currentVal / targetVal) * 100)) : 0;
  const isCompleted = currentVal >= targetVal;

  return {
    currentVal,
    targetVal,
    percentage,
    unit,
    isCompleted,
    summaryText: `已累積 ${currentVal.toLocaleString()} ${unit} / 目標 ${targetVal.toLocaleString()} ${unit} (達成率 ${percentage}%)`,
  };
}
