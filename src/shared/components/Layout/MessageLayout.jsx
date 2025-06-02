import React from 'react';
import { Box, Container, Paper, useMediaQuery, useTheme } from '@mui/material';
import Header from '../Header/Header';

/**
 * Layout component specifically designed for the messaging interface
 * Provides full height layout with header and focuses on maximizing chat area
 */
const MessageLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          py: 2,
          px: isMobile ? 0 : 2,
          display: 'flex'
        }}
      >
        <Container 
          maxWidth="xl" 
          sx={{ 
            px: isMobile ? 0 : 2,
            height: `calc(100vh - ${theme.spacing(8)})` 
          }}
        >
          <Paper 
            elevation={isMobile ? 0 : 1}
            sx={{ 
              height: '100%', 
              overflow: 'hidden',
              borderRadius: isMobile ? 0 : 2
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default MessageLayout; 