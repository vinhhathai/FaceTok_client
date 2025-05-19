import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1]
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(0, 2),
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    flex: 1,
  }
}));

const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 2),
  [theme.breakpoints.down('md')]: {
    margin: theme.spacing(0, 1),
  }
}));

const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center'
}));

function Header() {
  const navigate = useNavigate();
  
  // For now, we'll use a placeholder header with minimal functionality
  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <StyledToolbar disableGutters>
          {/* Logo */}
          <LogoContainer>
            <Box component={Link} to="/" sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold', 
              typography: 'h6',
              textDecoration: 'none'
            }}>
              Chaotok
            </Box>
          </LogoContainer>

          {/* Actions and user profile */}
          <ActionsContainer>
            {/* Search form */}
            <SearchContainer>
              <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: '4px 12px' }}>Tìm kiếm</Box>
            </SearchContainer>
            
            {/* Action buttons */}
            <ActionButtonsContainer>
              <Tooltip title="Trang chủ">
                <IconButton
                  onClick={() => navigate('/')}
                  sx={{ mr: 1 }}
                >
                  <HomeOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Bạn bè">
                <IconButton
                  onClick={() => navigate('/friends')}
                  sx={{ mr: 1 }}
                >
                  <Badge badgeContent={0} color="error">
                    <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Tin nhắn">
                <IconButton sx={{ mr: 1 }}>
                  <Badge badgeContent={0} color="error">
                    <ChatOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Thông báo">
                <IconButton sx={{ mr: 1 }}>
                  <Badge badgeContent={0} color="error">
                    <NotificationsOutlinedIcon sx={{ fontSize: 28, color: '#616161' }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User avatar - placeholder */}
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
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