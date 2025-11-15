import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListItemText, Divider, Box, Chip, CircularProgress } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailIcon from '@mui/icons-material/Email';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  SidebarContainer,
  SidebarCard,
  SidebarList,
  ItemListItem,
  ItemListItemButton,
  ItemListItemIcon,
  StyledBadge,
  comingSoonBadgeStyles
} from './Sidebar.styles';

// Main navigation items with Material-UI icons
const mainItems = [
  { text: 'Messages', icon: <EmailIcon color="primary" />, to: '/messages' },
  { text: 'Find Friends', icon: <PeopleAltIcon style={{ color: '#f0a04b' }} />, to: '/friends' },
];

// Additional items
const additionalItems = [
  { 
    text: 'Game', 
    icon: <SportsEsportsIcon style={{ color: '#8e44ad' }} />, 
    action: 'game'
  },
  { 
    text: 'Kho nhạc', 
    icon: <LibraryMusicIcon style={{ color: '#e91e63' }} />, 
    to: '#', 
    comingSoon: true 
  },
  { 
    text: 'Cửa hàng vật phẩm', 
    icon: <StorefrontIcon style={{ color: '#ff9800' }} />, 
    to: '#', 
    comingSoon: true 
  },
  // { text: 'Saved', icon: <BookmarkBorderOutlinedIcon style={{ color: '#3f8cb8' }} />, to: '/saved' },
  // { text: 'Videos', icon: <VideoCameraBackOutlinedIcon style={{ color: '#e74c3c' }} />, to: '/videos' },
  // { text: 'Events', icon: <EventNoteOutlinedIcon style={{ color: '#9b59b6' }} />, to: '/events' },
];

function Sidebar() {
  const navigate = useNavigate();
  const [isGameLoading, setIsGameLoading] = useState(false);

  const handleGameClick = () => {
    setIsGameLoading(true);
    // Add small delay for visual feedback
    setTimeout(() => {
      navigate('/games');
      // Reset loading after navigation (will be unmounted anyway)
      setIsGameLoading(false);
    }, 300);
  };

  const handleItemClick = (item) => {
    if (item.action === 'game') {
      handleGameClick();
    }
  };

  return (
    <SidebarContainer>
      <SidebarCard>
        <SidebarList>
          <ItemListItem disablePadding>
            <ItemListItemButton component={Link} to="/home">
              <ItemListItemIcon>
                <HomeIcon color="primary" />
              </ItemListItemIcon>
              <ListItemText primary="Home" sx={{ '& .MuiTypography-root': { fontWeight: 'bold' } }} />
            </ItemListItemButton>
          </ItemListItem>

          {mainItems.map((item, index) => (
            <ItemListItem key={index} disablePadding>
              <ItemListItemButton 
                component={Link} 
                to={item.to}
              >
                <ItemListItemIcon>
                  {item.icon}
                </ItemListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: 1 }} />
                {item.count !== undefined && (
                  <StyledBadge badgeContent={item.count} sx={{ mr: 1 }} />
                )}
                <ChevronRightIcon color="action" fontSize="small" />
              </ItemListItemButton>
            </ItemListItem>
          ))}
          
          <Divider sx={{ my: 2, mx: 2 }} />
          
          {additionalItems.map((item, index) => (
            <ItemListItem key={index} disablePadding>
              <ItemListItemButton 
                component={item.comingSoon ? 'div' : (item.action ? 'div' : Link)} 
                to={item.comingSoon || item.action ? undefined : item.to}
                onClick={item.action ? () => handleItemClick(item) : undefined}
                disabled={item.action === 'game' && isGameLoading}
                sx={{ 
                  cursor: (item.comingSoon && !item.action) ? 'default' : 'pointer',
                  '&:hover': (item.comingSoon && !item.action) ? {} : undefined
                }}
              >
                <ItemListItemIcon>
                  {item.action === 'game' && isGameLoading ? (
                    <CircularProgress size={24} sx={{ color: '#8e44ad' }} />
                  ) : (
                    item.icon
                  )}
                </ItemListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.text}
                      {item.comingSoon && (
                        <Box
                          component="span"
                          sx={comingSoonBadgeStyles}
                        >
                          Sắp ra mắt
                        </Box>
                      )}
                    </Box>
                  } 
                  sx={{ opacity: 1 }} 
                />
                {!item.comingSoon && !item.action && <ChevronRightIcon color="action" fontSize="small" />}
                {item.action === 'game' && !isGameLoading && <ChevronRightIcon color="action" fontSize="small" />}
                {item.action !== 'game' && item.action && <ChevronRightIcon color="action" fontSize="small" />}
              </ItemListItemButton>
            </ItemListItem>
          ))}
        </SidebarList>
      </SidebarCard>
    </SidebarContainer>
  );
}

export default Sidebar; 