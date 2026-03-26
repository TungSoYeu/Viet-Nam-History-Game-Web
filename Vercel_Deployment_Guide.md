# Hướng Dẫn Triển Khai Full-Stack Lên Vercel 🚀

Dự án của bạn đã được cấu hình hoàn chỉnh để chạy toàn bộ (Full-Stack) trên Vercel. 
- **Frontend (Nhánh public):** Vercel sẽ tự động build thư mục React `frontend/`.
- **Backend (API):** Vercel sẽ tự động biến Express App trong thư mục `backend/` thành Serverless Function qua điểm nối ở `api/index.js`.
- **Upload Avatar:** Đã được tự động chuyển từ ổ cứng cục bộ sang dịch vụ `Vercel Blob Storage`.

Dưới đây là các bước chi tiết để bạn tự đưa lên Vercel.

---

## Bước 1: Đẩy mã nguồn lên GitHub 🐙

Trước tiên, bạn cần đảm bảo toàn bộ mã nguồn hiện tại đã được commit và đẩy lên tài khoản GitHub của bạn.

```bash
git add .
git commit -m "Configure Monorepo for Vercel Full-Stack"
git push origin main
```

*(Lưu ý: Bạn không cần đẩy thư mục node_modules hay frontend/build, vì Vercel sẽ tự động cài đặt).*

---

## Bước 2: Nhập dự án vào Vercel ⚙️

1. Truy cập [Vercel.com](https://vercel.com/) và đăng nhập bằng tài khoản GitHub của bạn.
2. Trên màn hình Dashboard, bấm **`Add New...`** -> **`Project`**.
3. Tại phần `Import Git Repository`, tìm kho chứa GitHub của dự án này và bấm **`Import`**.

---

## Bước 3: Cấu hình Dự án trên Vercel 🛠️

Trên màn hình "Configure Project", hãy thiết lập **chính xác** các cài đặt sau:

- **Project Name:** Tên tùy chọn (vd: `history-game-vietnam`)
- **Framework Preset:** Để mặc định là `Other` (Do chúng ta đã tự định nghĩa file `vercel.json` ở gốc rồi).
- **Root Directory:** Để nguyên mặc định là gốc dự án (`./`). **Không chọn thư mục `frontend` hay `backend` ở đây!**

### Biến Môi Trường (Environment Variables) 🔐

Nhấn mở rộng phần **Environment Variables** và dán chính xác các biến sau. *(Lấy giá trị từ file `backend/.env` hiện tại của bạn)*:

| Tên (Key) | Giá trị (Value) |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb://tungnghienhy:tvantung1... (Lưu ý copy toàn bộ chuỗi Replica Set từ file .env)` |
| `JWT_SECRET` | `suviet_jwt_secret_key_change...` |
| `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` |
| `ADMIN_SECRET_CODE`| `HISTORY_ADMIN_2024` |

> ⚠️ **Lưu ý:** Biến `REACT_APP_API_URL` là **Không cần thiết** điền vào Vercel, vì app Frontend tự động gọi API cùng Domain trên Vercel khi chạy ở môi trường production.

Sau khi điền xong, ấn **`Deploy`** và chờ khoảng 1 - 2 phút để Vercel build dự án. ⏳

---

## Bước 4: Thiết lập chức năng tải Ảnh Đại Diện (Vercel Blob) 🖼️

Hệ thống upload ảnh của bạn đã được mình tích hợp dùng Vercel Blob (bắt buộc cho dạng Serverless thay vì Multer local). Để chức năng này hoạt động:

1. Quay lại trang **Dashboard của Vercel** cho dự án vừa tạo.
2. Bấm vào Tab **`Storage`** nằm trên menu ngang.
3. Chọn **`Create`** -> **`Blob`**
4. Vercel sẽ hiện thông báo liên kết (Connect) kho lưu trữ vào dự án của bạn hiện tại. Chọn `Connect`.
5. Vercel sẽ tự động sinh ra và thêm biến môi trường `BLOB_READ_WRITE_TOKEN` vào hệ thống Serverless cho bạn. Hệ thống Avatar sẽ ngay lập tức hoạt động được!

---

## Bước 5: Kiểm tra và hoàn tất 🎉

1. Trở về lại Tab `Deployments` hoặc bảng Dashboard.
2. Có thể bạn sẽ cần nhấp chọn dấu 3 chấm `...` và ấn **`Redeploy`** để mã backend ăn theo cái Biến Môi Trường (Blob Token) vừa thêm.
3. Bấm vào Domain Vercel cấp cho bạn và thử đăng nhập, upload avatar, chơi thử 1 vòng để tận hưởng thành quả!
