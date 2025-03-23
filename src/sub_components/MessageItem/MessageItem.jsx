import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { MessageMenuItem, MessageHeader, UnreadIndicator } from './styles';

const MessageItem = ({ avatar, userName, message, isUnread }) => (
  <MessageMenuItem>
    <ListItem alignItems="flex-start" disablePadding sx={{ p: 0 }}>
      <ListItemAvatar>
        <Avatar src={avatar} alt={`${userName}'s avatar`} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <MessageHeader>
            <Typography variant="subtitle2" component="span">
              {userName}
            </Typography>
            {isUnread && <UnreadIndicator />}
          </MessageHeader>
        }
        secondary={message}
      />
    </ListItem>
  </MessageMenuItem>
);

export default MessageItem; 