import React, { useState, useEffect, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OpacityIcon from '@mui/icons-material/Opacity';
import FlagIcon from '@mui/icons-material/Flag';
import CircularProgress from '@mui/material/CircularProgress';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { useError } from '../../../../shared/hooks';

import {
  WeatherBarContainer,
  WeatherHeader,
  WeatherTime,
  LocationButton,
  WeatherContent,
  TemperatureContainer,
  WeatherIcon,
  Temperature,
  WeatherDetails,
  WeatherDetailItem
} from './styles';

// Default weather icon as fallback (placeholder URL)
const weatherIcon = "https://openweathermap.org/img/wn/04d@2x.png";

function WeatherBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showWarning, showError } = useError();

  const getLocation = useCallback(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          reverseGeocode(latitude, longitude);
        },
        error => {
          console.error("Error getting location:", error);
          showWarning("Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.");
          // Fallback for demo if location access denied
          setWeather({
            temp: 28,
            humidity: 15,
            windSpeed: 10,
            icon: weatherIcon
          });
          setLocation("CẦN THƠ, VN");
          setLoading(false);
        },
        { timeout: 10000 } // Add timeout
      );
    } else {
      showWarning("Trình duyệt của bạn không hỗ trợ định vị.");
      // Fallback for demo if geolocation not supported
      setWeather({
        temp: 28,
        humidity: 15,
        windSpeed: 10,
        icon: weatherIcon
      });
      setLocation("CẦN THƠ, VN");
      setLoading(false);
    }
  }, [showWarning]);

  const fetchWeatherData = async (lat, lon) => {
    try {
      const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your key

      if (!apiKey || apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
        // Demo fallback
        setTimeout(() => {
          setWeather({
            temp: 28,
            humidity: 15,
            windSpeed: 10,
            icon: weatherIcon
          });
          setLoading(false);
        }, 500);
      } else {
        // Real API call
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Failed to fetch weather');
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      showError("Không thể tải dữ liệu thời tiết.");
      // Demo fallback on error
      setWeather({
        temp: 28,
        humidity: 15,
        windSpeed: 10,
        icon: weatherIcon
      });
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
      if (!response.ok) throw new Error('Failed to geocode');
      const data = await response.json();
      let locationName = "Không xác định";
      if (data.address) {
        locationName = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || "Không xác định";
        if (data.address.country_code) {
          locationName += `, ${data.address.country_code.toUpperCase()}`;
        }
      }
      setLocation(locationName);
    } catch (err) {
      console.error("Error reverse geocoding:", err);
      setLocation("CẦN THƠ, VN"); // Demo fallback on error
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleRefresh = () => {
    getLocation();
  };

  // Always render the container, show loading or content inside
  return (
    <WeatherBarContainer elevation={1} sx={{ p: 2, height: '100%' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress size={30} />
        </Box>
      ) : (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <WeatherHeader>
            <WeatherTime variant="h4">{formattedTime}</WeatherTime>
            <LocationButton>
              <Typography variant="button" color="primary">
                {location || "..."}
              </Typography>
              <MyLocationIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />
            </LocationButton>
          </WeatherHeader>

          <WeatherContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
              <Grid item xs={6}>
                <TemperatureContainer>
                  <WeatherIcon src={weather?.icon || weatherIcon} alt="Weather icon" />
                  <Temperature>
                    {weather?.temp}<span className="degree">&deg;</span>
                  </Temperature>
                </TemperatureContainer>
              </Grid>
              <Grid item xs={6}>
                <WeatherDetails>
                  <WeatherDetailItem>
                    <OpacityIcon fontSize="small" />
                    <Typography variant="body2">{weather?.humidity}%</Typography>
                  </WeatherDetailItem>
                  <WeatherDetailItem>
                    <FlagIcon fontSize="small" />
                    <Typography variant="body2">{weather?.windSpeed} km/h</Typography>
                  </WeatherDetailItem>
                </WeatherDetails>
              </Grid>
            </Grid>
          </WeatherContent>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <IconButton
              color="primary"
              onClick={handleRefresh}
              size="small"
              sx={{ fontSize: '0.75rem' }}
            >
              <RefreshIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>Làm mới</Typography>
            </IconButton>
          </Box>
        </Box>
      )}
    </WeatherBarContainer>
  );
}

export default WeatherBar; 