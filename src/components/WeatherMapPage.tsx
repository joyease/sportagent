import React, { useState, useEffect, useRef } from 'react';
import { SportsSpotEntry, WeatherData, SpotDetail } from '../types';
import { fetchCityWeather } from '../utils/weather';
import L from 'leaflet';
import {
  Compass,
  MapPin,
  CloudSun,
  Wind,
  Droplets,
  CheckCircle2,
  Navigation,
  RefreshCw,
  Sparkles,
  AlertCircle,
  Globe2,
} from 'lucide-react';

interface WeatherMapPageProps {
  onBackHome?: () => void;
}

const COUNTRY_CONFIG: Record<
  string,
  { label: string; flag: string; cities: string[] }
> = {
  台灣: {
    label: '台灣 (Taiwan)',
    flag: '🇹🇼',
    cities: [
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
    ],
  },
  日本: {
    label: '日本 (Japan)',
    flag: '🇯🇵',
    cities: ['東京', '大阪', '京都'],
  },
  中國: {
    label: '中國 (China)',
    flag: '🇨🇳',
    cities: ['上海', '北京', '香港', '廈門'],
  },
  越南: {
    label: '越南 (Vietnam)',
    flag: '🇻🇳',
    cities: ['胡志明市', '河內'],
  },
};

const CITY_COORDINATES: Record<string, [number, number]> = {
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
  東京: [35.6895, 139.6917],
  大阪: [34.6937, 135.5023],
  京都: [35.0116, 135.7681],
  上海: [31.2304, 121.4737],
  北京: [39.9042, 116.4074],
  香港: [22.3193, 114.1694],
  廈門: [24.4798, 118.0894],
  胡志明市: [10.8231, 106.6297],
  河內: [21.0285, 105.8542],
};

export const WeatherMapPage: React.FC<WeatherMapPageProps> = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('台灣');
  const [selectedCity, setSelectedCity] = useState<string>('台北市');
  const [spotsData, setSpotsData] = useState<Record<string, Record<string, SportsSpotEntry>>>({});
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const spotMarkersRef = useRef<L.Marker[]>([]);

  // Helper to extract spot object safely
  const parseSpot = (
    spotItem: string | SpotDetail,
    defaultLat: number,
    defaultLon: number,
    idx: number
  ): SpotDetail => {
    if (typeof spotItem === 'string') {
      const offsetLat = defaultLat + (idx % 2 === 0 ? 0.008 * (idx + 1) : -0.007 * (idx + 1));
      const offsetLon = defaultLon + (idx % 3 === 0 ? 0.009 * (idx + 1) : -0.008 * (idx + 1));
      return {
        name: spotItem,
        latitude: offsetLat,
        longitude: offsetLon,
        description: '熱門跑友推薦路段',
      };
    }
    return {
      name: spotItem.name,
      latitude: spotItem.latitude ?? defaultLat,
      longitude: spotItem.longitude ?? defaultLon,
      description: spotItem.description || '熱門跑友推薦路段',
    };
  };

  // Load spots.json
  useEffect(() => {
    fetch('/spots.json')
      .then((res) => res.json())
      .then((data) => {
        setSpotsData(data);
      })
      .catch((err) => {
        console.warn('Could not load spots.json, using fallback:', err);
      });
  }, []);

  // Update weather & map markers whenever country/city changes
  const updateCityData = async (country: string, city: string) => {
    setIsLoadingWeather(true);
    let lat = 25.033;
    let lon = 121.5654;

    const cityEntry = spotsData[country]?.[city];
    if (cityEntry && cityEntry.latitude && cityEntry.longitude) {
      lat = cityEntry.latitude;
      lon = cityEntry.longitude;
    } else if (CITY_COORDINATES[city]) {
      [lat, lon] = CITY_COORDINATES[city];
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

      // Clear previous spot markers
      spotMarkersRef.current.forEach((m) => m.remove());
      spotMarkersRef.current = [];

      // Add spot markers using precise coordinates
      const rawSpots = cityEntry?.spots || [];
      rawSpots.forEach((rawSpot, idx) => {
        const spot = parseSpot(rawSpot, lat, lon, idx);

        const spotIcon = L.divIcon({
          className: 'custom-spot-icon',
          html: `<div style="background:#ff6d00;color:white;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);cursor:pointer;">🏃</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const spotMarker = L.marker([spot.latitude, spot.longitude], { icon: spotIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:170px;">
              <div style="font-weight:bold;font-size:13px;color:#1e293b;margin-bottom:2px;">📍 ${spot.name}</div>
              <div style="font-size:11px;color:#64748b;margin-bottom:4px;">${spot.description || ''}</div>
              <div style="font-size:10px;font-family:monospace;color:#5ea31b;font-weight:bold;">座標: ${spot.latitude.toFixed(4)}, ${spot.longitude.toFixed(4)}</div>
            </div>`
          );

        spotMarker.on('click', () => {
          setSelectedSpotIndex(idx);
        });

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

    updateCityData(selectedCountry, selectedCity);
  }, []);

  // Whenever spotsData updates, refresh current city markers
  useEffect(() => {
    if (Object.keys(spotsData).length > 0) {
      updateCityData(selectedCountry, selectedCity);
    }
  }, [spotsData]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    const availableCities = COUNTRY_CONFIG[newCountry]?.cities || ['台北市'];
    const newCity = availableCities[0];
    setSelectedCity(newCity);
    setSelectedSpotIndex(null);
    updateCityData(newCountry, newCity);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedSpotIndex(null);
    updateCityData(selectedCountry, city);
  };

  // Execute precise Spot location viewing
  const handleSpotClick = (index: number) => {
    setSelectedSpotIndex(index);
    const rawSpots = spotsData[selectedCountry]?.[selectedCity]?.spots || [];
    const rawSpot = rawSpots[index];
    if (!rawSpot || !mapInstanceRef.current) return;

    const cityEntry = spotsData[selectedCountry]?.[selectedCity];
    const defaultLat = cityEntry?.latitude || 25.033;
    const defaultLon = cityEntry?.longitude || 121.5654;
    const spot = parseSpot(rawSpot, defaultLat, defaultLon, index);

    // Fly to spot on map
    mapInstanceRef.current.flyTo([spot.latitude, spot.longitude], 15, {
      duration: 1.0,
    });

    if (spotMarkersRef.current[index]) {
      spotMarkersRef.current[index].openPopup();
    }
  };

  const rawCitySpots = spotsData[selectedCountry]?.[selectedCity]?.spots || [];
  const hasSpots = rawCitySpots.length > 0;
  const currentCityList = COUNTRY_CONFIG[selectedCountry]?.cities || [];

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
          onClick={() => updateCityData(selectedCountry, selectedCity)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          title="重新整理氣象"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Selectors: Country & City - Deep Blue Theme */}
      <div className="bg-[#0b1b36] p-4 rounded-2xl border border-blue-900/80 shadow-xl space-y-3 text-white">
        <div className="text-sm font-bold text-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-lime-400" />
            <span>去那裡運動?</span>
          </div>
          <span className="text-[10px] text-blue-300 flex items-center gap-1 font-normal bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800">
            <Globe2 className="w-3 h-3 text-lime-400" /> 支援 台灣 / 日本 / 中國 / 越南
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Country Selector */}
          <div>
            <label className="block text-[10px] text-slate-300 font-medium mb-1">國家 / 地區</label>
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="w-full bg-slate-800 border border-blue-500/50 focus:ring-2 focus:ring-blue-400 text-white text-xs font-bold rounded-xl p-2.5 shadow-sm transition cursor-pointer"
            >
              {Object.keys(COUNTRY_CONFIG).map((cKey) => {
                const config = COUNTRY_CONFIG[cKey];
                return (
                  <option key={cKey} value={cKey} className="bg-slate-900 text-white">
                    {config.flag} {config.label}
                  </option>
                );
              })}
            </select>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-[10px] text-slate-300 font-medium mb-1">城市選單</label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full bg-slate-800 border border-blue-500/50 focus:ring-2 focus:ring-blue-400 text-white text-xs font-bold rounded-xl p-2.5 shadow-sm transition cursor-pointer"
            >
              {currentCityList.map((c) => (
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
            {selectedCountry} · {selectedCity} 即時氣象
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
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-[#ff6d00]" />
            運動景點地圖
          </span>
          <span className="text-[10px] text-slate-400">點擊下方推薦路段即可快速定位</span>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="w-full h-64 rounded-xl border border-slate-200 shadow-inner z-0 overflow-hidden"
          style={{ minHeight: '260px' }}
        />
      </div>

      {/* Spots list */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#5ea31b]" />
            {selectedCity} 熱門運動推薦路段
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">
            {hasSpots ? `${rawCitySpots.length} 個推薦點` : '建檔中'}
          </span>
        </div>

        {hasSpots ? (
          <div className="space-y-2">
            {rawCitySpots.map((rawSpot, idx) => {
              const isSelected = selectedSpotIndex === idx;
              const cityEntry = spotsData[selectedCountry]?.[selectedCity];
              const defaultLat = cityEntry?.latitude || 25.033;
              const defaultLon = cityEntry?.longitude || 121.5654;
              const spot = parseSpot(rawSpot, defaultLat, defaultLon, idx);

              return (
                <div
                  key={idx}
                  onClick={() => handleSpotClick(idx)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex flex-col gap-1 transition-all ${
                    isSelected
                      ? 'bg-orange-50 border-[#ff6d00] text-orange-950 shadow-sm'
                      : 'bg-slate-50 hover:bg-lime-50/80 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-lime-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900">{spot.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#5ea31b] flex items-center gap-0.5 shrink-0 hover:underline">
                      定位查看 ➔
                    </span>
                  </div>

                  {spot.description && (
                    <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
                      {spot.description}
                    </p>
                  )}

                  <div className="text-[10px] font-mono text-slate-400 pl-7 flex items-center gap-1">
                    <span>座標:</span>
                    <span className="text-slate-600 font-bold">
                      {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                    </span>
                  </div>
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
                該城市即時氣象與地圖已正常載入，景點將在近期更新建置。
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
