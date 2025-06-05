import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { getCookie } from '../utils/cookieUtils';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { addReceivedMessage, updateConversationLastMessage } from '../../modules/message/redux';
import { toast } from 'react-toastify';

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
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Socket connection events
    socket.on('connect', () => {
      setConnected(true);
      
      // Lấy userId từ token
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        
        if (userId) {
          localStorage.setItem('currentUserId', userId);
          socket.emit('authenticate', userId);
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
      // Dispatch tới Redux store
      if (data.message) {
        // Thêm tin nhắn vào conversation hiện tại nếu đang mở
        dispatch(addReceivedMessage(data.message));
        
        // Cập nhật conversation trong danh sách
        dispatch(updateConversationLastMessage({
          conversationId: data.message.roomId || data.room?._id,
          message: data.message
        }));
        
        // Phát sự kiện tin nhắn mới cho toàn bộ ứng dụng
        const messageEvent = new CustomEvent(MESSAGE_RECEIVED_EVENT, { 
          detail: data.message 
        });
        window.dispatchEvent(messageEvent);
        
        // Hiển thị thông báo
        toast.info(
          <MessageNotification 
            senderName={data.message.sender?.fullName || 'Tin nhắn mới'} 
            content={data.message.content}
            onClick={() => {
              // Chuyển người dùng đến trang tin nhắn khi click vào notification
              window.location.href = '/home/messages';
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
      if (!data.receiverId) {
        console.error('Cannot send message: Missing receiverId', data);
        toast.error('Lỗi gửi tin nhắn: Thiếu người nhận');
        return false;
      }
      
      // Đảm bảo receiverId là chuỗi
      const receiverId = String(data.receiverId);
      console.log('Emitting send_message with receiverId:', receiverId);
      
      try {
        socketRef.current.emit('send_message', {
          receiverId: receiverId,
          content: data.content,
        });
        
        // Log thành công
        console.log('Emit send_message successful');
        
        // Listen for specific events to debug the send message flow
        socketRef.current.once('message_sent', (response) => {
          console.log('Message sent successfully:', response);
          toast.success('Gửi tin nhắn thành công');
        });
        
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
  const joinRoom = (roomId) => {
    if (socketRef.current && connected && roomId) {
      socketRef.current.emit('join_room', roomId);
      return true;
    }
    return false;
  };
  
  const leaveRoom = (roomId) => {
    if (socketRef.current && connected && roomId) {
      socketRef.current.emit('leave_room', roomId);
      return true;
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