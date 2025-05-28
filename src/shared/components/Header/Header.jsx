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

import { useSelector } from 'react-redux';

function Header() {

  const user = useSelector(state => state.auth);
  console.log(user);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery('(max-width:360px)');
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleGroupsClick = () => {
    console.log('Navigate to groups');
    // Implement navigation to groups page
    // navigate('/groups');
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    // Sử dụng ID người dùng hiện tại từ Redux store (giả định)
    // Trong ứng dụng thực tế, ID sẽ được lấy từ Redux state
    const currentUserId = '1'; // Tạm thời sử dụng ID cố định
    navigate(`/profile/${currentUserId}`);
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    console.log('Logging out...');
    // Implement logout functionality
    // dispatch(logout());
    handleMenuClose();
  };

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
            {/* Action buttons */}
            <ActionButtonsContainer>
              <Tooltip title="Trang chủ">
                <IconButton
                  onClick={() => navigate('/')}
                  sx={iconButtonStyles(theme)}
                  aria-label="Trang chủ"
                >
                  <HomeOutlinedIcon sx={iconStyles(theme)} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Bạn bè">
                <IconButton
                  onClick={() => navigate('/friends')}
                  sx={iconButtonStyles(theme)}
                  aria-label="Bạn bè"
                >
                  <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: isMobile ? 8 : 11, padding: isMobile ? '0 3px' : undefined } }}>
                    <PeopleAltOutlinedIcon sx={iconStyles(theme)} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Nhóm">
                <IconButton
                  onClick={handleGroupsClick}
                  sx={iconButtonStyles(theme)}
                  aria-label="Nhóm"
                >
                  <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: isMobile ? 8 : 11, padding: isMobile ? '0 3px' : undefined } }}>
                    <GroupsOutlinedIcon sx={iconStyles(theme)} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Tin nhắn">
                <IconButton 
                  sx={iconButtonStyles(theme)}
                  aria-label="Tin nhắn"
                >
                  <Badge badgeContent={5} color="error" sx={{ '& .MuiBadge-badge': { fontSize: isMobile ? 8 : 11, padding: isMobile ? '0 3px' : undefined } }}>
                    <ChatOutlinedIcon sx={iconStyles(theme)} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Thông báo">
                <IconButton 
                  sx={iconButtonStyles(theme)}
                  aria-label="Thông báo"
                >
                  <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: isMobile ? 8 : 11, padding: isMobile ? '0 3px' : undefined } }}>
                    <NotificationsOutlinedIcon sx={iconStyles(theme)} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User avatar */}
              <Box
                sx={{
                  ...avatarStyles,
                  '&:hover': {
                    cursor: 'pointer',
                    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
                  }
                }}
                onClick={handleAvatarClick}
                aria-controls={open ? 'profile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                U
              </Box>

              {/* User Menu */}
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'avatar-button',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    minWidth: 200,
                    mt: 1,
                    '& .MuiMenuItem-root': {
                      py: 1,
                    }
                  }
                }}
              >
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 40, height: 40, mr: 1.5, bgcolor: 'primary.main' }}>U</Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Nguyễn Văn A</Typography>
                    <Typography variant="body2" color="text.secondary">nguyenvana@gmail.com</Typography>
                  </Box>
                </Box>

                <Divider />

                <MenuItem onClick={handleProfileClick}>
                  <ListItemIcon>
                    <PersonOutlineIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Trang cá nhân" />
                </MenuItem>
                
                <MenuItem onClick={handleLogoutClick}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Đăng xuất" />
                </MenuItem>
              </Menu>
            </ActionButtonsContainer>
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Header; 