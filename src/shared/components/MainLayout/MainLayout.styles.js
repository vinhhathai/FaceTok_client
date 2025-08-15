import { Box } from '@mui/material';

export const containerStyles = (isTabletOrMobile) => ({
  mt: isTabletOrMobile ? 0 : 3,
  position: 'relative',
  minHeight: '100vh'
});

export const gridContainerStyles = (isTabletOrMobile) => ({
  spacing: isTabletOrMobile ? 0 : 3,
  alignItems: 'flex-start',
  minHeight: '100vh'
});

export const leftSidebarStyles = (hideLeftSidebar) => ({
  display: hideLeftSidebar ? 'none' : 'block'
});

export const rightSidebarStyles = {
  display: { xs: 'none', md: 'block' }
};

export const rightSidebarBoxStyles = {
  // Styles sẽ được áp dụng inline trong component
}; 