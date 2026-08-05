# META PIXEL — SETUP & KIỂM TRA (bds-moi-gioi-7vukhi)

Pixel ID: **2519402271814770**

> ⚠️ **QUY TẮC SỐ 1 — CHỈ SỬA TRONG THƯ MỤC `web-deploy/`.**
> Bản đang chạy trên Vercel là thư mục này. File `index.html` ở thư mục cha là bản cũ,
> **không có Meta Pixel**. Nếu deploy nhầm thư mục cha, toàn bộ Pixel sẽ biến mất và
> mọi chiến dịch quảng cáo mất dữ liệu mà không báo lỗi gì cả.

---

## 1. Mã đã gắn ở đâu

| File | Vai trò |
|------|---------|
| Mã Pixel gốc | Ngay trước `</head>` của **cả 5 trang** |
| `pixel-events.js` | Sự kiện hành vi dùng chung — nạp ở cuối `<body>` cả 5 trang |
| `vsl.js` | 9 khối video VSL + đo lượt bấm xem từng video |
| Mã trong từng trang | Các sự kiện riêng của trang đó (xem bảng dưới) |

---

## 2. Toàn bộ sự kiện đang chạy

### Sự kiện chuẩn của Meta (dùng để tối ưu quảng cáo)

| Sự kiện | Bắn khi nào | Trang |
|---------|-------------|-------|
| `PageView` | Mở trang | Cả 5 trang |
| `ViewContent` | Khách cuộn tới **bảng giá** | index |
| `InitiateCheckout` | Tạo đơn xong, chuẩn bị thanh toán (kèm số tiền) | dang-ky |
| `AddPaymentInfo` | Khách tới màn hình VietQR (kèm số tiền) | thanh-toan |
| `Lead` | Đăng ký bonus miễn phí thành công | cam-on |
| `Purchase` | Thanh toán thành công (số tiền động theo đơn) | xac-nhan |

### Sự kiện riêng (dùng để phân tích và tạo tệp remarketing)

| Sự kiện | Ý nghĩa | Trang |
|---------|---------|-------|
| `ClickCTA` | Bấm nút dẫn tới /dang-ky (kèm chữ trên nút, loại nút) | index |
| `VideoPlay` | **Bấm xem video** — kèm tên và số thứ tự đoạn VSL | index |
| `ViewSection` | Cuộn tới khối quan trọng (Bộ 3 Vũ Khí / Bảng giá / FAQ / CTA cuối) | index |
| `ScrollDepth` | Đọc tới 25% – 50% – 75% – 90% trang | Mọi trang dài |
| `TimeOnPage` | Ở lại 30s / 90s / 180s — đo chất lượng traffic quảng cáo | Cả 5 trang |
| `OpenFAQ` | Mở câu hỏi nào (biết khách vướng mắc điều gì) | index |
| `SelectPath` | Chọn gói Miễn phí hay 499k | dang-ky |
| `ToggleOrderBump` | Bật/tắt gói kèm riêng 1–1 (688k) | dang-ky |
| `SubmitForm` | Bấm gửi form (kèm nghề nghiệp + nỗi đau khách chọn) | dang-ky |
| `FormError` | **Form lỗi** — biết ngay khi mất khách vì trục trặc kỹ thuật | dang-ky |
| `CopyBankInfo` | Bấm "Sao chép" nội dung chuyển khoản — tín hiệu mua mạnh nhất | thanh-toan |
| `ClickZalo` / `ClickEmail` / `ClickPhone` | Bấm liên hệ | Cả 5 trang |
| `ClickOutbound` | Bấm link ra ngoài trang | Cả 5 trang |

---

## 3. ✅ KIỂM TRA **TRƯỚC** KHI DEPLOY

Làm trên máy, trước khi đẩy lên Vercel:

- [ ] Đang sửa đúng thư mục `web-deploy/` (không phải thư mục cha).
- [ ] Mở file, tìm chuỗi `2519402271814770` — phải thấy trong **cả 5** file HTML.
- [ ] Mỗi file HTML phải có dòng `<script src="/pixel-events.js" defer></script>`.
- [ ] File `pixel-events.js` và `vsl.js` có nằm trong thư mục sắp deploy không.
- [ ] Nếu vừa dán mã YouTube vào `vsl.js`: mã phải nằm trong dấu nháy `'...'`,
      và là **mã video** (11 ký tự) chứ không phải cả đường link.
- [ ] Mở thử trang bằng cách nhấp đúp `index.html` — không thấy khối đỏ/lỗi vỡ giao diện.

---

## 4. ✅ KIỂM TRA **SAU** KHI DEPLOY (quan trọng nhất)

Làm ngay trên bản live, **trước khi bật tiền quảng cáo**:

1. Cài extension **Meta Pixel Helper** trên Chrome (nếu chưa có).
2. Mở https://bds-moi-gioi-7vukhi.vercel.app/ → bấm icon Pixel Helper.
   → Phải thấy ID `2519402271814770` và sự kiện **PageView** màu xanh.
3. Cuộn xuống hết trang → Pixel Helper phải hiện thêm **ScrollDepth**, **ViewSection**, **ViewContent**.
4. Bấm thử một nút CTA → phải hiện **ClickCTA**.
5. Bấm thử một video (nếu đã gắn) → phải hiện **VideoPlay**.
6. Vào `/dang-ky` → chọn gói 499k → phải hiện **SelectPath**.
7. Vào **Events Manager** (business.facebook.com/events_manager) → chọn Pixel →
   tab **Test Events** → nhập địa chỉ trang để xem sự kiện chạy trực tiếp.
   *(Nên test bằng cách này để dữ liệu thử không lẫn vào dữ liệu thật.)*

> **Nếu Pixel Helper báo "No pixel found":** gần như chắc chắn đã deploy nhầm thư mục cha.
> Deploy lại đúng `web-deploy/`.

### Đừng test bằng đơn hàng thật
Muốn thử luồng mua, dùng **Test Events** trong Events Manager. Nếu bắt buộc phải chạy
thử đơn thật, nhớ xoá dòng đó khỏi Google Sheet sau khi test xong.

---

## 5. Cách deploy để bản live cập nhật

Sửa file xong **PHẢI** deploy lại Vercel:
- Nếu nối GitHub: commit + push thư mục này → Vercel tự build.
- Nếu kéo-thả thủ công: vào Vercel → dự án → deploy lại thư mục `web-deploy`.

---

## 6. Gợi ý dùng cho quảng cáo

- Mục tiêu gom lead miễn phí → tối ưu theo **Lead**.
- Mục tiêu bán thẳng → tối ưu theo **Purchase**.
- Tệp remarketing đáng tiền nhất, xếp theo độ nóng:
  1. `CopyBankInfo` mà chưa `Purchase` — đã định chuyển tiền rồi bỏ giữa chừng.
  2. `InitiateCheckout` / `AddPaymentInfo` mà chưa `Purchase`.
  3. `VideoPlay` đoạn 8 (Bằng chứng + chào giá) — đã xem tới phần giá.
  4. `ViewContent` (đã xem bảng giá) mà chưa `SelectPath`.
  5. `ScrollDepth` 75% mà chưa bấm CTA.
- `VideoPlay` còn dùng để biết **đoạn VSL nào bị bỏ qua** → đoạn đó cần đổi tiêu đề,
  đổi ảnh đại diện, hoặc đổi vị trí trên trang.

> Lưu ý: Meta có thể tự sinh thêm sự kiện tự động (ví dụ "StartTrial") do tính năng
> auto-detect. Tắt được trong Events Manager → Settings → Automatic Events.
