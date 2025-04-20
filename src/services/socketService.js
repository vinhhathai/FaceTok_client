import io from 'socket.io-client';
import Cookies from 'js-cookie';
import { store } from '../redux/store';
import { addMessage, updateMessageRead, setOnlineUsers, setTypingStatus } from '../redux/features/messageSlice';
import { addFriendRequest, addFriend, removeFriendAction } from '../redux/features/friendSlice';
import { addNotification } from '../redux/features/notificationSlice';

// Hàm để lấy URL socket dựa trên vị trí hiện tại
const getSocketURL = () => {
  const origin = window.location.origin;
  
  // Nếu đang chạy local, sử dụng port 3000 cho API
  if (origin.includes('localhost')) {
    return origin.replace(/:\d+$/, ':3000');
  }
  
  // Khi deploy, sử dụng cùng domain nhưng port khác
  return origin;
};

// Khởi tạo socket
let socket = null;

export const initializeSocket = (token) => {
  if (socket) {
    console.log('Socket already initialized');
    return socket;
  }

  if (!token) {
    console.error('No token provided for socket connection');
    return null;
  }

  // Lấy URL socket dựa trên môi trường
  const socketURL = getSocketURL();
  console.log(`Attempting to connect to socket server at: ${socketURL}`);
  
  socket = io(socketURL, {
    auth: {
      token: token,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to socket server at:', socketURL);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
    // Thêm mask token để hiển thị an toàn trong log
    const maskedToken = token ? `${token.substring(0, 10)}...${token.substring(token.length - 5)}` : 'no token';
    console.log('Connection attempted with token (masked):', maskedToken);
  });

  // Thêm sự kiện theo dõi tất cả các sự kiện socket để debug
  socket.onAny((event, ...args) => {
    console.log(`[Socket Debug] Event received: ${event}`, args);
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
  
  // New notification received
  socket.on('newNotification', (notification) => {
    console.log('New notification received:', notification);
    console.log('Dispatching addNotification action to Redux store');
    store.dispatch(addNotification(notification));
    console.log('Notification dispatched successfully');
  });

  return socket;
};

// Thêm hàm initSocket để tương thích với code hiện tại
export const initSocket = () => {
  const token = getTokenFromCookie();
  return initializeSocket(token);
};

export const getSocket = () => {
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
    console.log('Socket connection closed');
  }
};

export const getTokenFromCookie = () => {
  try {
    const accountInfo = Cookies.get('accountInformation');
    if (accountInfo) {
      const parsedInfo = JSON.parse(accountInfo);
      return parsedInfo.accessToken || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting token from cookie:', error);
    return null;
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
  initializeSocket,
  initSocket,
  getSocket,
  closeSocket,
  getTokenFromCookie,
  sendMessage,
  sendTypingStatus,
  markMessageAsRead
}; 