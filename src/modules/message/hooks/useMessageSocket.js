import { useEffect, useRef, useState } from 'react';
import { useSocket } from '@contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { updateMessageAsRevoked } from '@message/redux/slices/messageSlice';
import { updateGroupName } from '@message/redux/slices/conversationSlice';
import { Snackbar, Alert } from '@mui/material';

/**
 * Hook để sử dụng socket connection cho trang tin nhắn
 * @param {Object} currentConversation - Conversation hiện tại (truyền qua props)
 */
const useMessageSocket = (currentConversation) => {
  const { socket, connected, emit, joinRoom, leaveRoom } = useSocket();
  const dispatch = useDispatch();
  const previousRoomIdRef = useRef(null);
  const timerRef = useRef(null);
  
  // Toast state
  const [toastInfo, setToastInfo] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  
  // Toast functions
  const showToast = (message, severity = 'error') => {
    setToastInfo({
      open: true,
      message,
      severity
    });
  };
  
  const handleCloseToast = () => {
    setToastInfo(prev => ({
      ...prev,
      open: false
    }));
  };
  
  // Lắng nghe sự kiện message_revoked từ socket
  useEffect(() => {
    if (!socket) return;

    const handleMessageRevoked = (data) => {
      console.log('Message revoked event received:', data);
      // Cập nhật Redux store khi tin nhắn được thu hồi
      if (data.messageId) {
        dispatch(updateMessageAsRevoked({ messageId: data.messageId }));
      }
    };

    const handleMessageError = (data) => {
      console.log('Message error event received:', data);
      // Hiển thị thông báo lỗi cho user
      if (data.message) {
        showToast(data.message, 'error');
      }
    };

    const handleGroupRenamed = (data) => {
      console.log('Group renamed event received:', data);
      // Cập nhật Redux store khi tên nhóm thay đổi
      if (data.groupId && data.newName) {
        console.log('Dispatching updateGroupName with:', { groupId: data.groupId, newName: data.newName });
        dispatch(updateGroupName({ groupId: data.groupId, newName: data.newName }));
      }
      showToast(`Nhóm đã được đổi tên thành: ${data.newName}`, 'success');
    };

    const handleGroupError = (data) => {
      console.log('Group error event received:', data);
      // Hiển thị thông báo lỗi cho user
      if (data.message) {
        showToast(data.message, 'error');
      }
    };

    socket.on('message_revoked', handleMessageRevoked);
    socket.on('message_error', handleMessageError);
    socket.on('group_renamed', handleGroupRenamed);
    socket.on('group_error', handleGroupError);

    return () => {
      socket.off('message_revoked', handleMessageRevoked);
      socket.off('message_error', handleMessageError);
      socket.off('group_renamed', handleGroupRenamed);
      socket.off('group_error', handleGroupError);
    };
  }, [socket, dispatch]);
  
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

  // Function để đổi tên nhóm qua socket
  const renameGroup = (groupId, name) => {
    if (!socket || !connected) {
      showToast('Không thể kết nối với server', 'error');
      return false;
    }
    
    socket.emit('rename_group', { groupId, name });
    return true;
  };

  return { 
    socket, 
    connected, 
    emit, 
    joinRoom, 
    leaveRoom,
    renameGroup,
    toastInfo,
    handleCloseToast
  };
};

export default useMessageSocket; 