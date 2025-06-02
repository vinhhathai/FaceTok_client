import { 
  getRecentConversations, 
  getConversation, 
  getUnreadCount, 
  getMessages, 
  sendMessage, 
  markAsRead 
} from './messageAPI';

// Named exports
export { 
  getRecentConversations, 
  getConversation, 
  getUnreadCount, 
  getMessages, 
  sendMessage, 
  markAsRead 
};

// Default export
const messageAPI = {
  getRecentConversations,
  getConversation,
  getUnreadCount,
  getMessages,
  sendMessage,
  markAsRead
};

export default messageAPI; 