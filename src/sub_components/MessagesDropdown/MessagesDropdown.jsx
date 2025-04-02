import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import MessageItem from '../MessageItem/MessageItem';
import { MessageContainer, MenuTitle, MenuFooter, ActionText, LinkText } from './styles';
import { IconAvatar } from '../../components/Header/styles';

const MessagesDropdown = ({ messageIcon, avatarMessage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <MessageContainer>
      <IconButton
        aria-label="messages"
        aria-controls={open ? 'messages-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <Badge badgeContent={1} color="primary">
          <IconAvatar 
            src={messageIcon} 
            variant="square" 
            alt="message icon"
          />
        </Badge>
      </IconButton>
      <Menu
        id="messages-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'messages-button',
        }}
        PaperProps={{
          elevation: 4,
          sx: { width: 320, maxHeight: 450 }
        }}
      >
        <MenuTitle>
          <Typography variant="subtitle1">
            Messages | <LinkText component="span">Requests</LinkText>
          </Typography>
          <ActionText variant="body2">
            Mark All as Read
          </ActionText>
        </MenuTitle>
        <Divider />
        <MessageItem 
          avatar={avatarMessage} 
          userName="Susan P. Jarvis" 
          message="This party is going to have a DJ, food, and drinks."
          isUnread={true}
        />
        <MessageItem 
          avatar={avatarMessage} 
          userName="Ruth D. Greene" 
          message="Great, I'll see you tomorrow!"
          isUnread={true}
        />
        <MessageItem 
          avatar={avatarMessage} 
          userName="Kimberly R. Hatfield" 
          message="yeah, I will be there."
          isUnread={true}
        />
        <Divider />
        <MenuFooter>
          <ActionText 
            variant="body2" 
            sx={{ display: 'block', width: '100%' }}
          >
            View All Messages
          </ActionText>
        </MenuFooter>
      </Menu>
    </MessageContainer>
  );
};

export default MessagesDropdown; 