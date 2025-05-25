import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import {
  StyledAppBar,
  StyledToolbar,
  LogoContainer,
  ActionsContainer,
  SearchContainer,
  ActionButtonsContainer,
  logoStyles,
  searchBoxStyles,
  iconButtonStyles,
  iconStyles,
  avatarStyles
} from './Header.styles';
import Logo from '../Logo/Logo';

function Header() {
  const navigate = useNavigate();
  
  // For now, we'll use a placeholder header with minimal functionality
  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          {/* Logo */}
          <LogoContainer>
            <Box component={Link} to="/" sx={logoStyles}>
              <Logo size="small" showText={false}/>
            </Box>
          </LogoContainer>

          {/* Actions and user profile */}
          <ActionsContainer>
            {/* Search form */}
            <SearchContainer>
              <Box sx={searchBoxStyles}>Tìm kiếm</Box>
            </SearchContainer>
            
            {/* Action buttons */}
            <ActionButtonsContainer>
              <Tooltip title="Trang chủ">
                <IconButton
                  onClick={() => navigate('/')}
                  sx={iconButtonStyles}
                >
                  <HomeOutlinedIcon sx={iconStyles} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Bạn bè">
                <IconButton
                  onClick={() => navigate('/friends')}
                  sx={iconButtonStyles}
                >
                  <Badge badgeContent={0} color="error">
                    <PeopleAltOutlinedIcon sx={iconStyles} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Tin nhắn">
                <IconButton sx={iconButtonStyles}>
                  <Badge badgeContent={0} color="error">
                    <ChatOutlinedIcon sx={iconStyles} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Thông báo">
                <IconButton sx={iconButtonStyles}>
                  <Badge badgeContent={0} color="error">
                    <NotificationsOutlinedIcon sx={iconStyles} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User avatar - placeholder */}
              <Box sx={avatarStyles}>
                U
              </Box>
            </ActionButtonsContainer>
          </ActionsContainer>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Header; 