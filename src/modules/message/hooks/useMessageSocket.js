import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../../../shared/contexts/SocketContext';

/**
 * Hook để sử dụng socket connection cho trang tin nhắn
 * Hook này hiện không tạo kết nối socket mới mà sử dụng socket toàn cục từ SocketContext
 */
const useMessageSocket = () => {
  const currentConversation = useSelector(state => state.messages.currentConversation);
  const { connected, joinRoom, leaveRoom } = useSocket();
  
  // Join room khi conversation thay đổi
  useEffect(() => {
    if (connected && currentConversation) {
      joinRoom(currentConversation._id);
      
      // Cleanup: leave room when component unmounts or conversation changes
      return () => {
        leaveRoom(currentConversation._id);
      };
    }
  }, [currentConversation, connected, joinRoom, leaveRoom]);

  // Trả về socket context
  return useSocket();
};

export default useMessageSocket; 