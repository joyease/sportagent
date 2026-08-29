export interface UserRecord {
  month: string; // YYYY-MM
  distance: number; // km
  minutes: number; // min
  calories: number; // kcal
  weight: number; // kg
  updatedAt?: string;
  notes?: string;
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

export interface SportsSpotEntry {
  latitude: number;
  longitude: number;
  description?: string;
  spots?: string[];
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
