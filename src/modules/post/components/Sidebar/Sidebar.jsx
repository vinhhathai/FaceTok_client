import React from 'react';
import { Link } from 'react-router-dom';
import { ListItemText, Divider } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import {
  SidebarContainer,
  SidebarCard,
  SidebarList,
  ItemListItem,
  ItemListItemButton,
  ItemListItemIcon,
  StyledBadge
} from './Sidebar.styles';

// Main navigation items with Material-UI icons
const mainItems = [
  { text: 'Messages', icon: <EmailIcon color="primary" />, to: '/messages' },
  { text: 'Groups', icon: <GroupsIcon color="secondary" />,  to: '/groups' },
  { text: 'Find Friends', icon: <PeopleAltIcon style={{ color: '#f0a04b' }} />, to: '/friends' },
];

// Additional items
const additionalItems = [
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
            <ItemListItemButton component={Link} to="/">
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
                component={Link} 
                to={item.to}
              >
                <ItemListItemIcon>
                  {item.icon}
                </ItemListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: 1 }} />
              </ItemListItemButton>
            </ItemListItem>
          ))}
        </SidebarList>
      </SidebarCard>
    </SidebarContainer>
  );
}

export default Sidebar; 