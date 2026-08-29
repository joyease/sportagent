import { WeatherData } from '../types';

export function interpretWmoCode(code: number): { text: string; iconName: string; isGoodForExercise: boolean } {
  switch (code) {
    case 0:
      return { text: '晴朗無雲 ☀️', iconName: 'Sun', isGoodForExercise: true };
    case 1:
    case 2:
      return { text: '多雲時晴 ⛅', iconName: 'CloudSun', isGoodForExercise: true };
    case 3:
      return { text: '陰天微涼 ☁️', iconName: 'Cloud', isGoodForExercise: true };
    case 45:
    case 48:
      return { text: '有晨霧/薄霧 🌫️', iconName: 'CloudFog', isGoodForExercise: true };
    case 51:
    case 53:
    case 55:
      return { text: '毛毛細雨 🌦️', iconName: 'CloudDrizzle', isGoodForExercise: false };
    case 61:
    case 63:
    case 65:
      return { text: '陣雨降雨 🌧️', iconName: 'CloudRain', isGoodForExercise: false };
    case 80:
    case 81:
    case 82:
      return { text: '短暫大驟雨 ⛈️', iconName: 'CloudRain', isGoodForExercise: false };
    case 95:
    case 96:
    case 99:
      return { text: '雷陣雨警報 ⚡', iconName: 'Zap', isGoodForExercise: false };
    default:
      return { text: '天氣良好 🌤️', iconName: 'CloudSun', isGoodForExercise: true };
  }
}

export async function fetchCityWeather(city: string, lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=Asia%2FTaipei`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.statusText}`);
    }
    const data = await res.json();
    const temp = Math.round((data.current_weather?.temperature ?? 26) * 10) / 10;
    const wind = Math.round((data.current_weather?.windspeed ?? 12) * 10) / 10;
    const code = data.current_weather?.weathercode ?? 1;
    const info = interpretWmoCode(code);

    let humidity = 68;
    if (data.hourly?.relativehumidity_2m && data.hourly.relativehumidity_2m.length > 0) {
      humidity = data.hourly.relativehumidity_2m[0];
    }

    let exerciseIndex = '極佳適合晨跑與騎乘';
    if (!info.isGoodForExercise) {
      exerciseIndex = '降雨機率高，建議轉為室內訓練';
    } else if (temp > 32) {
      exerciseIndex = '高溫炎熱，請注意補充水分與防曬';
    } else if (wind > 30) {
      exerciseIndex = '陣風較強，騎行需特別留意側風安全';
    } else if (temp < 15) {
      exerciseIndex = '氣溫微寒，請做好熱身與防風保暖';
    }

    return {
      city,
      temperature: temp,
      windSpeed: wind,
      weatherCode: code,
      conditionText: info.text,
      relativeHumidity: humidity,
      isComfortable: info.isGoodForExercise && temp >= 18 && temp <= 29,
      exerciseIndex,
    };
  } catch (error) {
    console.warn('Fallback weather info due to API exception:', error);
    return {
      city,
      temperature: 27.5,
      windSpeed: 9.8,
      weatherCode: 1,
      conditionText: '多雲時晴 ⛅ (離線模式)',
      relativeHumidity: 65,
      isComfortable: true,
      exerciseIndex: '氣候宜人，適合戶外運動',
    };
  }
}
