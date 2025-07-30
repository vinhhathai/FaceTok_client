import React, { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery, useTheme } from '@mui/material';
import MessageItem from '../MessageItem/MessageItem';
import {
  MessageListContainer,
  DateGroup,
  DateHeaderContainer,
  DateDisplay,
  EmptyMessageContainer
} from './MessageList.styles';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const previousMessagesLength = useRef(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Kiểm tra nếu có tin nhắn mới thì mới log
    if (messages && messages.length !== previousMessagesLength.current) {
      previousMessagesLength.current = messages.length;
      console.log(`MessageList: Messages updated, count: ${messages.length}`);
    }
  }, [messages]);

  // Force scroll to bottom on initial load with a slight delay to ensure rendering is complete
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to properly extract senderId from any message format
  const getSenderId = (message) => {
    if (!message) return null;
    
    // Handle different formats of senderId
    if (typeof message.senderId === 'string') {
      return message.senderId;
    } else if (typeof message.senderId === 'object' && message.senderId !== null) {
      return message.senderId._id || message.senderId.id || JSON.stringify(message.senderId);
    } else if (message.sender) {
      if (typeof message.sender === 'string') {
        return message.sender;
      }
      return message.sender._id || message.sender.id || JSON.stringify(message.sender);
    }
    
    return null;
  };
  
  // Function to check if a message is sent by current user
  const isSenderCurrentUser = (message, userId) => {
    if (!message || !userId) return false;
    
    const senderId = getSenderId(message);
    if (!senderId) return false;
    
    // Either comparing directly or checking if senderId contains userId
    return String(senderId) === String(userId) || 
           (typeof senderId === 'string' && senderId.includes(userId));
  };
  
  // Kiểm tra tin nhắn rỗng
  if (!messages || messages.length === 0) {
    return (
      <MessageListContainer ref={containerRef}>
        {isMobile && <div style={{ height: '60px', flexShrink: 0, marginBottom: '8px' }} />} {/* Spacer cho mobile */}
        <EmptyMessageContainer>
          Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
        </EmptyMessageContainer>
        <div ref={messagesEndRef} />
      </MessageListContainer>
    );
  }
  
  // Sort messages by timestamp first
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB; // Ascending (oldest first)
  });
  
  // Group messages by date
  const getMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Create an array of days with their messages
  const groupedMessages = sortedMessages.reduce((groups, message) => {
    // Kiểm tra tin nhắn hợp lệ
    if (!message || !message.createdAt) {
      return groups;
    }
    
    const date = getMessageDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  // Convert groupedMessages to an array of sorted date entries
  const sortedGroupedMessages = Object.entries(groupedMessages).sort(([dateA], [dateB]) => {
    return new Date(dateA) - new Date(dateB); // Sort dates chronologically
  });
  
  // Kiểm tra xem currentUserId có đúng định dạng không
  const cleanCurrentUserId = String(currentUserId).trim();
  
  return (
    <MessageListContainer ref={containerRef}>
      {/* Thêm phần tử giả có chiều cao cố định trên mobile để tránh bị che bởi header */}
      {isMobile && <div style={{ height: '60px', flexShrink: 0, marginBottom: '8px' }} />}
      
      {sortedGroupedMessages.map(([date, dateMessages]) => (
        <DateGroup key={date}>
          <DateHeaderContainer>
            <DateDisplay>
              {date}
            </DateDisplay>
          </DateHeaderContainer>
          
          {dateMessages.map((message) => {
            if (!message || !message._id) return null;
            
            // Use the helper function to determine if message is from current user
            const isOwnMessage = isSenderCurrentUser(message, cleanCurrentUserId);
            
            return (
              <MessageItem
                key={message._id}
                message={message}
                isOwn={isOwnMessage}
              />
            );
          })}
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