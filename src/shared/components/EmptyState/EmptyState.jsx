import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';
import ErrorIcon from '@mui/icons-material/Error';
import { useTheme } from '@mui/material/styles';

// Icon mapping
const ICONS = {
  people: PeopleIcon,
  search: SearchIcon,
  send: SendIcon,
  notifications: NotificationsIcon,
  inbox: InboxIcon,
  error: ErrorIcon
};

/**
 * Component hiển thị trạng thái trống
 * @param {Object} props - Component props
 * @param {string} props.title - Tiêu đề
 * @param {string} props.description - Mô tả
 * @param {string} props.icon - Tên icon (people, search, send, notifications, inbox, error)
 */
const EmptyState = ({ title, description, icon = 'error' }) => {
  const theme = useTheme();
  
  const IconComponent = ICONS[icon] || ICONS.error;
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.default
      }}
    >
      <Box 
        sx={{ 
          mb: 2,
          p: 2,
          borderRadius: '50%',
          backgroundColor: theme.palette.action.hover,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 70,
          height: 70
        }}
      >
        <IconComponent 
          sx={{ 
            fontSize: 40,
            color: theme.palette.text.secondary
          }} 
        />
      </Box>
      
      <Typography 
        variant="h6" 
        component="h2"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>
      
      {description && (
        <Typography 
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 300 }}
        >
          {description}
        </Typography>
      )}
    </Paper>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.oneOf(['people', 'search', 'send', 'notifications', 'inbox', 'error'])
};

export default EmptyState; 