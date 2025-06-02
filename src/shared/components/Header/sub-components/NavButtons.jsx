import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  iconButtonStyles,
  iconStyles,
  badgeStyle
} from '../Header.styles';

const NavButtons = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGroupsClick = () => {
    console.log('Navigate to groups');
    // Implement navigation to groups page
    // navigate('/groups');
  };

  return (
    <>
      <Tooltip title="Trang chủ">
        <IconButton
          onClick={() => navigate('/home')}
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
          <Badge badgeContent={3} color="error" sx={badgeStyle(isMobile)}>
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
          <Badge badgeContent={2} color="error" sx={badgeStyle(isMobile)}>
            <GroupsOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Tin nhắn">
        <IconButton 
          onClick={() => navigate('/messages')}
          sx={iconButtonStyles(theme)}
          aria-label="Tin nhắn"
        >
          <Badge badgeContent={5} color="error" sx={badgeStyle(isMobile)}>
            <ChatOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Thông báo">
        <IconButton 
          sx={iconButtonStyles(theme)}
          aria-label="Thông báo"
        >
          <Badge badgeContent={2} color="error" sx={badgeStyle(isMobile)}>
            <NotificationsOutlinedIcon sx={iconStyles(theme)} />
          </Badge>
        </IconButton>
      </Tooltip>
    </>
  );
};

export default NavButtons; 