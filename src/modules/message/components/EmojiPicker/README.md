# Tính năng Emoji/Sticker trong Chat

## Tổng quan

Tính năng này cho phép người dùng thêm emoji và sticker vào tin nhắn chat một cách dễ dàng thông qua giao diện picker trực quan.

## Các tính năng chính

### 1. **Emoji Picker**
- Click vào nút emoji (😊) bên trái ô nhập tin nhắn để mở picker
- Giao diện popup với nhiều danh mục emoji khác nhau
- Có thể chọn nhiều emoji liên tiếp mà không cần đóng picker

### 2. **Danh mục Emoji**

#### 🌟 Phổ biến (Popular)
- Chứa 60+ emoji được sử dụng nhiều nhất
- Bao gồm: 😂, ❤️, 😍, 🤣, 😊, 🙏, 💕, 😭, 😘, 👍, v.v.

#### 😀 Mặt cười (Smileys)
- Các biểu tượng cảm xúc khuôn mặt
- Từ vui vẻ đến buồn bã, ngạc nhiên, v.v.

#### ❤️ Cảm xúc (Emotions)
- Tim, biểu tượng tình yêu
- Các biểu tượng cảm xúc mạnh mẽ

#### 👋 Cử chỉ (Gestures)
- Tay, ngón tay, các cử chỉ
- 👍, 👎, 👏, 🙏, ✌️, v.v.

#### 🐶 Động vật (Animals)
- Các loại động vật phổ biến
- Từ chó, mèo đến động vật hoang dã

#### ⚽ Đồ vật (Objects)
- Thể thao, đồ chơi, đồ vật
- Các biểu tượng hoạt động

## Cách sử dụng

### Thêm emoji vào tin nhắn:
1. Click vào nút emoji (😊) ở góc trái ô nhập tin nhắn
2. Chọn danh mục bằng cách click vào các tab phía trên
3. Click vào emoji muốn thêm
4. Emoji sẽ được chèn vào vị trí con trỏ trong ô nhập tin nhắn
5. Có thể tiếp tục chọn nhiều emoji khác

### Đóng emoji picker:
- Click vào bất kỳ đâu bên ngoài picker
- Gửi tin nhắn cũng sẽ tự động đóng picker

## Kỹ thuật triển khai

### Components
- **EmojiPicker**: Component chính hiển thị danh sách emoji
- **ChatInput**: Component đã được cập nhật để tích hợp emoji picker

### Features
- ✅ Click vào emoji để thêm vào tin nhắn
- ✅ Chèn emoji tại vị trí con trỏ
- ✅ Nhiều danh mục emoji
- ✅ Giao diện responsive và dễ sử dụng
- ✅ Hover effect khi di chuột qua emoji
- ✅ Click outside để đóng picker
- ✅ Tự động focus lại vào input sau khi chọn emoji

### Styling
- Material-UI components
- Responsive design
- Smooth animations
- Custom scrollbar
- Hover effects với scale transform

## Tương lai mở rộng

Có thể mở rộng thêm:
- [ ] Tìm kiếm emoji
- [ ] Emoji gần đây (Recently used)
- [ ] Custom stickers
- [ ] Animated stickers/GIFs
- [ ] Emoji skin tone selector
- [ ] Emoji favorites

## Files liên quan

```
FaceTok_client/src/modules/message/
├── components/
│   ├── EmojiPicker/
│   │   ├── EmojiPicker.jsx      # Component chính
│   │   └── index.js              # Export file
│   └── ChatInput/
│       └── ChatInput.jsx         # Đã tích hợp emoji picker
```

## Dependencies

- @mui/material
- @mui/icons-material
- React Hooks (useState, useRef, useEffect)

---

**Lưu ý**: Tính năng này hoạt động hoàn toàn offline và không yêu cầu tải thêm tài nguyên từ server.
