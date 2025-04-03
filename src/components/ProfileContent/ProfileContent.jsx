import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CreatePost from "../CreatingPost/CreatingPost";
import ProfileAbout from "../ProfileAbout/ProfileAbout";
import Post from "../Post/Post";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts, clearUserPosts } from "../../redux/features/postSlice";

import {
  ProfileContentContainer,
  NavigationTabs,
  StyledTab,
  ContentWrapper,
  TabPanel,
  PostsContainer,
  LoadMoreButton,
  EmptyStateContainer
} from './styles';

function TabPanelContent(props) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </TabPanel>
  );
}

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

function ProfileContent({ profile, loading, error }) {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const { id } = useParams();
  
  const { 
    userPosts, 
    userPostsPage, 
    userPostsTotalPages, 
    isLoadingUserPosts, 
    userPostsError 
  } = useSelector((state) => state.posts);

  // Load user posts when component mounts or when user ID changes
  useEffect(() => {
    if (id && value === 0) {
      dispatch(fetchUserPosts({ userId: id }));
    }
    
    // Clean up posts when unmounting
    return () => {
      dispatch(clearUserPosts());
    };
  }, [dispatch, id, value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    
    // Load posts data if selecting timeline tab
    if (newValue === 0 && id) {
      dispatch(fetchUserPosts({ userId: id }));
    }
  };

  // Load more posts
  const handleLoadMore = () => {
    if (id && userPostsPage < userPostsTotalPages) {
      dispatch(fetchUserPosts({ 
        userId: id, 
        page: userPostsPage + 1 
      }));
    }
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <ProfileContentContainer sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </ProfileContentContainer>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <ProfileContentContainer>
        <Typography color="error" variant="body1" sx={{ p: 3, textAlign: 'center' }}>
          {error}
        </Typography>
      </ProfileContentContainer>
    );
  }

  return (
    <ProfileContentContainer>
      {/* CreatePost component */}
      <CreatePost />
      
      {/* Tabs Navigation */}
      <NavigationTabs
        value={value}
        onChange={handleChange}
        aria-label="profile navigation tabs"
        variant="fullWidth"
      >
        <StyledTab label="Timeline" {...a11yProps(0)} />
        <StyledTab label="About" {...a11yProps(1)} />
        <StyledTab label="Friends" {...a11yProps(2)} />
        <StyledTab label="Media" {...a11yProps(3)} />
      </NavigationTabs>

      {/* Tab Content */}
      <ContentWrapper>
        <TabPanelContent value={value} index={0}>
          {isLoadingUserPosts && userPosts.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : userPostsError ? (
            <Typography color="error" variant="body1" sx={{ p: 3, textAlign: 'center' }}>
              {userPostsError}
            </Typography>
          ) : userPosts.length === 0 ? (
            <EmptyStateContainer>
              <Typography variant="body1" color="textSecondary">
                Không có bài viết nào để hiển thị.
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Hãy tạo bài viết đầu tiên của bạn!
              </Typography>
            </EmptyStateContainer>
          ) : (
            <>
              <PostsContainer>
                {userPosts.map((post) => (
                  <Post 
                    key={post._id} 
                    post={{
                      userImage: post.author?.profilePicture,
                      userName: post.author?.fullName,
                      time: new Date(post.createdAt).toLocaleDateString('vi-VN'),
                      content: post.content || post.caption,
                      image: post.media && post.media.length > 0 ? post.media[0].url : null,
                      likeCount: post.likesCount || 0,
                      commentCount: post.commentsCount || 0
                    }} 
                  />
                ))}
              </PostsContainer>
              
              {userPostsPage < userPostsTotalPages && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 3 }}>
                  <LoadMoreButton 
                    onClick={handleLoadMore}
                    disabled={isLoadingUserPosts}
                    variant="outlined"
                  >
                    {isLoadingUserPosts ? 'Đang tải...' : 'Tải thêm'}
                  </LoadMoreButton>
                </Box>
              )}
            </>
          )}
        </TabPanelContent>
        
        <TabPanelContent value={value} index={1}>
          <ProfileAbout profile={profile} />
        </TabPanelContent>
        
        <TabPanelContent value={value} index={2}>
          <Typography variant="body1">Friends content here...</Typography>
        </TabPanelContent>
        
        <TabPanelContent value={value} index={3}>
          <Typography variant="body1">Media content here...</Typography>
        </TabPanelContent>
      </ContentWrapper>
    </ProfileContentContainer>
  );
}

export default ProfileContent;
