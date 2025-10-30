import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import Header from '@components/Header/Header';
import {
  RootBox,
  MainContentBox,
  ContentContainer,
  ContentPaper
} from './MessageLayout.styles';

/**
 * Layout component specifically designed for the messaging interface
 * Provides full height layout with header and focuses on maximizing chat area
 */
const MessageLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <RootBox>
      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <MainContentBox component="main" isMobile={isMobile}>
        <ContentContainer maxWidth="xl" isMobile={isMobile}>
          <ContentPaper isMobile={isMobile} elevation={isMobile ? 0 : 1}>
            {children}
          </ContentPaper>
        </ContentContainer>
      </MainContentBox>
    </RootBox>
  );
};

export default MessageLayout; 