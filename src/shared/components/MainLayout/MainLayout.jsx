import React from 'react';
import { Grid, Container, Box, useMediaQuery, useTheme } from '@mui/material';

function MainLayout({ thumbnail, leftSidebar, content, rightSidebar }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="xl" sx={{ mt: isMobile ? 0 : 3 }}>
      <Grid container spacing={isMobile ? 0 : 3}>
        {/* Thumbnail Row (Optional) */}
        {thumbnail && (
          <Grid item xs={12}>
            {thumbnail}
          </Grid>
        )}

        {/* Mobile Profile Info */}
        {isMobile && leftSidebar && (
          <Grid item xs={12} sx={{ mb: 2 }}>
            {leftSidebar}
          </Grid>
        )}

        {/* Main Content Row */}
        {/* Left Sidebar - Desktop only */}
        <Grid item xs={12} md={3} lg={3} sx={{ 
          display: { xs: 'none', md: 'block' }
        }}>
          {!isMobile && leftSidebar}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6} lg={6}>
          {content}
        </Grid>

        {/* Right Sidebar - Desktop only */}
        <Grid item xs={12} md={3} lg={3} sx={{ 
          display: { xs: 'none', md: 'block' }
        }}>
          <Box sx={{ 
            position: 'sticky',
            top: '16px',
            height: 'auto'
          }}>
            {rightSidebar}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainLayout; 