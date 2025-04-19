import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import LogoHeader from "../../components/LogoHeader/LogoHeader";
import SearchForm from "../../components/Search/SearchForm/SearchForm";
import CreateNavbar from "../Create/CreateNavbar/CreateNavbar";
import UserDropdown from "../../components/UserDropdown/UserDropdown";
import MessagesDropdown from "../../components/MessagesDropdown/MessagesDropdown";
import NotificationsDropdown from "../../components/NotificationsDropdown/NotificationsDropdown";
import { useSelector, useDispatch } from 'react-redux';
import { clearUserData } from '../../redux/features/userSlice';

// Material UI Imports
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';

// Import styled components
import {
  StyledAppBar,
  StyledToolbar,
  LogoContainer,
  ActionsContainer,
  SearchContainer,
  ActionButtonsContainer,
  IconAvatar
} from './styles';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector(state => state.user?.user);
  const isAuthenticated = useSelector(state => state.user?.isAuthenticated);
  
  // Debug user authentication state
  useEffect(() => {
    console.log("Header Component - Auth State:", { isAuthenticated, user });
  }, [isAuthenticated, user]);
  
  // Get friend requests safely
  const friends = useSelector(state => state.friends || {});
  const friendRequests = friends.friendRequests || { received: [] };
  const requestCount = friendRequests.received?.length || 0;
  
  // Log notification data from Redux store for debugging
  const notificationState = useSelector(state => state.notifications);
  console.log("Current notification state:", notificationState);
  
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    // Xóa cookie `accountInformation` và `accessToken`
    Cookies.remove("accountInformation", { path: "/" });
    Cookies.remove("accessToken", { path: "/" });
    
    // Xóa thông tin người dùng trong Redux store
    dispatch(clearUserData());
    
    // Điều hướng đến trang đăng nhập
    navigate("/auth/login");
  };

  const handleNavigateHome = () => {
    navigate("/");
  };
  
  const handleNavigateFriends = () => {
    navigate("/friends");
  };

  return (
    <StyledAppBar elevation={2}>
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          {/* Logo */}
          <LogoContainer>
            <LogoHeader />
            {!isSmall && (
              <SearchContainer>
                <SearchForm isMobile={false} />
              </SearchContainer>
            )}
          </LogoContainer>

          {/* Actions and user profile */}
          <ActionsContainer>
            {/* Search form for small screens */}
            {isSmall && (
              <SearchContainer>
                <SearchForm isMobile={true} />
              </SearchContainer>
            )}
            
            {/* Action buttons */}
            <ActionButtonsContainer>
              <Tooltip title="Trang chủ">
                <IconButton
                  onClick={handleNavigateHome}
                  sx={{
                    mr: 1
                  }}
                >
                  <HomeOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Bạn bè">
                <IconButton
                  onClick={handleNavigateFriends}
                  sx={{
                    mr: 1
                  }}
                >
                  <Badge badgeContent={requestCount} color="error">
                    <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <CreateNavbar />
              <MessagesDropdown messageIcon={<ChatOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />} />
              <NotificationsDropdown notificationIcon={<NotificationsOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />} />
              {isAuthenticated && user && (
                <UserDropdown 
                  id={user._id} 
                  profilePicture={user.profilePicture} 
                  handleLogout={handleLogout} 
                />
              )}
            </ActionButtonsContainer>
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Header;
