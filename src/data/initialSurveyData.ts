import { SurveyRecord } from '../types';

export const INITIAL_SURVEY_RECORDS: Record<string, SurveyRecord> = {
  '2025H2': {
    nickname: 'hermann',
    period: '2025H2',
    periodName: '2025下半年',
    email: 'hermann@trip.com',
    userId: '88392',
    updatedAt: '2025-12-31T20:00:00.000Z',

    // 裝置與基本資料
    osType: 'iOS',
    wearableDevice: 'garmin',
    gender: '男',
    ageGroup: '50 到69',
    height: 173,
    weight: 72.5,

    // 運動種類與次數
    sportsTypeCount: '3種以上',
    totalRecordsCount: 78,
    walkingCount: 18,
    runningCount: 42,
    cyclingCount: 12,
    dailyStepsCount: 160,
    dailyStepsCalories: 58000,

    // 累積運動距離長度
    walkingKm: 75,
    runningKm: 340,
    cyclingKm: 125,
    indoorMinutes: 480,
    otherMinutes: 240,

    // 運動時段
    weekdayCount: 22,
    weekendCount: 14,

    // 運動地點
    primaryCity: '台北市',
    crossCity: 'Y',
    overseasRegion: '日本',

    // 馬拉松賽事活動
    marathonEvent: 'Y',

    // 生態系與 App 使用行為
    roamingAbroad: 'Y',
    travelWebsite: 'Y',
    weatherWebsite: 'Y',
    momoShopping: 'Y',

    // Used Multimedia App
    multimediaApps: ['MyVideo', 'Netflix/Disney+/HBO', 'Spotify'],

    // Used Sports APP
    sportsApps: ['NikeRunC', 'Strava APP', 'Garmin Connect', 'mySports'],

    // 統計運算兼容欄位
    totalDistance: 540,
    totalCalories: 58000,
    totalMinutes: 4200,
    totalSteps: 865000,
    hikingCount: 12,
    usedApps: ['NikeRunC', 'Strava APP', 'Garmin Connect', 'mySports'],
  },
  '2026H1': {
    nickname: 'hermann',
    period: '2026H1',
    periodName: '2026上半年',
    email: 'hermann@trip.com',
    userId: '88392',
    updatedAt: '2026-06-30T22:00:00.000Z',

    // 裝置與基本資料
    osType: 'iOS',
    wearableDevice: 'garmin',
    gender: '男',
    ageGroup: '50 到69',
    height: 173,
    weight: 69.4,

    // 運動種類與次數
    sportsTypeCount: '3種以上',
    totalRecordsCount: 96,
    walkingCount: 20,
    runningCount: 56,
    cyclingCount: 15,
    dailyStepsCount: 175,
    dailyStepsCalories: 76500,

    // 累積運動距離長度
    walkingKm: 95,
    runningKm: 480,
    cyclingKm: 170,
    indoorMinutes: 620,
    otherMinutes: 300,

    // 運動時段
    weekdayCount: 28,
    weekendCount: 18,

    // 運動地點
    primaryCity: '台北市',
    crossCity: 'Y',
    overseasRegion: '日本',

    // 馬拉松賽事活動
    marathonEvent: 'Y',

    // 生態系與 App 使用行為
    roamingAbroad: 'Y',
    travelWebsite: 'Y',
    weatherWebsite: 'Y',
    momoShopping: 'Y',

    // Used Multimedia App
    multimediaApps: ['MyVideo', 'Netflix/Disney+/HBO', 'KKBox', 'Spotify'],

    // Used Sports APP
    sportsApps: ['NikeRunC', 'Mi運動', '運動筆記', 'Strava APP', 'Garmin Connect', 'mySports', 'Apple 健身/健康'],

    // 統計運算兼容欄位
    totalDistance: 745,
    totalCalories: 76500,
    totalMinutes: 5640,
    totalSteps: 1120000,
    hikingCount: 15,
    usedApps: ['NikeRunC', 'Mi運動', '運動筆記', 'Strava APP', 'Garmin Connect', 'mySports', 'Apple 健身/健康'],
  },
};

export const SURVEY_PERIODS = [
  { id: '2025H2', label: '2025下半年' },
  { id: '2026H1', label: '2026上半年' },
  { id: '2026H2', label: '2026下半年' },
];

export const OS_OPTIONS = ['iOS', 'Android', '其他'];
export const WEARABLE_OPTIONS = ['garmin', 'apple watch', 'others', '無'];
export const GENDER_OPTIONS = ['男', '女'];
export const AGE_GROUP_OPTIONS = ['29以下', '30-49', '50 到69', '70以上'];
export const SPORTS_TYPE_COUNT_OPTIONS = ['單一', '2種', '3種以上'];
export const YES_NO_OPTIONS = ['Y', 'N'];
export const CITY_OPTIONS = [
  '台北市',
  '新北市',
  '基隆市',
  '桃園市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
  '台中市',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義市',
  '嘉義縣',
  '台南市',
  '高雄市',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '澎湖/金門/連江',
  '其他縣市',
];
export const OVERSEAS_OPTIONS = ['日本', '東南亞', '歐美', '港澳/大陸', '其他', '無'];

export const MULTIMEDIA_APP_OPTIONS = [
  'MyVideo',
  'Netflix/Disney+/HBO',
  'KKBox',
  'Spotify',
];

export const SPORTS_APP_OPTIONS = [
  'NikeRunC',
  'Mi運動',
  '運動筆記',
  'Strava APP',
  'Garmin Connect',
  'mySports',
  'Apple 健身/健康',
];
