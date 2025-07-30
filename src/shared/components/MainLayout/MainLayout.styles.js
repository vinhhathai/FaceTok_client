import { Box } from '@mui/material';

export const containerStyles = (isTabletOrMobile) => ({
  mt: isTabletOrMobile ? 0 : 3
});

export const gridContainerStyles = (isTabletOrMobile) => ({
  spacing: isTabletOrMobile ? 0 : 3
});

export const leftSidebarStyles = (hideLeftSidebar) => ({
  display: hideLeftSidebar ? 'none' : 'block'
});

export const rightSidebarStyles = {
  display: { xs: 'none', md: 'block' }
};

export const rightSidebarBoxStyles = {
  position: 'sticky',
  top: '16px',
  height: 'auto'
}; 