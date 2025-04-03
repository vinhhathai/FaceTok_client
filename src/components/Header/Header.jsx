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
import { clearUser } from '../../redux/features/userSlice';

// Material UI Imports
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

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
import avatarFriend1 from "../../assets/images/users/user-6.png";
import avatarFriend2 from "../../assets/images/users/user-5.png";
import avatarGroup from "../../assets/images/groups/group-2.jpg";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  
  // Lấy thông tin người dùng từ Redux store
  const { id, profilePicture } = useSelector(state => state.user);
  
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    // Xóa cookie `accountInformation` và `accessToken`
    Cookies.remove("accountInformation", { path: "/" });
    Cookies.remove("accessToken", { path: "/" });
    
    // Xóa thông tin người dùng trong Redux store
    dispatch(clearUser());
    
    // Điều hướng đến trang đăng nhập
    navigate("/auth/login");
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
                <SearchForm
                  avatarFriend1={avatarFriend1}
                  avatarFriend2={avatarFriend2}
                  avatarGroup={avatarGroup}
                />
              </SearchContainer>
            )}
          </LogoContainer>

          {/* Actions and user profile */}
          <ActionsContainer>
            {/* Search form for small screens */}
            {isSmall && (
              <SearchContainer>
                <SearchForm
                  avatarFriend1={avatarFriend1}
                  avatarFriend2={avatarFriend2}
                  avatarGroup={avatarGroup}
                  isMobile={true}
                />
              </SearchContainer>
            )}
            
            {/* Action buttons */}
            <ActionButtonsContainer>
              <CreateNavbar />
              <MessagesDropdown messageIcon={message} avatarMessage={avatarMessage} />
              <NotificationsDropdown notificationIcon={notificationIcon} />
              <UserDropdown 
                id={id} 
                profilePicture={profilePicture} 
                handleLogout={handleLogout} 
              />
            </ActionButtonsContainer>
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Header;
