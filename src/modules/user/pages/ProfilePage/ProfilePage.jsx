import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Tabs, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

// Components
import Header from "../../../../shared/components/Header/Header";
import MainLayout from "../../../../shared/components/MainLayout/MainLayout";
import WeatherBar from "../../../../shared/components/WeatherBar";
import UserInfo from '../../components/UserInfo/UserInfo';
import UserPosts from '../../components/UserPosts/UserPosts';
import UserGallery from '../../components/UserGallery/UserGallery';
import UserFriends from '../../components/UserFriends/UserFriends';
import UserAbout from '../../components/UserAbout';
import ProfileThumbnail from '../../components/ProfileThumbnail/ProfileThumbnail';

// Styles
import { 
  ProfileContainer, 
  LoadingContainer, 
  TabsContainer, 
  TabContentContainer, 
  TabPanelStyles 
} from './ProfilePage.styles';
import { fetchUserProfile, selectUserProfile, selectUserStatus, selectUserError } from '../../redux/slices/userSlice';

// Default images
const DEFAULT_AVATAR = '/assets/images/avatar_default.jpg';
const DEFAULT_COVER = 'https://artmin96.github.io/argon-social/assets/images/users/cover/cover-1.gif';

// Custom TabPanel
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      style={TabPanelStyles}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { userId } = useParams(); // Lấy userId từ URL
  const [tabValue, setTabValue] = useState(0);
  
  // Use Redux selectors to get profile data
  const userProfile = useSelector(state => selectUserProfile(state));
  const status = useSelector(state => selectUserStatus(state));
  const error = useSelector(state => selectUserError(state));

  // Check if the current tab is the friends tab
  const isFriendsTab = isMobile ? tabValue === 2 : tabValue === 3;

  useEffect(() => {
    // Fetch user profile when component mounts or userId changes
    if (userId) {
      dispatch(fetchUserProfile(userId));
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

  // Get the correct tab index based on mobile/desktop view
  const getTabIndex = (desktopIndex) => {
    if (!isMobile) return desktopIndex;
    // On mobile, skip the "Giới thiệu" tab (index 1)
    return desktopIndex < 1 ? desktopIndex : desktopIndex - 1;
  };

  // Profile Content component
  const ProfileContent = () => (
    <Box>
      <TabsContainer>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
  if (status === 'loading') {
    return (
      <>
        <Header />
        <LoadingContainer>
          <Typography>Đang tải thông tin người dùng...</Typography>
        </LoadingContainer>
      </>
    );
  }

  // Error state
  if (status === 'failed') {
    // Kiểm tra xem có phải lỗi cập nhật fullname không
    // Nếu là lỗi fullname thì vẫn hiển thị trang bình thường
    const isFullnameError = error && error.isFullnameError;
    
    if (!isFullnameError) {
      return (
        <>
          <Header />
          <LoadingContainer>
            <Typography color="error">
              {typeof error === 'object' ? (error.message || 'Có lỗi xảy ra khi tải thông tin người dùng') : error || 'Có lỗi xảy ra khi tải thông tin người dùng'}
            </Typography>
          </LoadingContainer>
        </>
      );
    }
    // Nếu là lỗi fullname, tiếp tục hiển thị trang bình thường
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