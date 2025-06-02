import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReceivedMessage } from '../redux/slices/messageSlice';
import { updateConversationLastMessage } from '../redux/slices/conversationSlice';
import { currentUserId, users } from '../mock/mockData';

// Mock WebSocket hook - simulates incoming messages
const useMessageSocket = () => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const currentConversation = useSelector(state => state.messages.currentConversation);

  useEffect(() => {
    // Set up mock responses
    const mockResponses = [
      "Xin chào bạn!",
      "Dạo này bạn thế nào?",
      "Đã nhận được thông tin rồi, cảm ơn bạn.",
      "Ok, để mình xem lại nhé.",
      "Hẹn gặp lại bạn sau!",
      "Ngày mai mình sẽ gửi bạn tài liệu.",
      "Dự án của mình tiến triển tốt không?",
      "Chúc bạn cuối tuần vui vẻ!"
    ];
    
    // Create a mock response after sending a message
    const mockResponse = (conversationId, delay = 3000) => {
      if (!conversationId) return;
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const conversation = window.store?.getState()?.conversations?.conversations?.find(c => c._id === conversationId);
      
      if (!conversation) return;
      
      // Find the participant to use as the sender
      const sender = conversation.participant;
      
      setTimeout(() => {
        const newMessage = {
          _id: `msg_mock_${Date.now()}`,
          conversationId,
          content: randomResponse,
          senderId: sender._id,
          sender,
          createdAt: new Date().toISOString(),
          isRead: false
        };
        
        // Dispatch the new message to the store
        dispatch(addReceivedMessage(newMessage));
        
        // Update the conversation with the new message
        dispatch(updateConversationLastMessage({
          conversationId,
          message: newMessage
        }));
      }, delay);
    };

    // Save the mockResponse function to window for use outside the hook
    window.mockResponse = mockResponse;
    
    // Tự động sinh tin nhắn ngẫu nhiên hơn
    const createRandomMessage = () => {
      if (!currentConversation) return;
      
      // 30% chance of getting a message
      if (Math.random() < 0.3) {
        mockResponse(currentConversation._id, 500);
      }
    };
    
    // Kích hoạt tin nhắn ngẫu nhiên mỗi 15-40 giây
    intervalRef.current = setInterval(createRandomMessage, 15000 + Math.random() * 25000);
    
    // Add window store reference for the mock setup
    if (typeof window !== 'undefined') {
      window.store = window.store || {};
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [dispatch, currentConversation]);

  // Return a placeholder socket
  return {
    connected: true,
    emit: () => console.log('Mock socket emit'),
  };
};

export default useMessageSocket; 