import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../shared/contexts/SocketContext';

/**
 * Hook để sử dụng socket connection cho trang tin nhắn
 */
const useMessageSocket = () => {
  const currentConversation = useSelector(state => state.messages.currentConversation);
  const { socket, connected, emit, joinRoom, leaveRoom } = useSocket();
  const previousRoomIdRef = useRef(null);
  const timerRef = useRef(null);
  
  // Tự động join room khi conversation thay đổi
  useEffect(() => {
    if (!connected || !currentConversation?._id) return;
    
    const roomId = currentConversation._id;
    
    // Xóa timer cũ nếu có
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Sử dụng timeout để debounce các cuộc gọi liên tiếp
    timerRef.current = setTimeout(() => {
      // Chỉ join room khi roomId thay đổi để tránh gọi nhiều lần
      if (previousRoomIdRef.current !== roomId) {
        console.log(`Joining room: ${roomId} (previous: ${previousRoomIdRef.current})`);
        
        // Nếu đã ở trong phòng khác, rời phòng đó trước
        if (previousRoomIdRef.current) {
          leaveRoom({ roomId: previousRoomIdRef.current });
        }
        
        // Join phòng mới
        joinRoom({ roomId });
        
        // Cập nhật ref
        previousRoomIdRef.current = roomId;
      }
    }, 300); // Debounce 300ms
    
    return () => {
      // Xóa timer khi cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Cleanup chỉ khi component unmount, không phải khi roomId thay đổi
      if (roomId === previousRoomIdRef.current) {
        console.log(`Leaving room on unmount: ${roomId}`);
        leaveRoom({ roomId });
        previousRoomIdRef.current = null;
      }
    };
  }, [currentConversation, connected, joinRoom, leaveRoom]);

  return { socket, connected, emit, joinRoom, leaveRoom };
};

export default useMessageSocket; 