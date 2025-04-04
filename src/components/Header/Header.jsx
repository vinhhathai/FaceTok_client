import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
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
  ActionButtonsContainer
} from './styles';

// Import icons
import message from "../../assets/images/icons/navbar/message.png";
import notificationIcon from "../../assets/images/icons/navbar/notification.png";
import avatarMessage from "../../assets/images/users/user-6.png";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector(state => state.user?.user);
  const isAuthenticated = useSelector(state => state.user?.isAuthenticated);
  
  // Get friend requests safely
  const friends = useSelector(state => state.friends || {});
  const friendRequests = friends.friendRequests || { received: [] };
  const requestCount = friendRequests.received?.length || 0;
  
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
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 123, 255, 0.15)',
                    },
                    mr: 1
                  }}
                >
                  <HomeIcon sx={{ fontSize: 26 }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Bạn bè">
                <IconButton
                  onClick={handleNavigateFriends}
                  sx={{
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 123, 255, 0.15)',
                    },
                    mr: 1
                  }}
                >
                  <Badge badgeContent={requestCount} color="error">
                    <PeopleIcon sx={{ fontSize: 26 }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <CreateNavbar />
              <MessagesDropdown messageIcon={message} avatarMessage={avatarMessage} />
              <NotificationsDropdown notificationIcon={notificationIcon} />
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
