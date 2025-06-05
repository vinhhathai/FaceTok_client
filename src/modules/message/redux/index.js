import messageReducer, {
  fetchMessages,
  sendMessage,
  setCurrentConversation,
  clearCurrentConversation,
  addReceivedMessage
} from './slices/messageSlice';

import conversationReducer, {
  fetchConversations,
  updateConversationLastMessage,
  markConversationAsRead
} from './slices/conversationSlice';

// Export all actions
export {
  // Message actions
  fetchMessages,
  sendMessage,
  setCurrentConversation,
  clearCurrentConversation,
  addReceivedMessage,
  
  // Conversation actions
  fetchConversations,
  updateConversationLastMessage,
  markConversationAsRead
};

// Export combined reducer
const reducer = {
  messages: messageReducer,
  conversations: conversationReducer
};

export default reducer; 