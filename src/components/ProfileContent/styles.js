import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export const ProfileContentContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(0, 2),
  [theme.breakpoints.up('md')]: {
    maxWidth: 800,
  },
}));

export const NavigationTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
  '& .MuiTabs-flexContainer': {
    justifyContent: 'space-around',
  },
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 3,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 16,
  minWidth: 0,
  padding: theme.spacing(1.5, 2),
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:hover': {
    color: theme.palette.primary.main,
    opacity: 0.8,
  },
}));

export const ContentWrapper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 0),
  '&[hidden]': {
    display: 'none',
  },
})); 