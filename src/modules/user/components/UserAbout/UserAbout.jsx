import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Paper, 
  Typography,
  Divider,
  Grid,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import InterestsIcon from '@mui/icons-material/Interests';

const UserAbout = ({ user }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Giới thiệu
        </Typography>
        <Typography variant="body1" paragraph>
          {user.bio || 'Người dùng chưa cập nhật thông tin giới thiệu.'}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List disablePadding>
              {user.location && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOnIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Đang sống tại"
                    secondary={user.location}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
              
              {user.work && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Làm việc tại"
                    secondary={user.work}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
              
              {user.education && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Học tại"
                    secondary={user.education}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
              
              {user.email && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email"
                    secondary={user.email}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List disablePadding>
              {user.birthday && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CalendarMonthIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sinh nhật"
                    secondary={user.birthday}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
              
              {user.relationship && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FavoriteIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Tình trạng mối quan hệ"
                    secondary={user.relationship}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
              
              {user.website && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LanguageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Website"
                    secondary={user.website}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
              
              {user.interests && (
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InterestsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Sở thích"
                    secondary={user.interests}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

UserAbout.propTypes = {
  user: PropTypes.shape({
    bio: PropTypes.string,
    location: PropTypes.string,
    work: PropTypes.string,
    education: PropTypes.string,
    email: PropTypes.string,
    birthday: PropTypes.string,
    relationship: PropTypes.string,
    website: PropTypes.string,
    interests: PropTypes.string
  }).isRequired
};

export default UserAbout; 