import React from 'react';
import { Grid, Container, Box, useMediaQuery, useTheme } from '@mui/material';
import { 
  containerStyles, 
  gridContainerStyles, 
  leftSidebarStyles, 
  rightSidebarStyles, 
  rightSidebarBoxStyles 
} from './MainLayout.styles';

function MainLayout({ thumbnail, leftSidebar, content, rightSidebar, isMobile, isFriendsTab }) {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Determine if the left sidebar should be hidden
  // Hide it when: on mobile AND on the friends tab
  const hideLeftSidebar = isMobile && isFriendsTab;

  return (
    <Container maxWidth="xl" sx={containerStyles(isTabletOrMobile)}>
      <Grid container sx={gridContainerStyles(isTabletOrMobile)}>
        {/* Thumbnail Row (Optional) */}
        {thumbnail && (
          <Grid item xs={12}>
            {thumbnail}
          </Grid>
        )}

        {/* Main Content Row */}
        {/* Left Sidebar - Show on all devices except mobile friends page */}
        <Grid item xs={12} md={3} lg={3} sx={{ ...leftSidebarStyles(hideLeftSidebar), pr: { md: 2, lg: 3 } }}>
          {leftSidebar}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6} lg={6} sx={{ px: { md: 1, lg: 2 } }}>
          {content}
        </Grid>

        {/* Right Sidebar - Desktop only */}
        <Grid item xs={12} md={3} lg={3} sx={{ ...rightSidebarStyles, pl: { md: 2, lg: 3 } }}>
          <Box sx={rightSidebarBoxStyles}>
            {rightSidebar}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainLayout; 