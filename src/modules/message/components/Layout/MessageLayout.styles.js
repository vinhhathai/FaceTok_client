import { styled } from '@mui/material/styles';
import { Box, Container, Paper } from '@mui/material';

// Container chính cho toàn bộ layout
export const RootBox = styled(Box)(({ theme }) => ({
  display: 'flex', 
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default
}));

// Main content area
export const MainContentBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})(({ theme, isMobile }) => ({
  flexGrow: 1,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: isMobile ? 0 : theme.spacing(2),
  paddingRight: isMobile ? 0 : theme.spacing(2),
  display: 'flex',
  overflow: 'hidden'
}));

// Container cho nội dung chính
export const ContentContainer = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})(({ theme, isMobile }) => ({
  paddingLeft: isMobile ? 0 : theme.spacing(2),
  paddingRight: isMobile ? 0 : theme.spacing(2),
  height: `calc(100vh - ${theme.spacing(8)})`,
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    height: `calc(100vh - ${theme.spacing(7)})`, // Giảm chiều cao cho mobile
    paddingTop: 0,
    paddingBottom: 0
  }
}));

// Paper bao quanh nội dung
export const ContentPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})(({ theme, isMobile }) => ({
  height: '100%', 
  overflow: 'hidden',
  borderRadius: isMobile ? 0 : theme.shape.borderRadius * 2
}));

// Đặt elevation thông qua props
ContentPaper.defaultProps = {
  elevation: 0
}; 