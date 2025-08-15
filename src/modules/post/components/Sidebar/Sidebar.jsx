import React from 'react';
import { Link } from 'react-router-dom';
import { ListItemText, Divider, Box } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailIcon from '@mui/icons-material/Email';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
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
    to: '#', 
    comingSoon: true 
  },
  // { text: 'Saved', icon: <BookmarkBorderOutlinedIcon style={{ color: '#3f8cb8' }} />, to: '/saved' },
  // { text: 'Videos', icon: <VideoCameraBackOutlinedIcon style={{ color: '#e74c3c' }} />, to: '/videos' },
  // { text: 'Events', icon: <EventNoteOutlinedIcon style={{ color: '#9b59b6' }} />, to: '/events' },
];

function Sidebar() {
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
                component={item.comingSoon ? 'div' : Link} 
                to={item.comingSoon ? undefined : item.to}
                sx={{ 
                  cursor: item.comingSoon ? 'default' : 'pointer',
                  '&:hover': item.comingSoon ? {} : undefined
                }}
              >
                <ItemListItemIcon>
                  {item.icon}
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
                {!item.comingSoon && <ChevronRightIcon color="action" fontSize="small" />}
              </ItemListItemButton>
            </ItemListItem>
          ))}
        </SidebarList>
      </SidebarCard>
    </SidebarContainer>
  );
}

export default Sidebar; 