import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

/**
 * GamesPage - Embed Game Platform
 * Displays game platform from chaotok_game/client
 */
export default function GamesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const [isLoading, setIsLoading] = useState(true);
  
  // Game platform URL - Netlify hosted
  const gamesPlatformUrl = `https://egg-catcher-chaotok.netlify.app/?token=${token}`;

  useEffect(() => {
    // Listen for messages from iframe
    const handleMessage = (event) => {
      // Security: Verify origin if needed
      if (event.data?.type === 'NAVIGATE_HOME') {
        navigate('/home');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            zIndex: 1000,
            gap: 3
          }}
        >
          <SportsEsportsIcon sx={{ fontSize: 80, color: 'primary.main', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <CircularProgress size={60} thickness={4} color="primary" />
          <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
            Đang tải trò chơi...
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Vui lòng đợi trong giây lát
          </Typography>
          
          {/* Add keyframe animation */}
          <style>
            {`
              @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.1); }
              }
            `}
          </style>
        </Box>
      )}
      
      <iframe
        src={gamesPlatformUrl}
        title="Chaotok Games"
        onLoad={handleIframeLoad}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        allow="fullscreen; autoplay"
      />
    </Box>
  );
}
