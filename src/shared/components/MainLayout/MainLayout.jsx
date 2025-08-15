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
  const isMobileScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Use passed isMobile prop or auto-detect
  const shouldHideLeftSidebar = isMobile !== undefined ? isMobile : isMobileScreen;

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
        {/* Left Sidebar - Hidden on mobile, shown on tablet/desktop */}
        <Grid 
          item 
          xs={shouldHideLeftSidebar ? 0 : 12}
          md={3} 
          lg={3} 
          sx={{ 
            ...leftSidebarStyles(shouldHideLeftSidebar), 
            pr: { md: 1, lg: 1.5 },
            position: 'sticky',
            top: '80px',
            height: 'fit-content',
            // Ensure no space is taken on mobile
            width: shouldHideLeftSidebar ? 0 : 'auto',
            overflow: shouldHideLeftSidebar ? 'hidden' : 'visible'
          }}
        >
          {leftSidebar}
        </Grid>

        {/* Main Content */}
        <Grid 
          item 
          xs={12} 
          md={shouldHideLeftSidebar ? 9 : 6} 
          lg={shouldHideLeftSidebar ? 9 : 6} 
          sx={{ px: { md: 0.5, lg: 1 } }}
        >
          {content}
        </Grid>

        {/* Right Sidebar - Desktop only */}
        <Grid 
          item 
          xs={12} 
          md={3} 
          lg={3} 
          sx={{ 
            ...rightSidebarStyles, 
            pl: { md: 1, lg: 1.5 },
            position: 'sticky',
            top: '80px',
            height: 'fit-content'
          }}
        >
          <Box sx={rightSidebarBoxStyles}>
            {rightSidebar}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainLayout; 