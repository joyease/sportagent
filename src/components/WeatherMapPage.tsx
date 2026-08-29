import React, { useState, useEffect, useRef } from 'react';
import { SportsSpotEntry, WeatherData } from '../types';
import { fetchCityWeather } from '../utils/weather';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  AlertCircle,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface WeatherMapPageProps {
  onBackHome?: () => void;
}

const TAIWAN_CITIES = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
  '新竹市',
  '宜蘭縣',
  '花蓮縣',
  '屏東縣',
  '澎湖縣',
  '金門縣',
];

export const WeatherMapPage: React.FC<WeatherMapPageProps> = () => {
  const [selectedCountry] = useState('台灣');
  const [selectedCity, setSelectedCity] = useState('台北市');
  const [spotsData, setSpotsData] = useState<Record<string, Record<string, SportsSpotEntry>>>({});
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const spotMarkersRef = useRef<L.Marker[]>([]);

  // Load spots.json
  useEffect(() => {
    fetch('/spots.json')
      .then((res) => res.json())
      .then((data) => {
        setSpotsData(data);
      })
      .catch((err) => {
        console.warn('Could not load spots.json, using fallback:', err);
        setSpotsData({
          台灣: {
            台北市: {
              latitude: 25.033,
              longitude: 121.5654,
              description: '首都活力都會跑道與綠地',
              spots: ['大安森林公園慢跑步道', '臺大綜合體育館周邊', '河濱自行車道 (迎風段)'],
            },
            台中市: {
              latitude: 24.1477,
              longitude: 120.6736,
              description: '文心森林與草悟道運動廊帶',
              spots: ['台中公園環湖步道', '圓滿戶外劇場周邊', '草悟道慢跑綠廊'],
            },
          },
        });
      });
  }, []);

  // Update weather & map whenever selectedCity or spotsData changes
  const updateCityData = async (city: string) => {
    setIsLoadingWeather(true);
    let lat = 25.033;
    let lon = 121.5654;

    const cityEntry = spotsData['台灣']?.[city];
    if (cityEntry && cityEntry.latitude && cityEntry.longitude) {
      lat = cityEntry.latitude;
      lon = cityEntry.longitude;
    } else {
      // Fallback coordinate mappings if needed
      const cityCoords: Record<string, [number, number]> = {
        台北市: [25.033, 121.5654],
        新北市: [25.0118, 121.4658],
        桃園市: [24.9936, 121.301],
        台中市: [24.1477, 120.6736],
        台南市: [22.9997, 120.227],
        高雄市: [22.6273, 120.3014],
        新竹市: [24.8138, 120.9675],
        宜蘭縣: [24.757, 121.753],
        花蓮縣: [23.9871, 121.6015],
        屏東縣: [22.6826, 120.4879],
        澎湖縣: [23.5711, 119.5793],
        金門縣: [24.4492, 118.3766],
      };
      if (cityCoords[city]) {
        [lat, lon] = cityCoords[city];
      }
    }

    // Fetch Weather
    const wData = await fetchCityWeather(city, lat, lon);
    setWeather(wData);
    setIsLoadingWeather(false);

    // Update Leaflet Map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lon], 13, {
        duration: 1.2,
      });

      // Update main city marker
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lon]);
      } else {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color:#5ea31b;color:white;padding:6px 10px;border-radius:12px;font-weight:bold;font-size:12px;box-shadow:0 3px 8px rgba(0,0,0,0.3);border:2px solid white;display:flex;align-items:center;gap:4px;white-space:nowrap;">📍 ${city}</div>`,
          iconSize: [80, 30],
          iconAnchor: [40, 15],
        });
        markerRef.current = L.marker([lat, lon], { icon: customIcon }).addTo(mapInstanceRef.current);
      }

      // Clear previous spot markers
      spotMarkersRef.current.forEach((m) => m.remove());
      spotMarkersRef.current = [];

      // Add spot markers offset around city
      const spots = spotsData['台灣']?.[city]?.spots || [];
      spots.forEach((spot, idx) => {
        const offsetLat = lat + (idx % 2 === 0 ? 0.008 * (idx + 1) : -0.007 * (idx + 1));
        const offsetLon = lon + (idx % 3 === 0 ? 0.009 * (idx + 1) : -0.008 * (idx + 1));

        const spotIcon = L.divIcon({
          className: 'custom-spot-icon',
          html: `<div style="background:#ff6d00;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);">🏃</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const spotMarker = L.marker([offsetLat, offsetLon], { icon: spotIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<strong style="color:#2d3748;">${spot}</strong><br><span style="font-size:11px;color:#718096;">熱門跑友推薦路段</span>`);

        spotMarkersRef.current.push(spotMarker);
      });

      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 300);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = 25.033;
      const initialLon = 121.5654;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 13,
        zoomControl: false,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    updateCityData(selectedCity);

    return () => {
      // Don't fully destroy to allow quick tab switching
    };
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedSpotIndex(null);
    updateCityData(city);
  };

  const handleSpotClick = (index: number) => {
    setSelectedSpotIndex(index);
    if (spotMarkersRef.current[index] && mapInstanceRef.current) {
      const latLng = spotMarkersRef.current[index].getLatLng();
      mapInstanceRef.current.panTo(latLng);
      spotMarkersRef.current[index].openPopup();
    }
  };

  const citySpots = spotsData['台灣']?.[selectedCity]?.spots || [];
  const hasSpots = citySpots.length > 0;

  return (
    <div className="space-y-4 pb-20 pt-2">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">熱點與天氣</h1>
          </div>
        </div>

        <button
          onClick={() => updateCityData(selectedCity)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
          title="重新整理氣象"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Selectors: Country & City - Deep Blue Theme */}
      <div className="bg-[#0b1b36] p-4 rounded-2xl border border-blue-900/80 shadow-xl space-y-3 text-white">
        <div className="text-sm font-bold text-blue-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-lime-400" />
          去那裡運動?
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[10px] text-slate-300 font-medium mb-1">國家 / 地區</label>
            <select
              disabled
              value={selectedCountry}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium rounded-xl p-2.5 cursor-not-allowed"
            >
              <option value="台灣">🇹🇼 台灣 (Taiwan)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-300 font-medium mb-1">縣市選單</label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full bg-slate-800 border border-blue-500/50 focus:ring-2 focus:ring-blue-400 text-white text-xs font-bold rounded-xl p-2.5 shadow-sm transition"
            >
              {TAIWAN_CITIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  📍 {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Weather Dashboard Card */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white p-4 shadow-md relative">
        <div className="absolute right-2 top-2 opacity-15 pointer-events-none">
          <CloudSun className="w-28 h-28" />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-lime-300" />
            {selectedCity} 即時氣象
          </div>
          <span className="text-[11px] text-sky-100 bg-black/20 px-2 py-0.5 rounded-md">
            Open-Meteo API
          </span>
        </div>

        {isLoadingWeather ? (
          <div className="py-6 text-center text-sm font-semibold flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            氣象連線擷取中...
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-end justify-between my-2">
              <div>
                <div className="text-3xl font-extrabold tracking-tight">
                  {weather.temperature} <span className="text-xl font-normal">°C</span>
                </div>
                <div className="text-xs font-medium text-sky-100 mt-0.5">
                  {weather.conditionText}
                </div>
              </div>

              <div className="text-right space-y-1 text-xs">
                <div className="flex items-center justify-end gap-1 text-sky-100">
                  <Wind className="w-3.5 h-3.5" />
                  風速: <strong className="text-white">{weather.windSpeed} km/h</strong>
                </div>
                <div className="flex items-center justify-end gap-1 text-sky-100">
                  <Droplets className="w-3.5 h-3.5" />
                  濕度: <strong className="text-white">{weather.relativeHumidity}%</strong>
                </div>
              </div>
            </div>

            {/* Exercise advice */}
            <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center gap-2 text-xs bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <div>
                <span className="font-bold text-amber-200">戶外運動建議：</span>
                <span className="text-white">{weather.exerciseIndex}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-xs text-red-200">
            ⚠️ 氣象資料連線異常，請檢查網路
          </div>
        )}
      </div>

      {/* Leaflet Interactive Map */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#ff6d00]" />
            運動景點地圖
          </span>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-56 rounded-xl border border-slate-200 shadow-inner z-0 overflow-hidden"
          style={{ minHeight: '220px' }}
        />
      </div>

      {/* Spots list or fallback notice */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5ea31b]" />
            {selectedCity} 熱門運動推薦路段 (spots.json)
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            {hasSpots ? `${citySpots.length} 個推薦點` : '建檔中'}
          </span>
        </div>

        {hasSpots ? (
          <div className="space-y-2">
            {citySpots.map((spot, idx) => {
              const isSelected = selectedSpotIndex === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSpotClick(idx)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-orange-50 border-[#ff6d00] text-orange-950 font-bold shadow-sm'
                      : 'bg-slate-50 hover:bg-lime-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-lime-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{spot}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">定位查看 ➔</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="font-bold text-amber-900">📢 運動景點：資料建檔中，敬請期待！</div>
              <div className="text-[11px] text-amber-700 mt-0.5">
                該縣市即時氣象與地圖已正常載入，景點將在近期更新建置。
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
