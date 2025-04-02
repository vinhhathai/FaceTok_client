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
          setLoading(false);
        }
      );
    } else {
      setError("Trình duyệt của bạn không hỗ trợ định vị.");
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    try {
      // Sử dụng OpenWeatherMap API - bạn cần đăng ký API key
      const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; // Thay bằng API key thực tế
      
      // Thực hiện API call
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      
      // Nếu API key chưa được cung cấp, sử dụng dữ liệu mô phỏng
      if (!apiKey || apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
        setTimeout(() => {
          setWeather({
            temp: 28,
            humidity: 15,
            windSpeed: 10,
            icon: weatherIcon
          });
          setLoading(false);
        }, 1000);
      } else {
        // Xử lý response từ API thực tế
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
      
      // Fallback cho mục đích demo
      setTimeout(() => {
        setWeather({
          temp: 28,
          humidity: 15,
          windSpeed: 10,
          icon: weatherIcon
        });
        setLoading(false);
      }, 1000);
    }
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      // Sử dụng Nominatim OpenStreetMap API (miễn phí, không cần API key)
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
      const data = await response.json();
      
      // Parse kết quả để lấy tên thành phố hoặc khu vực
      let locationName = "";
      
      if (data.address) {
        // Ưu tiên city, nếu không có thì dùng town, village, county theo thứ tự đó
        locationName = data.address.city || 
                      data.address.town || 
                      data.address.village || 
                      data.address.county || 
                      data.address.state ||
                      "Không xác định";
        
        // Thêm tên quốc gia nếu có
        if (data.address.country_code) {
          locationName += `, ${data.address.country_code.toUpperCase()}`;
        }
      } else {
        // Fallback nếu không parse được địa chỉ
        locationName = data.display_name?.split(',')[0] || "Không xác định";
      }
      
      setLocation(locationName);
    } catch (err) {
      console.error("Error reverse geocoding:", err);
      
      // Sử dụng browser's locale information nếu geocode thất bại
      try {
        const locale = navigator.language;
        const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
        const formatter = new Intl.DateTimeFormat(locale, options);
        
        // Extract timezone city
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const cityFromTimezone = timezone.split('/').pop().replace(/_/g, ' ');
        
        setLocation(cityFromTimezone || "Vị trí không xác định");
      } catch (localeErr) {
        setLocation("Vị trí không xác định");
      }
    }
  };

  // Cập nhật thời gian mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Lấy vị trí khi component mount
  useEffect(() => {
    getLocation();
  }, []);

  // Format time
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Xử lý refresh thời tiết
  const handleRefresh = () => {
    getLocation();
  };

  if (error) {
    return (
      <Grid item xs={12} md={4} lg={3}>
        <WeatherBarContainer elevation={3}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton color="primary" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </WeatherBarContainer>
      </Grid>
    );
  }

  return (
    <Grid item xs={12} md={4} lg={3}>
      <WeatherBarContainer elevation={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        ) : (
          <>
            <WeatherHeader>
              <WeatherTime variant="h4">{formattedTime}</WeatherTime>
              <LocationButton>
                <Typography variant="button" color="primary">
                  {location || "Đang cập nhật..."}
                </Typography>
                <MyLocationIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />
              </LocationButton>
            </WeatherHeader>

            <WeatherContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={7}>
                  <TemperatureContainer>
                    <WeatherIcon src={weather?.icon} alt="Weather icon" />
                    <Temperature>
                      {weather?.temp}<span className="degree">&deg;</span>
                    </Temperature>
                  </TemperatureContainer>
                </Grid>
                <Grid item xs={5}>
                  <WeatherDetails>
                    <WeatherDetailItem>
                      <OpacityIcon fontSize="medium" />
                      <Typography variant="body1">{weather?.humidity}%</Typography>
                    </WeatherDetailItem>
                    <WeatherDetailItem>
                      <FlagIcon fontSize="medium" />
                      <Typography variant="body1">{weather?.windSpeed}km/h</Typography>
                    </WeatherDetailItem>
                  </WeatherDetails>
                </Grid>
              </Grid>
            </WeatherContent>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <IconButton 
                size="medium" 
                onClick={handleRefresh} 
                color="primary"
                sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </>
        )}
      </WeatherBarContainer>
    </Grid>
  );
}

export default WeatherBar;
