import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tab, Tabs, Typography } from '@mui/material';
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
  const dispatch = useDispatch();
  const { userId } = useParams(); // Lấy userId từ URL
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Dữ liệu mẫu (sẽ được thay thế bằng dữ liệu từ Redux sau này)
  const userProfile = {
    id: userId || '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://via.placeholder.com/150',
    coverPhoto: 'https://via.placeholder.com/1200x300',
    bio: 'Đây là thông tin giới thiệu của tôi',
    location: 'Hà Nội, Việt Nam',
    education: 'Đại học XYZ',
    work: 'Công ty ABC',
    email: 'nguyenvana@gmail.com',
    birthday: '01/01/1990',
    relationship: 'Độc thân',
    website: 'https://nguyenvana.com',
    interests: 'Đọc sách, xem phim, du lịch',
    followerCount: 1250,
    followingCount: 356,
    postCount: 127,
    isCurrentUser: true,
    isFriend: false,
  };

  useEffect(() => {
    // Sẽ dispatch action để lấy thông tin user từ API
    // dispatch(getUserProfile(userId));
    
    // Giả lập loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userId, dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            <Tab label="Giới thiệu" {...a11yProps(1)} />
            <Tab label="Hình ảnh" {...a11yProps(2)} />
            <Tab label="Bạn bè" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <TabContentContainer>
          <TabPanel value={tabValue} index={0}>
            <UserPosts userId={userId || '1'} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <UserAbout user={userProfile} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <UserGallery userId={userId || '1'} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <UserFriends userId={userId || '1'} />
          </TabPanel>
        </TabContentContainer>
      </TabsContainer>
    </Box>
  );

  if (loading) {
    return (
      <>
        <Header />
        <LoadingContainer>
          <Typography>Đang tải thông tin người dùng...</Typography>
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
      />
    </ProfileContainer>
  );
};

export default ProfilePage; 