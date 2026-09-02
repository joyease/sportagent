import { SurveyRecord } from '../types';
import {
  TrendingUp,
  Activity,
  Scale,
  Flame,
  ShieldCheck,
  Trophy,
  Calendar,
  Compass,
  Zap,
} from 'lucide-react';

/**
 * ==============================================================================
 * 智慧運動處方決策規則引擎 (Decision Rules Engine)
 * ==============================================================================
 * 
 * 💡 說明：此檔案為系統生成「個人化運動處方」與「健康決策建議」的核心決策邏輯與文本庫。
 * 您可以直接在此修改：
 *   1. 處方觸發條件（決策門檻值，例如：跑量成長率、BMI 區間、平日/假日次數比等）
 *   2. 建議內容與文案範本（心肺、減脂、防護、賽事備戰、旅遊漫遊、App 生態等）
 *   3. 處方的標籤（tag）、代表色彩（color）與圖示
 * 
 * ==============================================================================
 */

export interface PrescriptionItem {
  id: string;
  title: string;
  tag: string;
  color: 'emerald' | 'amber' | 'purple' | 'sky' | 'lime' | 'orange' | 'rose' | 'indigo';
  icon: any;
  category: 'cardio' | 'weight' | 'schedule' | 'safety' | 'event_lifestyle';
  ruleTrigger: string; // 觸發此處方的決策規則說明
  content: string;
}

export interface ComparisonDiffs {
  countDiff: number;
  countRate: number;
  walkingKmDiff: number;
  runningKmDiff: number;
  cyclingKmDiff: number;
  totalDistanceA: number;
  totalDistanceB: number;
  distanceDiff: number;
  distanceRate: number;
  totalCaloriesA: number;
  totalCaloriesB: number;
  caloriesDiff: number;
  caloriesRate: number;
  weightDiff: number;
  bmiA: number;
  bmiB: number;
  weekdayRatioB: number;
}

/**
 * 計算兩期特徵之數學差異與增減率
 */
export function calculateSurveyDiffs(recordA: SurveyRecord, recordB: SurveyRecord): ComparisonDiffs {
  const distA =
    (recordA.walkingKm || 0) + (recordA.runningKm || 0) + (recordA.cyclingKm || 0) ||
    recordA.totalDistance ||
    0;
  const distB =
    (recordB.walkingKm || 0) + (recordB.runningKm || 0) + (recordB.cyclingKm || 0) ||
    recordB.totalDistance ||
    0;
  const distDiff = distB - distA;
  const distRate = distA > 0 ? (distDiff / distA) * 100 : 0;

  const calA = recordA.dailyStepsCalories || recordA.totalCalories || 0;
  const calB = recordB.dailyStepsCalories || recordB.totalCalories || 0;
  const calDiff = calB - calA;
  const calRate = calA > 0 ? (calDiff / calA) * 100 : 0;

  const countA = recordA.totalRecordsCount || 0;
  const countB = recordB.totalRecordsCount || 0;
  const countDiff = countB - countA;
  const countRate = countA > 0 ? (countDiff / countA) * 100 : 0;

  const bmiA =
    recordA.height > 0 && recordA.weight > 0
      ? recordA.weight / Math.pow(recordA.height / 100, 2)
      : 0;
  const bmiB =
    recordB.height > 0 && recordB.weight > 0
      ? recordB.weight / Math.pow(recordB.height / 100, 2)
      : 0;

  const totalDays = (recordB.weekdayCount || 0) + (recordB.weekendCount || 0);
  const weekdayRatioB = totalDays > 0 ? ((recordB.weekdayCount || 0) / totalDays) * 100 : 50;

  return {
    countDiff,
    countRate,
    walkingKmDiff: (recordB.walkingKm || 0) - (recordA.walkingKm || 0),
    runningKmDiff: (recordB.runningKm || 0) - (recordA.runningKm || 0),
    cyclingKmDiff: (recordB.cyclingKm || 0) - (recordA.cyclingKm || 0),
    totalDistanceA: distA,
    totalDistanceB: distB,
    distanceDiff: distDiff,
    distanceRate: distRate,
    totalCaloriesA: calA,
    totalCaloriesB: calB,
    caloriesDiff: calDiff,
    caloriesRate: calRate,
    weightDiff: recordB.weight - recordA.weight,
    bmiA,
    bmiB,
    weekdayRatioB,
  };
}

/**
 * 決策規則庫：依據特徵數據生成專屬處方
 */
export function generateSmartPrescriptions(
  recordA: SurveyRecord,
  recordB: SurveyRecord
): PrescriptionItem[] {
  const diffs = calculateSurveyDiffs(recordA, recordB);
  const list: PrescriptionItem[] = [];

  // ----------------------------------------------------------------------------
  // 規則 1：心肺與耐力進階處方 (Cardiovascular & Endurance)
  // 決策條件：若總里程成長 > 0% 或跑步/騎行顯著增加，給予進階耐力課表；否則給予穩健維持建議。
  // ----------------------------------------------------------------------------
  if (diffs.distanceDiff > 0) {
    list.push({
      id: 'rule-cardio-progress',
      category: 'cardio',
      title: '心肺與跑量進階處方',
      tag: '耐力提升',
      color: 'emerald',
      icon: TrendingUp,
      ruleTrigger: `決策規則：總運動距離成長 (+${diffs.distanceRate.toFixed(1)}%)`,
      content: `恭喜！${recordB.periodName} 總運動距離達 ${diffs.totalDistanceB.toFixed(
        1
      )} km（跑步 ${recordB.runningKm || 0} km、騎行 ${recordB.cyclingKm || 0} km、健走 ${
        recordB.walkingKm || 0
      } km），比基準期顯著增長 ${diffs.distanceRate.toFixed(
        1
      )}%。建議下個階段每週安排 1 次漸進式長距離耐力跑（LSD 8-12km），配速控制在最大心率 65-75%，讓有氧心肺基礎更加穩固。`,
    });
  } else {
    list.push({
      id: 'rule-cardio-maintain',
      category: 'cardio',
      title: '運動量維持與課表規劃',
      tag: '穩定維持',
      color: 'amber',
      icon: Activity,
      ruleTrigger: '決策規則：總運動距離持平或略微調降',
      content: `目前運動總量為 ${diffs.totalDistanceB.toFixed(
        1
      )} km，建議每週固定鎖定 3 個運動日（如二、四、六），每次維持 30-45 分鐘中等強度運動，並可結合室內運動（目前每期約 ${
        recordB.indoorMinutes || 0
      } 分鐘），避免因天候或忙碌中斷訓練習慣。`,
    });
  }

  // ----------------------------------------------------------------------------
  // 規則 2：體態雕塑與熱量代謝管理 (Weight & Calorie Management)
  // 決策條件：若體重下降給予減脂增肌補給建議；若體重上升或持平給予基礎代謝與 HIIT 處方。
  // ----------------------------------------------------------------------------
  if (diffs.weightDiff < 0) {
    list.push({
      id: 'rule-weight-loss',
      category: 'weight',
      title: '體態雕塑與減脂處方',
      tag: '體態優化',
      color: 'purple',
      icon: Scale,
      ruleTrigger: `決策規則：體重減輕 (${diffs.weightDiff.toFixed(1)} kg，BMI: ${diffs.bmiB.toFixed(1)})`,
      content: `體重從 ${recordA.weight} kg 成功降至 ${recordB.weight} kg（減輕 ${Math.abs(
        diffs.weightDiff
      ).toFixed(1)} kg，BMI 降為 ${diffs.bmiB.toFixed(
        1
      )}）。每日步數大卡累積約 ${recordB.dailyStepsCalories} kcal，燃脂效率優異！建議運動後 30 分鐘內補充優質蛋白質（如無糖豆漿、水煮蛋、雞胸肉），有效維持骨骼肌量。`,
    });
  } else {
    list.push({
      id: 'rule-weight-metabolism',
      category: 'weight',
      title: '代謝提升與能量平衡處方',
      tag: '熱量管理',
      color: 'sky',
      icon: Flame,
      ruleTrigger: `決策規則：體重維持或微幅波動 (BMI: ${diffs.bmiB.toFixed(1)})`,
      content: `目前體重維持在 ${recordB.weight} kg（BMI: ${diffs.bmiB.toFixed(
        1
      )}）。若想進一步優化體態線條，建議每週加入 2 次高強度間歇訓練（HIIT 或間歇跑 20 分鐘），可有效啟動運動後後燃效應（EPOC），提升全日基礎代謝率。`,
    });
  }

  // ----------------------------------------------------------------------------
  // 規則 3：運動時段與生活節奏平衡 (Workout Schedule & Timing)
  // 決策條件：判斷平日 vs 假日運動分佈比例，提供規律性課表指引。
  // ----------------------------------------------------------------------------
  const isWeekendWarrior = (recordB.weekendCount || 0) > (recordB.weekdayCount || 0) * 1.5;
  if (isWeekendWarrior) {
    list.push({
      id: 'rule-schedule-weekend',
      category: 'schedule',
      title: '週間微運動與假日動態平衡處方',
      tag: '時段平衡',
      color: 'indigo',
      icon: Calendar,
      ruleTrigger: `決策規則：假日運動次數 (${recordB.weekendCount} 次) 明顯高於平日 (${recordB.weekdayCount} 次)`,
      content: `您的運動大多集中在假日（${recordB.weekendCount} 次），平日為 ${recordB.weekdayCount} 次。假日進行長距離戶外運動非常棒，但建議週一至週五也能安排 2-3 次 15-20 分鐘的快走或晨間微運動，維持心血管活躍度並避免假日運動後過度疲憊。`,
    });
  } else {
    list.push({
      id: 'rule-schedule-balanced',
      category: 'schedule',
      title: '全週規律運動節奏處方',
      tag: '節奏優異',
      color: 'lime',
      icon: Calendar,
      ruleTrigger: `決策規則：平日 (${recordB.weekdayCount} 次) 與假日 (${recordB.weekendCount} 次) 運動分佈均衡`,
      content: `您的平日運動（${recordB.weekdayCount} 次）與假日運動（${recordB.weekendCount} 次）分配十分均衡，運動已內化為生活習慣！建議在連續運動 2 天後安排 1 天動態恢復（如伸展瑜伽、輕鬆散步），有助於神經肌肉修復。`,
    });
  }

  // ----------------------------------------------------------------------------
  // 規則 4：關節防護與交叉訓練 (Injury Prevention & Cross-training)
  // 決策條件：根據參加運動種類（單一/2種/3種以上）與年齡層給予防護指導。
  // ----------------------------------------------------------------------------
  const isSingleSport = recordB.sportsTypeCount === '單一';
  list.push({
    id: 'rule-safety-cross-training',
    category: 'safety',
    title: '關節防護與交叉訓練建議',
    tag: '運動防護',
    color: 'emerald',
    icon: ShieldCheck,
    ruleTrigger: `決策規則：運動種類「${recordB.sportsTypeCount}」（跑步 ${recordB.runningCount || 0} 次、單車 ${recordB.cyclingCount || 0} 次、健走 ${recordB.walkingCount || 0} 次）`,
    content: isSingleSport
      ? `目前主要以單一運動為主（跑步 ${recordB.runningCount || 0} 次）。建議適度加入自行車或游泳等無衝擊性交叉訓練，並每週進行 1-2 次深蹲與核心肌群訓練，可大幅降低髂脛束摩擦症候群（ITBS）與足底筋膜炎風險。`
      : `您參與了多種運動（${recordB.sportsTypeCount}：包含跑步、健走、單車與室內運動），多元運動能有效平衡不同肌群負荷。建議運動後確實進行下肢與背部靜態伸展 15 分鐘，搭配穿戴裝置（${recordB.wearableDevice || '智慧手錶'}）監測靜止心率與睡眠修復品質。`,
  });

  // ----------------------------------------------------------------------------
  // 規則 5：賽事活動與運動旅遊/生態系處方 (Events, Travel & Ecosystem)
  // 決策條件：檢查馬拉松賽事報名 (Y/N)、跨縣市/海外運動、生態系與 App 使用行為。
  // ----------------------------------------------------------------------------
  const isMarathonParticipant = recordB.marathonEvent === 'Y';
  const hasTravelOrOverseas = recordB.crossCity === 'Y' || recordB.overseasRegion !== '無';
  const sportsAppsList = (recordB.sportsApps && recordB.sportsApps.length > 0) ? recordB.sportsApps : ['Strava APP'];

  if (isMarathonParticipant || hasTravelOrOverseas) {
    list.push({
      id: 'rule-event-travel',
      category: 'event_lifestyle',
      title: '賽事備戰與運動旅遊指南',
      tag: '賽事旅遊',
      color: 'orange',
      icon: Trophy,
      ruleTrigger: `決策規則：馬拉松賽事 (${recordB.marathonEvent})、跨縣市 (${recordB.crossCity})、海外運動 (${recordB.overseasRegion})`,
      content: `您在 ${recordB.periodName} 有馬拉松賽事備戰或跨縣市／海外旅遊運動規劃（主要運動縣市：${recordB.primaryCity}，海外：${recordB.overseasRegion}，出國漫遊：${recordB.roamingAbroad}）。建議賽前 4-6 週定期進行比賽配速跑，並善用運動 App（${sportsAppsList.join('、')}）記錄海拔與心率區間，旅途中補充水分與電解質，享受動態運動新視野！`,
    });
  }

  return list;
}
