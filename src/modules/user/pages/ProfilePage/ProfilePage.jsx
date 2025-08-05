import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tabs, Tab, CircularProgress, Typography, useTheme, useMediaQuery } from '@mui/material';
import { toast } from 'react-toastify';

// Components
import Header from '@components/Header/Header';
import MainLayout from '@components/MainLayout/MainLayout';
import { fetchUserProfile, selectUserProfile } from '@user/redux';
import ProfileThumbnail from '@user/components/ProfileThumbnail/ProfileThumbnail';
import UserInfo from '@user/components/UserInfo/UserInfo';
import UserPosts from '@user/components/UserPosts/UserPosts';
import UserAbout from '@user/components/UserAbout/UserAbout';
import UserGallery from '@user/components/UserGallery/UserGallery';
import UserFriends from '@user/components/UserFriends/UserFriends';
import WeatherBar from '@components/WeatherBar/WeatherBar';
import { 
  ProfileContainer, 
  LoadingContainer, 
  TabsContainer, 
  TabContentContainer 
} from './ProfilePage.styles';

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
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
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const location = useLocation();
  const userId = location.state?.userId; // Ưu tiên lấy từ URL, fallback lấy từ state
  const [tabValue, setTabValue] = useState(0);
  
  // Local states thay vì Redux loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use Redux selectors to get profile data
  const userProfile = useSelector((state) => selectUserProfile(state));

  // Check if the current tab is the friends tab
  const isFriendsTab = isMobile ? tabValue === 2 : tabValue === 3;

  useEffect(() => {
    // Fetch user profile when component mounts or userId changes
    if (userId) {
      setLoading(true);
      setError(null);
      
      dispatch(fetchUserProfile(userId))
        .unwrap()
        .catch(error => {
          console.error('Failed to fetch user profile:', error);
          setError('Không thể tải thông tin người dùng');
          toast.error('Không thể tải thông tin người dùng');
        })
        .finally(() => setLoading(false));
    }
  }, [userId, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Adjust tab value when switching between mobile and desktop
  useEffect(() => {
    // If on mobile and current tab is "Giới thiệu" (index 1), switch to "Bài viết" (index 0)
    if (isMobile && tabValue === 1) {
      setTabValue(0);
    }
  }, [isMobile, tabValue]);

  // Profile Content component
  const ProfileContent = () => (
    <Box>
      <TabsContainer>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
            variant="fullWidth"
          >
            <Tab label="Bài viết" {...a11yProps(0)} />
            {!isMobile && <Tab label="Giới thiệu" {...a11yProps(1)} />}
            <Tab label="File đa phương tiện" {...a11yProps(isMobile ? 1 : 2)} />
            <Tab label="Bạn bè" {...a11yProps(isMobile ? 2 : 3)} />
          </Tabs>
        </Box>

        <TabContentContainer>
          <TabPanel value={tabValue} index={0}>
            <UserPosts userId={userId} />
          </TabPanel>

          {!isMobile && (
            <TabPanel value={tabValue} index={1}>
              <UserAbout user={userProfile} />
            </TabPanel>
          )}

          <TabPanel value={tabValue} index={isMobile ? 1 : 2}>
            <UserGallery userId={userId} />
          </TabPanel>

          <TabPanel value={tabValue} index={isMobile ? 2 : 3}>
            <UserFriends userId={userId} />
          </TabPanel>
        </TabContentContainer>
      </TabsContainer>
    </Box>
  );

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <LoadingContainer>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Đang tải thông tin người dùng...</Typography>
        </LoadingContainer>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <LoadingContainer>
          <Typography color="error">
            {error}
          </Typography>
        </LoadingContainer>
      </>
    );
  }

  // Profile not found or no data
  if (!userProfile) {
    return (
      <>
        <Header />
        <LoadingContainer>
          <Typography>Không tìm thấy thông tin người dùng</Typography>
        </LoadingContainer>
      </>
    );
  }

  return (
    <ProfileContainer>
      <Header />
      <MainLayout
        thumbnail={<ProfileThumbnail user={userProfile} />}
        leftSidebar={<UserInfo user={userProfile} />}
        content={<ProfileContent />}
        rightSidebar={<WeatherBar />}
        isMobile={isMobile}
        isFriendsTab={isFriendsTab}
      />
    </ProfileContainer>
  );
};

export default ProfilePage;
