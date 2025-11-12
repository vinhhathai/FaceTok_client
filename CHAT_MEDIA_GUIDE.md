# Hướng Dẫn Sử Dụng Tính Năng Media trong Chat

## 📝 Tổng Quan

Tính năng cho phép gửi ảnh và video trong tin nhắn chat với các tính năng:
- ✅ Gửi tối đa 5 files cùng lúc
- ✅ Hỗ trợ ảnh (jpg, png, gif...) và video (mp4, mov, avi...)
- ✅ Giới hạn 50MB/file
- ✅ Preview file trước khi gửi
- ✅ Hiển thị ảnh/video trong tin nhắn
- ✅ Tự động tạo thumbnail cho video
- ✅ Click ảnh để xem full size

## 🎨 UI Components Đã Cập Nhật

### 1. ChatInput Component
**File:** `src/modules/message/components/ChatInput/ChatInput.jsx`

**Thay đổi:**
- ✅ Thêm file input với accept="image/*,video/*"
- ✅ Button đính kèm file (AttachFileOutlinedIcon)
- ✅ Preview files đã chọn dạng Chips
- ✅ Xóa file preview (CloseIcon)
- ✅ Validate file type và size
- ✅ Giới hạn 5 files tối đa

**Props cập nhật:**
```jsx
onSendMessage: PropTypes.func.isRequired // Nhận (message, files) thay vì chỉ (message)
```

**Cách sử dụng:**
```jsx
<ChatInput 
  onSendMessage={(message, files) => handleSendMessage(message, files)}
  disabled={!connected}
  loading={sending}
/>
```

### 2. MessageItem Component
**File:** `src/modules/message/components/MessageItem/MessageItem.jsx`

**Thay đổi:**
- ✅ Hiển thị media từ `message.media` array
- ✅ Grid layout cho nhiều ảnh (1 ảnh: 400px, nhiều ảnh: 2 cột 300px)
- ✅ Image với onClick để mở tab mới
- ✅ Video với controls và poster thumbnail
- ✅ Content text là optional khi có media

**Message schema:**
```javascript
{
  _id: "message_id",
  content: "Text message (optional)",
  media: [
    {
      type: "image" | "video",
      url: "https://cloudinary.com/...",
      publicId: "chaotok/chat/images/xxx",
      thumbnail: "https://cloudinary.com/..." // Chỉ cho video
      width: 1920,
      height: 1080,
      size: 1024000,
      duration: 30 // Chỉ cho video (seconds)
    }
  ],
  createdAt: "2025-01-01T00:00:00.000Z",
  senderId: {...},
  isRevoked: false
}
```

### 3. ChatBox Component
**File:** `src/modules/message/components/ChatBox/ChatBox.jsx`

**Thay đổi:**
- ✅ handleSendMessage nhận thêm tham số `files`
- ✅ Tạo FormData khi có files
- ✅ Gọi API với multipart/form-data

**Logic gửi tin nhắn:**
```javascript
const handleSendMessage = async (content, files = []) => {
  if (files.length > 0) {
    const formData = new FormData();
    formData.append('content', content.trim());
    files.forEach(file => {
      formData.append('files', file);
    });
    await sendMessageToRoom(roomId, formData, true);
  } else {
    await sendMessageToRoom(roomId, content.trim());
  }
};
```

### 4. Message API
**File:** `src/modules/message/api/messageAPI.js`

**Thay đổi:**
```javascript
export const sendMessageToRoom = async (roomId, content, isFormData = false) => {
  const config = isFormData ? {
    headers: { 'Content-Type': 'multipart/form-data' }
  } : {};
  
  const payload = isFormData ? content : { content };
  
  const response = await apiClient.post(
    `/message/room/${roomId}/message`, 
    payload, 
    config
  );
  return response.data;
};
```

## 🔄 Luồng Hoạt Động

### 1. Gửi Tin Nhắn Có Media

```
User chọn file
    ↓
ChatInput: Validate & Preview
    ↓
User nhấn Send
    ↓
ChatBox: Tạo FormData
    ↓
messageAPI: POST với multipart/form-data
    ↓
Backend: Upload lên Cloudinary + Lưu DB
    ↓
Socket: Broadcast message mới với media
    ↓
MessageItem: Hiển thị ảnh/video
```

### 2. Nhận Tin Nhắn Có Media

```
Socket: message_sent event
    ↓
Redux: Thêm message vào store
    ↓
MessageList: Re-render
    ↓
MessageItem: Render media từ message.media array
```

## 📱 Responsive Design

### Desktop (>900px)
- ✅ Preview files dạng row với Chips
- ✅ Ảnh hiển thị max 400px (1 ảnh) hoặc 300px (nhiều ảnh)
- ✅ Video với controls đầy đủ

### Mobile (<900px)
- ✅ Preview files vẫn dạng row nhưng wrap
- ✅ Ảnh responsive width: 100%
- ✅ Video chiếm full width message bubble

## 🎯 Validation Rules

### Client-side (ChatInput)
```javascript
// File type
const validFiles = files.filter(file => {
  return file.type.startsWith('image/') || file.type.startsWith('video/');
});

// File size (50MB)
const validatedFiles = filesToAdd.filter(file => {
  if (file.size > 50 * 1024 * 1024) {
    alert(`File ${file.name} quá lớn (max 50MB)`);
    return false;
  }
  return true;
});

// Max 5 files
setSelectedFiles(prev => [...prev, ...validatedFiles].slice(0, 5));
```

### Server-side (Backend)
- Multer: memoryStorage, 5 files max, 50MB limit
- Sharp: Resize image to max 1920x1080, quality 85%
- Cloudinary: Auto-generate thumbnail cho video

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Gửi tin nhắn chỉ text
- [ ] Gửi tin nhắn chỉ media (không text)
- [ ] Gửi tin nhắn có cả text và media
- [ ] Gửi 1 ảnh
- [ ] Gửi nhiều ảnh (2-5)
- [ ] Gửi 1 video
- [ ] Gửi mix ảnh + video

### Validation
- [ ] Upload file > 50MB → Show alert
- [ ] Chọn > 5 files → Chỉ nhận 5 files đầu
- [ ] Upload file không phải ảnh/video → Bị filter
- [ ] Button send disabled khi không có content và files

### UI/UX
- [ ] Preview files dạng Chips với icon phù hợp
- [ ] Xóa file từ preview
- [ ] Ảnh hiển thị đúng layout (1 vs nhiều ảnh)
- [ ] Click ảnh mở tab mới
- [ ] Video có controls và thumbnail
- [ ] Loading state khi đang gửi
- [ ] Tin nhắn thu hồi vẫn hoạt động với media

### Real-time
- [ ] Sender nhận tin nhắn ngay sau khi gửi
- [ ] Receiver nhận tin nhắn qua socket
- [ ] Media hiển thị đúng ở cả 2 phía

## 🐛 Troubleshooting

### File không upload được
1. Kiểm tra file size < 50MB
2. Kiểm tra file type là image/* hoặc video/*
3. Kiểm tra network tab: Request có Content-Type: multipart/form-data?
4. Kiểm tra backend logs: Multer có nhận được files?

### Ảnh không hiển thị
1. Kiểm tra `message.media` array có dữ liệu?
2. Kiểm tra `media.url` có valid?
3. Kiểm tra CORS policy của Cloudinary
4. Kiểm tra Console có lỗi network?

### Video không play
1. Kiểm tra video format (mp4 được hỗ trợ rộng rãi nhất)
2. Kiểm tra `media.thumbnail` có hiển thị?
3. Kiểm tra video codec (H.264 được recommend)

## 🚀 Future Enhancements

- [ ] Image viewer modal với zoom/pan
- [ ] Video progress bar custom
- [ ] Upload progress indicator
- [ ] Compress video trước khi upload
- [ ] Support thêm file types (PDF, DOC...)
- [ ] Drag & drop files
- [ ] Paste image từ clipboard
- [ ] Image editing (crop, rotate, filter)
- [ ] Video trimming
- [ ] Voice messages

## 📚 Related Files

### Components
- `src/modules/message/components/ChatInput/ChatInput.jsx`
- `src/modules/message/components/MessageItem/MessageItem.jsx`
- `src/modules/message/components/ChatBox/ChatBox.jsx`

### API
- `src/modules/message/api/messageAPI.js`

### Backend
- `FaceTok_Sever/src/modules/message/controllers/MessageController.js`
- `FaceTok_Sever/src/shared/middlewares/uploadMessageMedia.js`
- `FaceTok_Sever/src/shared/utils/cloudinaryUpload.js`

### Documentation
- Backend: `FaceTok_Sever/CHAT_MEDIA_FEATURE.md`
- Frontend: `CHAT_MEDIA_GUIDE.md` (this file)
