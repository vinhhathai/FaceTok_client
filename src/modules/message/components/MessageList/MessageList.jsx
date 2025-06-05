import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import MessageItem from '../MessageItem/MessageItem';
import {
  MessageListContainer,
  DateGroup,
  DateHeaderContainer,
  DateDisplay
} from './MessageList.styles';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Group messages by date
  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Create an array of days with their messages
  const groupedMessages = messages.reduce((groups, message) => {
    const date = getMessageDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  return (
    <MessageListContainer>
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <DateGroup key={date}>
          <DateHeaderContainer>
            <DateDisplay>
              {date}
            </DateDisplay>
          </DateHeaderContainer>
          
          {dateMessages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
        </DateGroup>
      ))}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUserId: PropTypes.string.isRequired
};

export default MessageList; 