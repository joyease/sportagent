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
  period: string; // '2025H2' | '2026H1' | string
  periodName: string; // '2025下半年' | '2026上半年' | string
  email?: string;
  nickname?: string;
  updatedAt?: string;

  // 1. 性別: '男' | '女'
  gender: string;
  // 2. 年齡: '29以下' | '30-49' | '50 到69' | '70以上'
  ageGroup: string;
  // 3. 體重 (kg)
  weight: number;
  // 4. 身高 (cm)
  height: number;
  // 5. 總計運動記錄次數
  totalRecordsCount: number;
  // 6. 總計運動步數
  totalSteps: number;
  // 7. 無軌跡運動次數
  noGpsCount: number;
  // 8. 有軌跡運動次數
  gpsCount: number;
  // 9. 主要縣市運動次數
  mainCityCount: number;
  // 10. 其他縣市運動次數
  otherCityCount: number;
  // 11. 國外運動次數
  abroadCount: number;
  // 12. 跑步運動次數
  runningCount: number;
  // 13. 登山運動次數
  hikingCount: number;
  // 14. 步行運動次數
  walkingCount: number;
  // 15. 自行車運動次數
  cyclingCount: number;
  // 16. 總計運動距離 (km)
  totalDistance: number;
  // 17. 總計運動卡路里 (kcal)
  totalCalories: number;
  // 18. 總計運動時間 (分鐘)
  totalMinutes: number;
  // 19. 運動頻率: '每天運動' | '每周3-5次' | '每周1-2次' | '更少'
  frequency: string;
  // 20. 較強的運動頻率: '每天運動' | '每周3-5次' | '每周1-2次' | '更少'
  intenseFrequency: string;
  // 21. 較強的運動距離: '每次1 ~3公里' | '每次3-5公里' | '每次5-10公里' | '每次10-20公里' | '每次20公里以上'
  intenseDistance: string;
  // 22. 較強的運動強度: '時速3公里以下' | '時速3-5公里' | '時速5-10公里' | '時速10公里以上'
  intenseSpeed: string;
  // 23. 國內住宿旅遊次數 (半年內)
  domesticTrips: number;
  // 24. 國內旅遊會運動記錄軌跡嗎: '每次都會' | '偶爾會' | '不會'
  domesticTrackGps: string;
  // 25. 國外住宿旅遊次數 (半年內)
  abroadTrips: number;
  // 26. 國外旅遊會運動記錄軌跡嗎: '每次都會' | '偶爾會' | '不會'
  abroadTrackGps: string;
  // 27. 網路購買運動商品次數
  onlineShoppingCount: number;
  // 28. 報名參加路跑賽事次數
  marathonEventsCount: number;
  // 29. 報名參加登山健行單車活動次數
  outdoorEventsCount: number;
  // 30. 使用那些運動App (多選)
  usedApps: string[];
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
