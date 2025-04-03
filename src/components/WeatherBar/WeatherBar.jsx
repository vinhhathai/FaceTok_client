import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import OpacityIcon from '@mui/icons-material/Opacity';
import FlagIcon from '@mui/icons-material/Flag';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import weatherIcon from "../../assets/images/icons/weather/sun.png";

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

function WeatherBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLocation = () => {
    setLoading(true);
    setError(null); // Reset error on refresh
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
          reverseGeocode(latitude, longitude);
        },
        error => {
          console.error("Error getting location:", error);
          setError("Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.");
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
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
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
  };

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
      setError("Không thể tải dữ liệu thời tiết.");
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
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleRefresh = () => {
    getLocation();
  };

  if (error && !weather) { // Show error only if weather data couldn't be loaded
    return (
      <WeatherBarContainer elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="warning" sx={{ mb: 1, width: '100%' }}>{error}</Alert>
        <IconButton color="primary" onClick={handleRefresh} size="small">
          <RefreshIcon />
          <Typography variant="caption" sx={{ ml: 0.5 }}>Thử lại</Typography>
        </IconButton>
      </WeatherBarContainer>
    );
  }
  
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
                    <Typography variant="body2">{weather?.windSpeed}km/h</Typography>
                  </WeatherDetailItem>
                </WeatherDetails>
              </Grid>
            </Grid>
          </WeatherContent>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
            <IconButton 
              size="small" 
              onClick={handleRefresh} 
              color="primary"
              title="Refresh weather"
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <RefreshIcon fontSize="small"/>
            </IconButton>
          </Box>
        </Box>
      )}
      {error && weather && ( // Show small error message at bottom if refresh fails but old data exists
        <Alert severity="warning" variant="outlined" sx={{ fontSize: '0.75rem', p: '0 4px', mt: 1 }}>
          {error}
        </Alert>
      )}
    </WeatherBarContainer>
  );
}

export default WeatherBar;
