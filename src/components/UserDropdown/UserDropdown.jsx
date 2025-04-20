import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { UserAvatar, UserButton } from './styles';

const UserDropdown = ({ id, profilePicture, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // Debug props received
  useEffect(() => {
    console.log("UserDropdown props:", { id, profilePicture });
  }, [id, profilePicture]);
  
  const handleClick = (event) => {
    console.log("Dropdown button clicked", event.currentTarget);
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    console.log("Closing dropdown menu");
    setAnchorEl(null);
  };

  // Nếu id bị undefined, hiển thị chỉ avatar với indicator
  if (!id) {
    console.log("UserDropdown: ID is undefined, showing loading state");
    return (
      <UserButton
        color="inherit"
        disabled
      >
        <UserAvatar 
          src={"/assets/images/avatar_default.jpg"}
          alt="Loading user profile"
        >
          <CircularProgress size={24} />
        </UserAvatar>
      </UserButton>
    );
  }

  return (
    <Box sx={{ position: 'relative', zIndex: 1000 }}>
      <UserButton
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
        sx={{ 
          p: 0.5, 
          border: '1px solid transparent',
          '&:hover': {
            border: '1px solid rgba(25, 118, 210, 0.2)',
            backgroundColor: 'rgba(25, 118, 210, 0.04)'
          },
          '&:active': {
            backgroundColor: 'rgba(25, 118, 210, 0.1)'
          }
        }}
      >
        <UserAvatar 
          src={profilePicture || "/assets/images/avatar_default.jpg"}
          alt="User profile"
        />
      </UserButton>
      
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 3,
          sx: { 
            minWidth: 180,
            mt: 1,
            borderRadius: 1,
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          backdrop: {
            invisible: false,
          },
        }}
      >
        <MenuItem component={Link} to={`/profile/${id}`} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">Profile</Typography>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography variant="body2">Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserDropdown;