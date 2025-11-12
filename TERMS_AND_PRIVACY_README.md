# Terms of Service & Privacy Policy - Chaotok

## 📋 Tổng quan

Hệ thống Điều khoản Dịch vụ (Terms of Service) và Chính sách Bảo mật (Privacy Policy) đầy đủ cho nền tảng mạng xã hội Chaotok, được thiết kế để:

- ✅ Tuân thủ pháp luật Việt Nam
- ✅ Bảo vệ quyền lợi người dùng
- ✅ Bảo vệ nền tảng khỏi rủi ro pháp lý
- ✅ Minh bạch về cách xử lý dữ liệu
- ✅ Dễ đọc, dễ hiểu cho người dùng Việt Nam

## 🗂️ Cấu trúc Files

```
src/shared/
├── data/
│   ├── termsOfService.js      # Nội dung Điều khoản Dịch vụ
│   └── privacyPolicy.js        # Nội dung Chính sách Bảo mật
├── components/
│   ├── TermsAndPrivacyDialog/ # Component hiển thị điều khoản
│   │   ├── TermsAndPrivacyDialog.jsx
│   │   └── index.js
│   └── TermsPrivacyFooter/    # Footer link điều khoản
│       ├── TermsPrivacyFooter.jsx
│       └── index.js
```

## 📖 Nội dung Điều khoản Dịch vụ

### 12 Mục chính:

1. **Chấp Nhận Điều Khoản** - Đồng ý sử dụng dịch vụ
2. **Điều Kiện Sử Dụng** - Độ tuổi, tài khoản, trách nhiệm
3. **Nội Dung Bị Cấm** - 10 loại nội dung vi phạm
4. **Hành Vi Bị Cấm** - 7 hành vi không được phép
5. **Quyền Sở Hữu Nội Dung** - Quyền của người dùng và nền tảng
6. **Bảo Mật & Quyền Riêng Tư** - Thu thập và sử dụng dữ liệu
7. **Quyền Sở Hữu Trí Tuệ** - Bản quyền và thương hiệu
8. **Chấm Dứt Tài Khoản** - Quy trình xóa/khóa tài khoản
9. **Từ Chối Trách Nhiệm** - Giới hạn trách nhiệm pháp lý
10. **Thay Đổi Điều Khoản** - Cách thông báo khi có thay đổi
11. **Luật Áp Dụng** - Pháp luật Việt Nam & giải quyết tranh chấp
12. **Liên Hệ** - Thông tin hỗ trợ

## 🔒 Nội dung Chính sách Bảo mật

### 12 Mục chính:

1. **Giới Thiệu** - Cam kết bảo vệ quyền riêng tư
2. **Thông Tin Thu Thập** - Loại dữ liệu được thu thập
3. **Cách Sử Dụng Thông Tin** - Mục đích sử dụng dữ liệu
4. **Chia Sẻ Thông Tin** - Không bán dữ liệu, chỉ chia sẻ khi cần
5. **Bảo Mật Dữ Liệu** - Biện pháp bảo vệ
6. **Lưu Trữ Dữ Liệu** - Thời gian lưu trữ
7. **Quyền Của Người Dùng** - 7 quyền cơ bản (GDPR-inspired)
8. **Quyền Riêng Tư Trẻ Em** - Bảo vệ trẻ dưới 18 tuổi
9. **Cookies** - Sử dụng và quản lý cookies
10. **Chuyển Giao Dữ Liệu** - Bảo vệ khi chuyển dữ liệu
11. **Thay Đổi Chính Sách** - Cách thông báo cập nhật
12. **Liên Hệ** - Thông tin hỗ trợ

## 🎨 Components

### 1. TermsAndPrivacyDialog

Component chính hiển thị điều khoản trong dialog với 2 tabs.

**Props:**
- `open` (boolean): Mở/đóng dialog
- `onClose` (function): Callback khi đóng
- `onAccept` (function): Callback khi chấp nhận
- `requireAcceptance` (boolean): Bắt buộc chấp nhận hay không

**Features:**
- 2 tabs: Điều khoản & Chính sách
- Checkbox xác nhận đã đọc (nếu requireAcceptance=true)
- Không cho đóng dialog nếu chưa chấp nhận
- Scroll qua tất cả các mục
- Hiển thị phiên bản và ngày cập nhật

### 2. TermsPrivacyFooter

Component footer với link mở điều khoản.

**Props:**
- `sx` (object): Custom styling

**Features:**
- Link "Điều khoản Dịch vụ"
- Link "Chính sách Bảo mật"
- Copyright text
- Mở TermsAndPrivacyDialog khi click

## 💻 Cách Sử Dụng

### 1. Trong form Đăng ký

```jsx
import React, { useState } from 'react';
import TermsAndPrivacyDialog from '@/shared/components/TermsAndPrivacyDialog';

function RegisterForm() {
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = () => {
    if (!acceptedTerms) {
      setTermsDialogOpen(true);
      return;
    }
    // Proceed with registration
  };

  return (
    <>
      <button onClick={handleRegister}>Đăng ký</button>
      
      <TermsAndPrivacyDialog
        open={termsDialogOpen}
        onClose={() => setTermsDialogOpen(false)}
        onAccept={() => {
          setAcceptedTerms(true);
          // Proceed with registration
        }}
        requireAcceptance={true}
      />
    </>
  );
}
```

### 2. Trong Footer trang web

```jsx
import React from 'react';
import TermsPrivacyFooter from '@/shared/components/TermsPrivacyFooter';

function AppFooter() {
  return (
    <footer>
      <TermsPrivacyFooter />
    </footer>
  );
}
```

### 3. Trong Settings/Profile

```jsx
import React, { useState } from 'react';
import { Link } from '@mui/material';
import TermsAndPrivacyDialog from '@/shared/components/TermsAndPrivacyDialog';

function SettingsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <Link onClick={() => setDialogOpen(true)}>
        Xem Điều khoản & Chính sách
      </Link>
      
      <TermsAndPrivacyDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAccept={() => setDialogOpen(false)}
        requireAcceptance={false}
      />
    </div>
  );
}
```

## 🔧 Tùy chỉnh

### Cập nhật nội dung

Chỉnh sửa file `termsOfService.js` hoặc `privacyPolicy.js`:

```javascript
export const termsOfService = {
  lastUpdated: "12/11/2025", // Cập nhật ngày
  version: "1.0",             // Tăng version
  
  sections: [
    {
      id: "unique-id",
      title: "Tiêu đề mục",
      content: `Nội dung chi tiết...`
    },
    // Thêm hoặc sửa các mục
  ]
};
```

### Thay đổi màu sắc

Trong các component, màu chủ đạo là `#4ECDC4`. Tìm và thay thế để đổi màu:

```jsx
sx={{
  color: '#4ECDC4',  // Màu chính
  background: 'linear-gradient(135deg, #4ECDC4 0%, #3AB0A8 100%)',
}}
```

## ⚖️ Tuân thủ Pháp luật

### Pháp luật Việt Nam được tuân thủ:

1. **Luật An ninh mạng 2018** - Bảo vệ an ninh quốc gia trên mạng
2. **Nghị định 13/2023/NĐ-CP** - Bảo vệ dữ liệu cá nhân
3. **Nghị định 15/2020/NĐ-CP** - Quản lý mạng xã hội
4. **Luật Bảo vệ người tiêu dùng** - Quyền lợi người dùng
5. **Luật Sở hữu trí tuệ** - Bản quyền và thương hiệu

### Các điểm quan trọng:

✅ Yêu cầu xác thực email (định danh người dùng)
✅ Không cho phép ẩn danh hoàn toàn
✅ Quy định rõ nội dung cấm (khiêu dâm, bạo lực, fake news)
✅ Cam kết bảo vệ dữ liệu cá nhân
✅ Quyền xóa dữ liệu và xuất dữ liệu
✅ Bảo vệ trẻ em (yêu cầu 13+ tuổi)
✅ Cơ chế báo cáo vi phạm
✅ Hợp tác với cơ quan chức năng khi có yêu cầu

## 📝 Checklist Triển khai

### Trước khi ra mắt:

- [ ] Cập nhật thông tin liên hệ chính xác (email, địa chỉ, số điện thoại)
- [ ] Đăng ký doanh nghiệp hợp pháp
- [ ] Xin giấy phép kinh doanh (nếu cần)
- [ ] Thiết lập hệ thống báo cáo nội dung vi phạm
- [ ] Tích hợp Terms vào flow đăng ký
- [ ] Thêm link Terms ở Footer tất cả trang
- [ ] Chuẩn bị form báo cáo vi phạm bản quyền (DMCA)
- [ ] Thiết lập email support@ và privacy@
- [ ] Backup dữ liệu định kỳ
- [ ] Log hoạt động người dùng (cho mục đích pháp lý)

### Sau khi ra mắt:

- [ ] Review và cập nhật điều khoản 6 tháng/lần
- [ ] Theo dõi thay đổi pháp luật
- [ ] Phản hồi yêu cầu người dùng trong 7 ngày
- [ ] Lưu trữ logs tối thiểu 90 ngày
- [ ] Báo cáo định kỳ cho cơ quan quản lý (nếu yêu cầu)

## 🚨 Lưu ý Quan trọng

1. **PHẢI cập nhật thông tin liên hệ thực** - Email, địa chỉ, số điện thoại phải chính xác
2. **PHẢI có cơ chế xử lý khiếu nại** - Phản hồi trong 7 ngày làm việc
3. **KHÔNG được bán dữ liệu người dùng** - Vi phạm pháp luật nghiêm trọng
4. **PHẢI xóa dữ liệu khi người dùng yêu cầu** - Trong vòng 30 ngày
5. **PHẢI hợp tác với cơ quan chức năng** - Khi có yêu cầu pháp lý
6. **PHẢI có giấy phép kinh doanh** - Đăng ký với Bộ TT&TT
7. **PHẢI kiểm duyệt nội dung** - Xóa nội dung vi phạm kịp thời

## 📞 Hỗ trợ

Nếu có thắc mắc về việc triển khai hoặc cần tư vấn pháp lý:

- Tham khảo luật sư chuyên ngành công nghệ
- Liên hệ Bộ Thông tin & Truyền thông
- Tham khảo Cục An toàn thông tin (Bộ TT&TT)

---

**Lưu ý:** Đây là template mang tính tham khảo. Nên có luật sư xem xét trước khi đưa vào sử dụng chính thức.
