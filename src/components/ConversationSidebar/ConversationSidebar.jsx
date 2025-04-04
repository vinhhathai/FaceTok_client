import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Typography, 
  List, 
  Box, 
  Button,
  Badge,
  Avatar,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

import {
  ConversationSidebar as SidebarContainer,
  ConversationList,
  ConversationHeader,
  StyledListItem
} from './styles';

const ConversationSidebar = ({ 
  conversations, 
  loading, 
  activeConversation,
  onlineUsers,
  typingUsers,
  handleConversationClick
}) => {
  const navigate = useNavigate();

  const navigateToFriends = () => {
    navigate('/friends');
  };

  const isUserOnline = (userId) => {
    const online = onlineUsers.includes(userId);
    console.log('Sidebar - User online status:', userId, online, onlineUsers); // Debug log
    return online;
  };

  const isUserTyping = (userId) => {
    return typingUsers[userId] === true;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SidebarContainer>
      <ConversationHeader>
        <Typography variant="h6">Conversations</Typography>
      </ConversationHeader>
      <ConversationList>
        <List>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <LoadingSpinner size={30} />
            </Box>
          ) : (
            <>
              {conversations.length > 0 ? (
                conversations.map(conversation => (
                  <React.Fragment key={conversation.id}>
                    <StyledListItem
                      alignItems="flex-start"
                      onClick={() => handleConversationClick(conversation.id)}
                      selected={activeConversation?.id === conversation.id}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: isUserOnline(conversation.user._id) ? '#44b700' : '#bdbdbd',
                              color: isUserOnline(conversation.user._id) ? '#44b700' : '#bdbdbd',
                              boxShadow: `0 0 0 2px white`,
                              width: 10,
                              height: 10,
                              borderRadius: '50%'
                            },
                          }}
                        >
                          <Avatar src={conversation.user.profilePicture} />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" color="text.primary">
                              {conversation.user.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTime(conversation.timestamp)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography 
                            component="span" 
                            variant="body2" 
                            color={conversation.unread > 0 ? "primary" : "text.secondary"}
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          >
                            <Box component="span" sx={{ 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap',
                              maxWidth: '160px',
                              display: 'inline-block'
                            }}>
                              {isUserTyping(conversation.user._id) 
                                ? <em>Typing...</em> 
                                : conversation.lastMessage}
                            </Box>
                            {conversation.unread > 0 && (
                              <Badge 
                                badgeContent={conversation.unread} 
                                color="primary" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                        }
                      />
                    </StyledListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary" gutterBottom>
                    No conversations with friends yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add friends to start messaging
                  </Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<PeopleIcon />}
                    onClick={navigateToFriends}
                  >
                    Find Friends
                  </Button>
                </Box>
              )}
            </>
          )}
        </List>
      </ConversationList>
    </SidebarContainer>
  );
};

export default ConversationSidebar; 