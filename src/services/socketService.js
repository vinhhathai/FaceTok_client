import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { store } from '../redux/store';
import { addMessage, updateMessageRead, setOnlineUsers, setTypingStatus } from '../redux/features/messageSlice';
import { addFriendRequest, addFriend, removeFriendAction } from '../redux/features/friendSlice';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;
  
  // Lấy token từ cookie theo cách mới
  const token = getTokenFromCookie();
  if (!token) {
    console.error('No authentication token found, socket connection aborted');
    return null;
  }

  console.log('Initializing socket with token');
  
  // Connect to server with authentication
  socket = io('http://localhost:3000', {
    auth: { token },
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000
  });

  // Set up event listeners
  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  // Listen for new messages
  socket.on('newMessage', (message) => {
    console.log('New message received:', message);
    store.dispatch(addMessage(message));
  });

  // Listen for message read updates
  socket.on('messageReadUpdate', ({ messageId }) => {
    console.log('Message read:', messageId);
    store.dispatch(updateMessageRead(messageId));
  });

  // Listen for typing indicators
  socket.on('userTyping', (data) => {
    console.log('User typing:', data);
    store.dispatch(setTypingStatus(data));
  });

  // Listen for online users updates
  socket.on('userStatus', (onlineUsers) => {
    console.log('Online users:', onlineUsers);
    store.dispatch(setOnlineUsers(onlineUsers));
  });

  // Friend request received
  socket.on('friendRequestReceived', (request) => {
    console.log('Friend request received:', request);
    store.dispatch(addFriendRequest({ request, isIncoming: true }));
  });

  // Friend request accepted
  socket.on('friendRequestAccepted', (friend) => {
    console.log('Friend request accepted:', friend);
    store.dispatch(addFriend({ friend }));
  });

  // Friend removed
  socket.on('friendRemoved', (data) => {
    console.log('Friend removed:', data);
    store.dispatch(removeFriendAction({ friendId: data.userId }));
  });

  return socket;
};

// Hàm để lấy token từ cookie - giống như trong axiosConfig
function getTokenFromCookie() {
  try {
    const accountInfo = Cookies.get('accountInformation');
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      return parsedInfo.accessToken || '';
    }
    return '';
  } catch (error) {
    console.error('Error getting token from cookie:', error);
    return '';
  }
}

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const sendMessage = (receiverId, text) => {
  if (!socket) return false;
  
  socket.emit('sendMessage', { receiverId, text });
  return true;
};

export const sendTypingStatus = (receiverId, typing = true) => {
  if (!socket) return;
  
  socket.emit('typing', { receiverId, typing });
};

export const markMessageAsRead = (messageId) => {
  if (!socket) return;
  
  socket.emit('messageRead', { messageId });
};

export default {
  initSocket,
  closeSocket,
  sendMessage,
  sendTypingStatus,
  markMessageAsRead
}; 