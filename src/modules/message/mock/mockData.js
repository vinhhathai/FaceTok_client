// Mock user IDs
export const currentUserId = "user123";

// Mock users
export const users = [
  {
    _id: "user123",
    fullName: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: true
  },
  {
    _id: "user456",
    fullName: "Trần Thị B",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    online: true
  },
  {
    _id: "user789",
    fullName: "Lê Văn C",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    online: false
  },
  {
    _id: "user101",
    fullName: "Phạm Thị D",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    online: true
  },
  {
    _id: "user102",
    fullName: "Hoàng Văn E",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    online: false
  }
];

// Mock conversations
export const conversations = [
  {
    _id: "conv1",
    participant: users.find(u => u._id === "user456"),
    lastMessage: {
      _id: "msg5",
      content: "Hẹn gặp lại bạn vào ngày mai nhé!",
      senderId: "user456",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    _id: "conv2",
    participant: users.find(u => u._id === "user789"),
    lastMessage: {
      _id: "msg10", 
      content: "Ok, đã nhận được rồi, cảm ơn bạn!",
      senderId: "user123",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: true
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    _id: "conv3",
    participant: users.find(u => u._id === "user101"),
    lastMessage: {
      _id: "msg15",
      content: "Anh đã gửi tài liệu qua email rồi, bạn kiểm tra giúp mình nhé",
      senderId: "user101",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isRead: true
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    _id: "conv4", 
    participant: users.find(u => u._id === "user102"),
    lastMessage: {
      _id: "msg20",
      content: "Dự án sẽ bắt đầu vào tuần sau, chuẩn bị sẵn sàng nhé!",
      senderId: "user102", 
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isRead: false
    },
    unreadCount: 3,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];

// Mock messages for conversation 1 (with user456)
export const messages_conv1 = [
  {
    _id: "msg1",
    conversationId: "conv1",
    content: "Chào bạn, khoẻ không?",
    senderId: "user123",
    sender: users.find(u => u._id === "user123"),
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    isRead: true
  },
  {
    _id: "msg2",
    conversationId: "conv1",
    content: "Chào, mình khoẻ cảm ơn bạn. Còn bạn thì sao?",
    senderId: "user456",
    sender: users.find(u => u._id === "user456"),
    createdAt: new Date(Date.now() - 1000 * 60 * 58).toISOString(), 
    isRead: true
  },
  {
    _id: "msg3",
    conversationId: "conv1",
    content: "Mình cũng vậy. Dạo này công việc của bạn thế nào?",
    senderId: "user123",
    sender: users.find(u => u._id === "user123"),
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    isRead: true
  },
  {
    _id: "msg4",
    conversationId: "conv1",
    content: "Công việc bận rộn nhưng vui lắm. Mình đang làm dự án mới về ứng dụng mobile.",
    senderId: "user456",
    sender: users.find(u => u._id === "user456"),
    createdAt: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
    isRead: true
  },
  {
    _id: "msg5",
    conversationId: "conv1",
    content: "Hẹn gặp lại bạn vào ngày mai nhé!",
    senderId: "user456",
    sender: users.find(u => u._id === "user456"),
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    isRead: false
  }
];

// Mock messages for conversation 2 (with user789)
export const messages_conv2 = [
  {
    _id: "msg6",
    conversationId: "conv2",
    content: "Bạn đã xem qua tài liệu mình gửi chưa?",
    senderId: "user123",
    sender: users.find(u => u._id === "user123"),
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    isRead: true
  },
  {
    _id: "msg7",
    conversationId: "conv2",
    content: "Rồi, mình vừa mới xem xong. Có vẻ rất thú vị.",
    senderId: "user789",
    sender: users.find(u => u._id === "user789"),
    createdAt: new Date(Date.now() - 1000 * 60 * 85).toISOString(),
    isRead: true
  },
  {
    _id: "msg8",
    conversationId: "conv2",
    content: "Bạn có thắc mắc gì không?",
    senderId: "user123", 
    sender: users.find(u => u._id === "user123"),
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    isRead: true
  },
  {
    _id: "msg9",
    conversationId: "conv2",
    content: "Mình sẽ gửi lại phản hồi chi tiết sau. Cảm ơn bạn đã chia sẻ!",
    senderId: "user789",
    sender: users.find(u => u._id === "user789"),
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    isRead: true
  },
  {
    _id: "msg10",
    conversationId: "conv2",
    content: "Ok, đã nhận được rồi, cảm ơn bạn!",
    senderId: "user123",
    sender: users.find(u => u._id === "user123"),
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: true
  }
];

// Mock all messages mapping by conversation ID
export const allMessages = {
  "conv1": messages_conv1,
  "conv2": messages_conv2,
  "conv3": [
    {
      _id: "msg11",
      conversationId: "conv3",
      content: "Xin chào, mình muốn hỏi về buổi họp tuần sau",
      senderId: "user101",
      sender: users.find(u => u._id === "user101"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      isRead: true
    },
    {
      _id: "msg15",
      conversationId: "conv3",
      content: "Anh đã gửi tài liệu qua email rồi, bạn kiểm tra giúp mình nhé",
      senderId: "user101",
      sender: users.find(u => u._id === "user101"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      isRead: true
    }
  ],
  "conv4": [
    {
      _id: "msg16",
      conversationId: "conv4",
      content: "Chào bạn, mình là Hoàng",
      senderId: "user102",
      sender: users.find(u => u._id === "user102"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      isRead: true
    },
    {
      _id: "msg17",
      conversationId: "conv4",
      content: "Chào Hoàng, rất vui được làm việc với bạn",
      senderId: "user123",
      sender: users.find(u => u._id === "user123"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      isRead: true
    },
    {
      _id: "msg18",
      conversationId: "conv4",
      content: "Mình muốn trao đổi về dự án mới",
      senderId: "user102",
      sender: users.find(u => u._id === "user102"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      isRead: false
    },
    {
      _id: "msg19",
      conversationId: "conv4",
      content: "Bạn có thể gửi chi tiết qua email không?",
      senderId: "user102",
      sender: users.find(u => u._id === "user102"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
      isRead: false
    },
    {
      _id: "msg20",
      conversationId: "conv4",
      content: "Dự án sẽ bắt đầu vào tuần sau, chuẩn bị sẵn sàng nhé!",
      senderId: "user102",
      sender: users.find(u => u._id === "user102"),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      isRead: false
    }
  ]
}; 