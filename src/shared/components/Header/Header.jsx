import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  StyledAppBar,
  StyledToolbar,
  LogoContainer,
  ActionsContainer,
  SearchContainer,
  SearchIconWrapper,
  StyledInputBase,
  ActionButtonsContainer,
  LeftSectionContainer,
  logoStyles,
  iconButtonStyles,
  iconStyles,
  avatarStyles
} from './Header.styles';
import Logo from '../Logo/Logo';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../modules/auth/redux/slices/authSlice';

const Header = () => {
  // Theme and responsive hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  
  // Handle menu
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // Handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    handleCloseMenu();
    navigate('/login');
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    handleCloseMenu();
  };
  
  // Determine if menu is open
  const isMenuOpen = Boolean(anchorEl);
  
  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl" disableGutters={isMobile}>
        <StyledToolbar disableGutters>
          {/* Left section - Logo and Search */}
          <LeftSectionContainer>
            {/* Logo */}
            <LogoContainer>
              <Box component={Link} to="/home" sx={logoStyles}>
                <Logo size={isMobile ? "small" : "small"} showText={true} />
              </Box>
            </LogoContainer>

            {/* Search form */}
            <SearchContainer component="form" onSubmit={handleSearchSubmit}>
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Tìm kiếm người dùng"
                inputProps={{ 'aria-label': 'tìm kiếm' }}
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
              />
            </SearchContainer>
          </LeftSectionContainer>

          {/* Actions and user profile */}
          <ActionsContainer>
            <ActionButtonsContainer>
              {/* Navigation icons */}
              <Tooltip title="Trang chủ">
                <IconButton 
                  component={Link} 
                  to="/home"
                  sx={iconButtonStyles}
                >
                  <HomeOutlinedIcon sx={iconStyles} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Bạn bè">
                <IconButton 
                  component={Link} 
                  to="/friends"
                  sx={iconButtonStyles}
                >
                  <Badge badgeContent={3} color="error">
                    <PeopleAltOutlinedIcon sx={iconStyles} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {isDesktop && (
                <Tooltip title="Nhóm">
                  <IconButton 
                    component={Link} 
                    to="/groups"
                    sx={iconButtonStyles}
                  >
                    <GroupsOutlinedIcon sx={iconStyles} />
                  </IconButton>
                </Tooltip>
              )}
              
              <Tooltip title="Tin nhắn">
                <IconButton 
                  component={Link} 
                  to="/messages"
                  sx={iconButtonStyles}
                >
                  <Badge badgeContent={5} color="error">
                    <ChatOutlinedIcon sx={iconStyles} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Thông báo">
                <IconButton 
                  sx={iconButtonStyles}
                >
                  <Badge badgeContent={2} color="error">
                    <NotificationsOutlinedIcon sx={iconStyles} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* User profile menu */}
              <IconButton
                onClick={handleOpenMenu}
                size="small"
                aria-controls={isMenuOpen ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
              >
                <Avatar 
                  alt={user?.fullName || "User"} 
                  src={user?.profilePicture || "/images/avatars/default.jpg"}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </ActionButtonsContainer>
            
            {/* Profile dropdown menu */}
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={isMenuOpen}
              onClose={handleCloseMenu}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 200,
                  borderRadius: '8px',
                  mt: 1.5,
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleNavigate(`/profile/${user?._id}`)}>
                <ListItemIcon>
                  <PersonOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Trang cá nhân" />
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
              </MenuItem>
            </Menu>
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 