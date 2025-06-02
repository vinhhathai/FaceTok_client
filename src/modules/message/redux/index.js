import messageReducer, {
  fetchMessages,
  sendMessage,
  markMessageAsRead,
  setCurrentConversation,
  clearCurrentConversation,
  addReceivedMessage
} from './slices/messageSlice';

import conversationReducer, {
  fetchConversations,
  fetchUnreadCount,
  updateConversationLastMessage,
  markConversationAsRead
} from './slices/conversationSlice';

// Export all actions
export {
  // Message actions
  fetchMessages,
  sendMessage,
  markMessageAsRead,
  setCurrentConversation,
  clearCurrentConversation,
  addReceivedMessage,
  
  // Conversation actions
  fetchConversations,
  fetchUnreadCount,
  updateConversationLastMessage,
  markConversationAsRead
};

// Export combined reducer
const reducer = {
  messages: messageReducer,
  conversations: conversationReducer
};

export default reducer; 