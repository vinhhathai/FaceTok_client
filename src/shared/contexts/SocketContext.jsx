import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getCookie } from '../utils/cookieUtils';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { addReceivedMessage, updateConversationLastMessage } from '../../modules/message/redux';
import { toast } from 'react-toastify';
import { store } from '../../core/config/store';

const SOCKET_URL = 'http://localhost:3000/message';
const TOKEN_COOKIE_NAME = 'auth_token';

// Tạo context
const SocketContext = createContext(null);

// Custom event để thông báo có tin nhắn mới
export const MESSAGE_RECEIVED_EVENT = 'facetok_message_received';

// Tạo component MessageNotification cho tin nhắn mới
const MessageNotification = ({ senderName, content, onClick }) => (
  <div onClick={onClick} style={{ cursor: 'pointer' }}>
    <div><strong>{senderName}</strong></div>
    <div>{content.length > 50 ? content.substring(0, 50) + '...' : content}</div>
  </div>
);

// Provider component
export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const token = getCookie(TOKEN_COOKIE_NAME);
    
    // Nếu không có token thì không kết nối socket
    if (!token) {
      console.warn('No authentication token found, socket connection skipped');
      return;
    }
    
    // Tạo kết nối socket
    const socket = io(SOCKET_URL, {
      auth: {
        token: token
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    });
    
    // Socket connection events
    socket.on('connect', () => {
      console.log(`Socket connected with ID: ${socket.id}`);
      setConnected(true);
      
      // Xác thực bằng token
      socket.emit('authenticate', { accessToken: token });
      
      // Lấy userId từ token
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        
        if (userId) {
          localStorage.setItem('currentUserId', userId);
        }
      } catch (error) {
        console.error('Error decoding token in socket connection:', error);
      }
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });
    
    // Lắng nghe tin nhắn mới đến - sẽ hoạt động ở mọi trang
    socket.on('message_received', (data) => {
      // Đảm bảo dữ liệu tin nhắn hợp lệ
      if (!data) {
        console.error('Received empty message_received event');
        return;
      }

      console.log('Received message_received event:', data);
      
      // Chuẩn hóa dữ liệu tin nhắn
      let messageData = data;
      
      // Trong trường hợp dữ liệu được bọc trong object
      if (data.message) {
        messageData = data.message;
      }
      
      // Đảm bảo có roomId
      if (!messageData.roomId) {
        console.error('Message data missing roomId:', messageData);
        return;
      }
      
      // Đảm bảo có _id
      if (!messageData._id) {
        console.error('Message data missing _id:', messageData);
        return;
      }
      
      // Lấy tin nhắn hiện tại từ Redux store để kiểm tra xem có tin nhắn optimistic không
      const currentState = store.getState();
      const currentMessages = currentState.messages.messages;
      
      // Kiểm tra xem tin nhắn này có phải từ người dùng hiện tại không
      const currentUserId = localStorage.getItem('currentUserId');
      const isFromCurrentUser = messageData.senderId === currentUserId || 
                               (messageData.sender && messageData.sender._id === currentUserId);
      
      // Nếu tin nhắn từ người dùng hiện tại, kiểm tra xem có tin nhắn optimistic không
      if (isFromCurrentUser) {
        // Tìm tin nhắn optimistic có nội dung giống với tin nhắn thật
        const optimisticMessage = currentMessages.find(msg => 
          msg.isOptimistic && msg.content === messageData.content
        );
        
        if (optimisticMessage) {
          console.log('Replacing optimistic message with real message:', optimisticMessage._id, '->', messageData._id);
          // Thêm ID của tin nhắn optimistic vào tin nhắn thật để xử lý thay thế
          messageData.replaceOptimisticId = optimisticMessage._id;
        }
      }
      
      // Thêm tin nhắn vào Redux store
      dispatch(addReceivedMessage(messageData));
      
      // Cập nhật conversation trong danh sách
      dispatch(updateConversationLastMessage({
        conversationId: messageData.roomId,
        message: messageData
      }));
      
      // Phát sự kiện tin nhắn mới cho toàn bộ ứng dụng
      const messageEvent = new CustomEvent(MESSAGE_RECEIVED_EVENT, { 
        detail: messageData 
      });
      window.dispatchEvent(messageEvent);
      
      // Bỏ qua toast thông báo cho tất cả tin nhắn
      // Nếu muốn chỉ hiển thị thông báo cho tin nhắn từ người khác, bỏ comment dòng dưới
      /*
      if (!isFromCurrentUser) {
        const senderName = messageData.sender?.fullName || 
                          messageData.senderName || 
                          'Tin nhắn mới';
        
        toast.info(
          <MessageNotification 
            senderName={senderName} 
            content={messageData.content}
            onClick={() => {
              // Chuyển người dùng đến trang tin nhắn với roomId cụ thể
              window.location.href = `/messages/${messageData.roomId}`;
            }}
          />,
          {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
          }
        );
      }
      */
    });
    
    // Lắng nghe xác nhận tin nhắn đã gửi
    socket.on('message_sent', (data) => {
      // Dispatch tới Redux store
      if (data.message) {
        try {
          // Đảm bảo message có đủ các trường cần thiết
          const messageData = {
            ...data.message,
            room: data.room || { _id: data.message.roomId }
          };
          
          // Thêm tin nhắn vào conversation hiện tại 
          dispatch(addReceivedMessage(messageData));
          
          // Cập nhật conversation trong danh sách
          dispatch(updateConversationLastMessage({
            conversationId: data.room?._id || data.message.roomId,
            message: messageData
          }));
          
          // Phát sự kiện tin nhắn mới gửi thành công
          const messageEvent = new CustomEvent('MESSAGE_SENT_SUCCESS', {
            detail: messageData
          });
          window.dispatchEvent(messageEvent);
        } catch (error) {
          console.error('Error processing message_sent event:', error);
        }
      } else {
        console.warn('Received message_sent event without message data:', data);
      }
    });
    
    // Lưu trữ socket reference để có thể sử dụng sau này
    socketRef.current = socket;
    
    // Cleanup khi component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [dispatch]);
  
  // Utility function để gửi tin nhắn qua socket
  const emit = (event, data) => {
    console.log('Socket emit called:', { event, data });
    
    if (!socketRef.current) {
      console.error('Socket connection not established');
      toast.error('Lỗi kết nối: Socket chưa được khởi tạo');
      return false;
    }
    
    if (!connected) {
      console.error('Socket not connected');
      toast.error('Lỗi kết nối: Socket không kết nối');
      return false;
    }
    
    // Ánh xạ send-message sang send_message với cấu trúc dữ liệu đúng
    if (event === 'send-message') {
      if (!data.roomId) {
        console.error('Cannot send message: Missing roomId', data);
        toast.error('Lỗi gửi tin nhắn: Thiếu roomId');
        return false;
      }
      
      try {
        socketRef.current.emit('send_message', {
          roomId: data.roomId,
          content: data.content,
        });
        
        // Log thành công
        console.log('Emit send_message successful');
        
        // Listen for specific events to debug the send message flow
        socketRef.current.once('message_error', (error) => {
          console.error('Error sending message:', error);
          toast.error(`Lỗi: ${error.message || 'Không thể gửi tin nhắn'}`);
        });
      } catch (err) {
        console.error('Error emitting event:', err);
        toast.error(`Lỗi khi gửi tin nhắn: ${err.message}`);
        return false;
      }
    } else {
      // Các sự kiện khác chuyển đổi dấu gạch ngang sang gạch dưới
      const serverEvent = event.replace(/-/g, '_');
      try {
        socketRef.current.emit(serverEvent, data);
      } catch (err) {
        console.error(`Error emitting ${serverEvent} event:`, err);
        return false;
      }
    }
    
    return true;
  };
  
  // Utility function để join/leave room
  const joinRoom = (data) => {
    if (socketRef.current && connected) {
      // Kiểm tra data có thể là object hoặc string
      if (typeof data === 'object' && data.roomId) {
        socketRef.current.emit('join_room', data);
        return true;
      } else if (typeof data === 'string') {
        // Hỗ trợ cách cũ để tương thích ngược
        socketRef.current.emit('join_room', { roomId: data });
        return true;
      }
    }
    return false;
  };
  
  const leaveRoom = (data) => {
    if (socketRef.current && connected) {
      // Kiểm tra data có thể là object hoặc string
      if (typeof data === 'object' && data.roomId) {
        socketRef.current.emit('leave_room', data);
        return true;
      } else if (typeof data === 'string') {
        // Hỗ trợ cách cũ để tương thích ngược
        socketRef.current.emit('leave_room', { roomId: data });
        return true;
      }
    }
    return false;
  };
  
  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, emit, joinRoom, leaveRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook để sử dụng socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (context === null) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
}; 