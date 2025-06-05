import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addReceivedMessage } from '../redux/slices/messageSlice';
import { updateConversationLastMessage } from '../redux/slices/conversationSlice';
import { getCookie } from '../../../shared/utils/cookieUtils';

const SOCKET_URL = 'http://localhost:3000/message';
const TOKEN_COOKIE_NAME = 'auth_token';

const useMessageSocket = () => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const currentConversation = useSelector(state => state.messages.currentConversation);
  const token = getCookie(TOKEN_COOKIE_NAME);
  const currentUserId = localStorage.getItem('currentUserId');

  useEffect(() => {
    // Create socket connection
    const socket = io(SOCKET_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    // Socket connection events
    socket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
      
      // Authenticate with userId
      if (currentUserId) {
        socket.emit('authenticate', currentUserId);
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    // Listen for new messages
    socket.on('message_received', (data) => {
      console.log('New message received:', data);
      
      // Add message to the current conversation if it's relevant
      if (data.message) {
        dispatch(addReceivedMessage(data.message));
        
        // Update the conversation with the new message in the conversations list
        dispatch(updateConversationLastMessage({
          conversationId: data.message.roomId || data.room?._id,
          message: data.message
        }));
      }
    });
    
    // Listen for sent message confirmation
    socket.on('message_sent', (data) => {
      console.log('Message sent confirmation:', data);
      
      if (data.message) {
        dispatch(addReceivedMessage(data.message));
      }
    });

    socket.on('message_error', (error) => {
      console.error('Message error:', error);
      // You can handle error feedback here
    });

    // Listen for room events
    socket.on('room-created', (room) => {
      console.log('New room created:', room);
      // You can handle new room creation here if needed
    });

    socket.on('room-messages', (messages) => {
      console.log('Room messages received:', messages);
      // This event can be used when joining a room to get previous messages
    });

    // Clean up socket connection when component unmounts
    socketRef.current = socket;
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch, token, currentUserId]);

  // Join room when conversation changes
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && connected && currentConversation) {
      socket.emit('join_room', currentConversation._id);
      console.log('Joined room:', currentConversation._id);
    }
  }, [currentConversation, connected]);

  // Return the socket and connection status
  return {
    socket: socketRef.current,
    connected,
    emit: (event, data) => {
      if (socketRef.current && connected) {
        // Ánh xạ send-message sang send_message với cấu trúc dữ liệu đúng
        if (event === 'send-message') {
          socketRef.current.emit('send_message', {
            receiverId: data.receiverId,
            content: data.content,
            // Bỏ roomId vì server không sử dụng
          });
        } else {
          // Các sự kiện khác chuyển đổi dấu gạch ngang sang gạch dưới
          const serverEvent = event.replace(/-/g, '_');
          socketRef.current.emit(serverEvent, data);
        }
      } else {
        console.warn('Socket not connected, cannot emit event:', event);
      }
    }
  };
};

export default useMessageSocket; 