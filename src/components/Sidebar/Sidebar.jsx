import React from 'react';
import { Link } from 'react-router-dom';
import { ListItemText, Divider } from '@mui/material'; // Keep only necessary direct imports
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import VideoCameraBackOutlinedIcon from '@mui/icons-material/VideoCameraBackOutlined';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import {
  SidebarContainer,
  SidebarCard,
  SidebarList,
  HomeListItem,
  HomeTypography,
  ItemListItem,
  ItemListItemButton,
  ItemListItemIcon,
  StyledBadge
} from './styles';

// Main navigation items with Material-UI icons
const mainItems = [
  { text: 'Messages', icon: <EmailOutlinedIcon color="primary" />, to: '/messages' },
  { text: 'Groups', icon: <GroupsOutlinedIcon color="secondary" />,  to: '/groups' },
  { text: 'Find Friends', icon: <PeopleAltOutlinedIcon style={{ color: '#f0a04b' }} />, to: '/friends' },
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
                <HomeOutlinedIcon color="primary" />
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
