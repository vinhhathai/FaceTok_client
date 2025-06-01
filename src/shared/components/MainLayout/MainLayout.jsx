import React from 'react';
import { Grid, Container, Box, useMediaQuery, useTheme } from '@mui/material';

function MainLayout({ thumbnail, leftSidebar, content, rightSidebar, isMobile, isFriendsTab }) {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Determine if the left sidebar should be hidden
  // Hide it when: on mobile AND on the friends tab
  const hideLeftSidebar = isMobile && isFriendsTab;

  return (
    <Container maxWidth="xl" sx={{ mt: isTabletOrMobile ? 0 : 3 }}>
      <Grid container spacing={isTabletOrMobile ? 0 : 3}>
        {/* Thumbnail Row (Optional) */}
        {thumbnail && (
          <Grid item xs={12}>
            {thumbnail}
          </Grid>
        )}

        {/* Main Content Row */}
        {/* Left Sidebar - Show on all devices except mobile friends page */}
        <Grid item xs={12} md={3} lg={3} sx={{ 
          display: hideLeftSidebar ? 'none' : 'block'
        }}>
          {leftSidebar}
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