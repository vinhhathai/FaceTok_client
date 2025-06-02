// Message module exports
// This file will export components, hooks, or other utilities from the message module

// Example export:
// export { default as MessageList } from './components/MessageList/MessageList'; 

// Export các pages
export { default as ChatPage } from './pages/ChatPage/ChatPage';
export { default as MessageIndexPage } from './pages/MessageIndexPage/MessageIndexPage';

// Export các components
export { default as ChatBox } from './components/ChatBox/ChatBox';
export { default as MessageList } from './components/MessageList/MessageList';
export { default as MessageItem } from './components/MessageItem/MessageItem';
export { default as ConversationList } from './components/ConversationList/ConversationList';
export { default as ConversationItem } from './components/ConversationItem/ConversationItem';
export { default as ChatInput } from './components/ChatInput/ChatInput';

// Export redux
export * from './redux';

// Export hook
export { default as useMessageSocket } from './hooks/useMessageSocket'; 