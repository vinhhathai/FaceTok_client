import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Paper,
  Card,
  CardContent,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from '../../../../shared/components/Header/Header';
import MainLayout from '../../../../shared/components/MainLayout/MainLayout';
import { fetchFriends, fetchReceivedFriendRequests, fetchSentFriendRequests } from '../../redux';
import FriendList from '../../components/FriendList/FriendList';
import FriendRequests from '../../components/FriendRequests/FriendRequests';
import SentRequestsList from '../../components/SentRequestsList/SentRequestsList';
import FriendSearch from '../../components/FriendSearch/FriendSearch';
import Sidebar from '../../../post/components/Sidebar/Sidebar';
import WeatherBar from '../../../../shared/components/WeatherBar';
import { FriendPageContainer } from './FriendPage.styles';
import { cancelFriendRequest } from '../../api/friendAPI';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friend-tabpanel-${index}`}
      aria-labelledby={`friend-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `friend-tab-${index}`,
    'aria-controls': `friend-tabpanel-${index}`,
  };
}

function FriendPage() {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { friends, receivedRequests, sentRequests } = useSelector((state) => state.friend);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Fetch friends and friend requests when component mounts
    dispatch(fetchFriends());
    dispatch(fetchReceivedFriendRequests());
    dispatch(fetchSentFriendRequests());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await cancelFriendRequest(requestId);
      if (response.success) {
        // Refresh the sent requests list
        dispatch(fetchSentFriendRequests());
      } else {
        alert(response.error?.message || "Không thể hủy lời mời kết bạn");
      }
    } catch (error) {
      alert("Đã xảy ra lỗi, vui lòng thử lại sau");
      console.error("Error cancelling friend request:", error);
    }
  };

  const contentSection = (
    <Card sx={{ p: 0 }}>
      <CardContent>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Bạn bè
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" gutterBottom sx={{ mb: 4 }}>
          Quản lý bạn bè và lời mời
        </Typography>

        <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="BẠN BÈ" {...a11yProps(0)} sx={{ 
              fontWeight: tabValue === 0 ? 'bold' : 'normal',
              color: tabValue === 0 ? 'primary.main' : 'text.secondary',
            }} />
            <Tab label={`LỜI MỜI (${receivedRequests.data.length || 0})`} {...a11yProps(1)} sx={{ 
              fontWeight: tabValue === 1 ? 'bold' : 'normal',
              color: tabValue === 1 ? 'primary.main' : 'text.secondary',
            }} />
            <Tab label={`ĐÃ GỬI (${sentRequests.data.length || 0})`} {...a11yProps(2)} sx={{ 
              fontWeight: tabValue === 2 ? 'bold' : 'normal',
              color: tabValue === 2 ? 'primary.main' : 'text.secondary',
            }} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <FriendSearch />
          <Box sx={{ mt: 4 }}>
            <FriendList 
              friends={friends.data} 
              loading={friends.isLoading}
              error={friends.error} 
            />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <FriendRequests 
            requests={receivedRequests.data}
            loading={receivedRequests.isLoading}
            error={receivedRequests.error} 
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SentRequestsList
            requests={sentRequests.data}
            loading={sentRequests.isLoading}
            error={sentRequests.error}
            onCancelRequest={handleCancelRequest}
          />
        </TabPanel>
      </CardContent>
    </Card>
  );

  return (
    <FriendPageContainer>
      <Header />
      <MainLayout 
        leftSidebar={<Sidebar />}
        content={contentSection}
        rightSidebar={<WeatherBar />}
        isMobile={isMobile}
        isFriendsTab={true}
      />
    </FriendPageContainer>
  );
}

export default FriendPage; 