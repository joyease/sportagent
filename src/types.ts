export interface UserRecord {
  month: string; // YYYY-MM
  distance: number; // km
  minutes: number; // min
  calories: number; // kcal
  weight: number; // kg
  updatedAt?: string;
  notes?: string;
}

export interface SurveyRecord {
  // 基本識別
  nickname: string;
  period: string; // '2025H2' | '2026H1' | '2026H2'
  periodName: string; // '2025下半年' | '2026上半年' | '2026下半年'
  userId?: string;
  email: string;
  updatedAt?: string;

  // 裝置與個人基本特徵
  osType: string; // 'iOS' | 'Android' | '其他'
  wearableDevice: string; // 'garmin' | 'apple watch' | 'others' | '無'
  gender: string; // '男' | '女'
  ageGroup: string; // '29以下' | '30-49' | '50 到69' | '70以上'
  height: number; // 身高 (cm)
  weight: number; // 體重 (kg)

  // 運動種類與次數
  sportsTypeCount: string; // '單一' | '2種' | '3種以上'
  totalRecordsCount: number; // 運動紀錄總次數
  walkingCount: number; // 健走次數
  runningCount: number; // 跑步次數
  cyclingCount: number; // 單車次數
  dailyStepsCount: number; // 每日步數次數
  dailyStepsCalories: number; // 每日步數大卡

  // 累積運動距離長度
  walkingKm: number; // 健走(km)
  runningKm: number; // 跑步(km)
  cyclingKm: number; // 騎行(km)
  indoorMinutes: number; // 室內運動(分鐘)
  otherMinutes: number; // 其它運動(分鐘)

  // 運動時段
  weekdayCount: number; // 平日(次數)
  weekendCount: number; // 假日+週末 (次數)

  // 運動地點
  primaryCity: string; // 經常運動縣巿1st
  crossCity: string; // 跨縣市運動: 'Y' | 'N'
  overseasRegion: string; // 海外運動: '日本' | '東南亞' | '歐美' | '港澳/大陸' | '無'

  // 馬拉松賽事活動
  marathonEvent: string; // 馬拉松賽事: 'Y' | 'N'

  // 生態系與 App 使用行為
  roamingAbroad: string; // 出國漫遊: 'Y' | 'N'
  travelWebsite: string; // 旅遊網站: 'Y' | 'N'
  weatherWebsite: string; // 氣象網站: 'Y' | 'N'
  momoShopping: string; // MOMO網站: 'Y' | 'N'

  // Used Multimedia App
  multimediaApps: string[]; // ['MyVideo', 'Netflix/Disney+/HBO', 'KKBox', 'Spotify']

  // Used Sports APP
  sportsApps: string[]; // ['NikeRunC', 'Mi運動', '運動筆記', 'Strava APP', 'Garmin Connect', 'mySports', 'Apple 健身/健康']

  // 兼容與統計運算輔助欄位
  totalDistance?: number;
  totalCalories?: number;
  totalMinutes?: number;
  totalSteps?: number;
  hikingCount?: number;
  usedApps?: string[];
  noGpsCount?: number;
  gpsCount?: number;
  mainCityCount?: number;
  otherCityCount?: number;
  abroadCount?: number;
  frequency?: string;
  intenseFrequency?: string;
  intenseDistance?: string;
  intenseSpeed?: string;
  domesticTrips?: number;
  domesticTrackGps?: string;
  abroadTrips?: number;
  abroadTrackGps?: string;
  onlineShoppingCount?: number;
  marathonEventsCount?: number;
  outdoorEventsCount?: number;
}

export type ChallengeType = 'distance' | 'minutes' | 'calories' | 'weight';

export interface UserPlan {
  id: string;
  title: string;
  target: number;
  startMonth: string; // YYYY-MM
  endMonth: string; // YYYY-MM
  remark?: string;
  challengeTypes: ChallengeType[];
  status: 'active' | 'completed';
  createdAt: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  rule: string;
  color: string;
  accentBg: string;
  check: (record: UserRecord | undefined, allRecords: UserRecord[]) => boolean;
  progressText: (record: UserRecord | undefined, allRecords: UserRecord[]) => string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  conditionText: string;
  relativeHumidity?: number;
  isComfortable: boolean;
  exerciseIndex: string;
}

export interface SpotDetail {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface SportsSpotEntry {
  latitude: number;
  longitude: number;
  description?: string;
  spots?: (string | SpotDetail)[];
}

export interface PromoDeal {
  id: string;
  title: string;
  tag?: string;
  discount?: string;
  category: 'shopping' | 'travel' | 'telecom' | 'music' | string;
  url: string;
  imageColor?: string;
  icon?: string;
  description: string;
}

export interface InteractiveChallenge {
  id: string;
  title: string;
  platform: string;
  participants: number;
  reward: string;
  url: string;
  icon: string;
  badgeTag: string;
  description: string;
}

export interface EventNews {
  id: string;
  title: string;
  date: string;
  location: string;
  category: 'light_tw' | 'badge_challenge' | 'marathon' | 'cycling' | 'policy';
  url: string;
  highlight: string;
  description: string;
}

export interface CheckInPost {
  id: string;
  uid: string;
  nickname: string;
  email: string;
  message: string;
  gps?: {
    lat?: number;
    lng?: number;
    accuracy?: number;
    locationName?: string;
  };
  createdAt: string;
}
