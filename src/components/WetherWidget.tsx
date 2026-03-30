import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import axios from 'axios';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  locationName: string;
}

interface WeatherWidgetProps {
  unit?: 'celsius' | 'fahrenheit';
}

// Mã thời tiết theo chuẩn WMO [citation:6]
const getWeatherDescription = (code: number): { main: string; icon: string } => {
  const weatherMap: Record<number, { main: string; icon: string }> = {
    0: { main: 'Trời quang', icon: '☀️' },
    1: { main: 'Ít mây', icon: '🌤️' },
    2: { main: 'Mây rải rác', icon: '⛅' },
    3: { main: 'Nhiều mây', icon: '☁️' },
    45: { main: 'Sương mù', icon: '🌫️' },
    48: { main: 'Sương muối', icon: '🌫️' },
    51: { main: 'Mưa phùn nhẹ', icon: '🌦️' },
    53: { main: 'Mưa phùn', icon: '🌦️' },
    55: { main: 'Mưa phùn nặng', icon: '🌧️' },
    61: { main: 'Mưa nhẹ', icon: '🌧️' },
    63: { main: 'Mưa vừa', icon: '🌧️' },
    65: { main: 'Mưa nặng', icon: '🌧️' },
    71: { main: 'Tuyết nhẹ', icon: '❄️' },
    73: { main: 'Tuyết vừa', icon: '❄️' },
    75: { main: 'Tuyết nặng', icon: '❄️' },
    80: { main: 'Mưa rào nhẹ', icon: '🌦️' },
    81: { main: 'Mưa rào', icon: '🌧️' },
    82: { main: 'Mưa rào nặng', icon: '🌧️' },
    95: { main: 'Dông bão', icon: '⛈️' },
    96: { main: 'Dông kèm mưa đá', icon: '⛈️' },
    99: { main: 'Dông kèm mưa đá nặng', icon: '⛈️' },
  };
  return weatherMap[code] || { main: 'Đang cập nhật', icon: '🌡️' };
};

export function WeatherWidget({ unit = 'celsius' }: WeatherWidgetProps) {
  console.log('WeatherWidget đã được gọi');
  const { location, error: locationError, loading: locationLoading } = useGeolocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Gọi Open-Meteo API - hoàn toàn miễn phí, không cần API key [citation:6]
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&timezone=auto`;
        
        const response = await axios.get(url);
        const current = response.data.current_weather;
        
        // Lấy thêm độ ẩm từ hourly data
        const humidity = response.data.hourly?.relative_humidity_2m?.[0] || 0;
        
        const weatherInfo = getWeatherDescription(current.weathercode);
        
        setWeather({
          temperature: unit === 'celsius' ? current.temperature : (current.temperature * 9/5) + 32,
          humidity: humidity,
          windSpeed: current.windspeed,
          weatherCode: current.weathercode,
          weatherDescription: weatherInfo.main,
          locationName: `${location.latitude.toFixed(2)}°N, ${location.longitude.toFixed(2)}°E`,
        });
      } catch (err) {
        console.error('Lỗi lấy dữ liệu thời tiết:', err);
        setError('Không thể tải dữ liệu thời tiết');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, unit]);

  // Hiển thị trạng thái loading
  if (locationLoading || loading) {
    return (
      <div className="bg-primary-container rounded-3xl p-6 text-white shadow-sm animate-pulse">
        <div className="h-24 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined animate-spin">sync</span>
          <span className="font-medium">Đang lấy dữ liệu thời tiết...</span>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi
  if (locationError || error) {
    return (
      <div className="bg-error-container/20 rounded-3xl p-6 border-l-4 border-error shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error">error</span>
          <div>
            <p className="font-semibold text-on-surface">Không thể tải dữ liệu thời tiết</p>
            <p className="text-sm text-on-surface-variant">{locationError || error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-primary font-semibold underline"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Không có weather data
  if (!weather) {
    return (
      <div className="bg-primary-container rounded-3xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined">wb_twilight</span>
          <div>
            <p className="font-semibold">Đang đồng bộ</p>
            <p className="text-sm opacity-80">Vui lòng đợi trong giây lát...</p>
          </div>
        </div>
      </div>
    );
  }

  const weatherIcon = getWeatherDescription(weather.weatherCode).icon;

  return (
    <div className="bg-gradient-to-br from-primary to-primary-container rounded-3xl p-6 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-headline font-extrabold">
              {Math.round(weather.temperature)}°
            </span>
            <span className="font-medium opacity-80 text-sm">
              {unit === 'celsius' ? 'C' : 'F'}
            </span>
          </div>
          <p className="font-semibold text-lg mt-1">{weather.weatherDescription}</p>
          <p className="text-xs opacity-80 mt-1">{weather.locationName}</p>
        </div>
        <div className="text-6xl">
          {weatherIcon}
        </div>
      </div>
      
      <div className="flex gap-4 mt-4 pt-2 border-t border-white/20">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">water_drop</span>
          <span className="text-sm font-medium">{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">air</span>
          <span className="text-sm font-medium">{Math.round(weather.windSpeed)} km/h</span>
        </div>
      </div>
    </div>
  );
}