import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Typography, CircularProgress } from '@mui/material';
import ConversationItem from '../ConversationItem/ConversationItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../redux/slices/conversationSlice';
import { StatusContainer, ConversationsListWrapper } from './ConversationList.styles';

const ConversationList = ({ onSelectConversation, currentConversationId }) => {
  const dispatch = useDispatch();
  const { conversations, loading, error } = useSelector(state => state.conversations);

  // Fetch conversations on component mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  if (loading) {
    return (
      <StatusContainer>
        <CircularProgress />
      </StatusContainer>
    );
  }

  if (error) {
    return (
      <StatusContainer>
        <Typography color="error">
          Không thể tải cuộc trò chuyện
        </Typography>
      </StatusContainer>
    );
  }

  if (conversations.length === 0) {
    return (
      <StatusContainer>
        <Typography color="text.secondary">
          Chưa có cuộc trò chuyện nào
        </Typography>
      </StatusContainer>
    );
  }

  return (
    <ConversationsListWrapper disablePadding>
      {conversations.map((conversation) => (
        <ConversationItem 
          key={conversation._id}
          conversation={conversation}
          isActive={conversation._id === currentConversationId}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </ConversationsListWrapper>
  );
};

ConversationList.propTypes = {
  onSelectConversation: PropTypes.func.isRequired,
  currentConversationId: PropTypes.string
};

export default ConversationList; 