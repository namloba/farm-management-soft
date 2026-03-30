import { useState, useEffect, useCallback } from 'react';

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  location: GeolocationData | null;
  error: string | null;
  loading: boolean;
  getLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getLocation = useCallback(() => {
    console.log('Đang lấy vị trí...');
    if (!navigator.geolocation) {
      setError('Trình duyệt của bạn không hỗ trợ định vị');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Vị trí đã được lấy:', position);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        console.error('Lỗi khi lấy vị trí:', err);
        let errorMessage = 'Không thể lấy vị trí';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Bạn chưa cấp quyền truy cập vị trí';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Không thể xác định vị trí';
            break;
          case err.TIMEOUT:
            errorMessage = 'Yêu cầu định vị quá thời gian chờ';
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  // Tự động lấy vị trí khi component mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, error, loading, getLocation };
}