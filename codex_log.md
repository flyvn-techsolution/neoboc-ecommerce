# Codex Log

## Task: Bắt đầu phiên làm việc của Codex

### Ngày: 2026-04-09

### Mô tả công việc:

Thêm log mốc để đánh dấu các task từ thời điểm này do Codex thực hiện.

---

## Task: Thêm file setup.md

### Ngày: 2026-04-09

### Mô tả công việc:

Tạo file `setup.md` hướng dẫn setup project khi chuyển máy mới hoặc cài đặt trên VPS (không bao gồm hướng dẫn cài đặt môi trường Node, database...).

### Công việc đã làm:

- Tạo file `setup.md` với các nội dung:
  - Yêu cầu hệ thống (Node.js, PostgreSQL, Git)
  - Các bước cài đặt chi tiết (clone, install, config, database)
  - Thông tin đăng nhập mặc định sau khi seed
  - Cấu trúc thư mục quan trọng
  - Các lệnh hữu ích (npm scripts, prisma commands)
  - Khắc phục sự cố thường gặp

### Kiểm tra:
- `npm run build`: pass

---

**Commit message:**
```
docs: add setup.md with project installation guide
```

---

## Task: Đổi màu đỏ cho dấu required trong form sản phẩm

### Ngày: 2026-04-09 21:09:27 +07

### Mô tả công việc:

Cập nhật style trong form thêm/sửa sản phẩm để các dấu `*` (trường bắt buộc) hiển thị màu đỏ.

### Công việc đã làm:

- Chỉnh `src/components/admin/product/product-form.tsx` tại các label bắt buộc:
  - `Tên sản phẩm *`
  - `Slug *`
  - `Giá bán *`
- Tách dấu `*` thành `<span className="text-red-500">*</span>` để chỉ đổi màu ký tự required, giữ nguyên style phần text label.

### Kiểm tra:
- `npm run build`: pass (24 routes, 0 error)

---

**Commit message:**
```
style(product-form): make required asterisks red in product create/edit form
```

---

## Task: Bỏ checkbox tự động tạo slug và đồng bộ slug theo tên sản phẩm

### Ngày: 2026-04-09 21:14:17 +07

### Mô tả công việc:

Xóa checkbox `Tự động tạo` ở trường slug. Khi tên sản phẩm thay đổi thì slug tự động generate theo tên. Người dùng vẫn có thể chỉnh slug thủ công mà không ảnh hưởng đến tên sản phẩm.

### Công việc đã làm:

- Cập nhật `src/components/admin/product/product-form.tsx`:
  - Xóa state `autoSlug` và phần UI checkbox `Tự động tạo`.
  - Cập nhật `handleNameChange` để luôn gọi `setValue("slug", generateSlug(value))` khi input tên sản phẩm thay đổi.
  - Dọn biến không còn dùng (`watchedName`) sau khi bỏ logic checkbox.
- Giữ nguyên input slug có thể nhập tay (`{...register("slug")}`), nên người dùng vẫn chỉnh slug bình thường.

### Kiểm tra:
- `npm run build`: pass (24 routes, 0 error)

---

**Commit message:**
```
refactor(product-form): remove auto-slug toggle and always sync slug with product name changes
```

---

## Task: Hiển thị validation messages trong form sản phẩm

### Ngày: 2026-04-09 21:54:32 +07

### Mô tả công việc:

Sửa logic validate để các thông báo lỗi được hiển thị đúng trên form thêm/sửa sản phẩm khi submit dữ liệu không hợp lệ.

### Công việc đã làm:

- Cập nhật `src/components/admin/product/product-form.tsx`:
  - Thêm `setError` và `clearErrors` từ `react-hook-form`.
  - Trong `handleFormSubmit`, gọi `clearErrors()` trước khi validate thủ công.
  - Map các lỗi từ `validateForm(...)` vào form state bằng `setError(...)` để `errors.<field>.message` hiển thị trên UI.
- Giữ nguyên các rule validate hiện có:
  - `name`: bắt buộc
  - `slug`: bắt buộc + đúng pattern slug
  - `price`: >= 0
  - `stock`: >= 0

### Kiểm tra:
- `npm run build`: pass (24 routes, 0 error)

---

**Commit message:**
```
fix(product-form): show validation messages by mapping manual validation errors to react-hook-form
```

---

## Task: Hiển thị border/ring đỏ cho input invalid

### Ngày: 2026-04-09 22:06:40 +07

### Mô tả công việc:

Khi field trong form thêm/sửa sản phẩm có validation message, input tương ứng hiển thị trạng thái lỗi bằng border đỏ và focus ring đỏ.

### Công việc đã làm:

- Cập nhật `src/components/admin/product/product-form.tsx`:
  - Thêm `className` có điều kiện cho các input có validate lỗi:
    - `name`
    - `slug`
    - `price`
    - `stock`
  - Khi có lỗi: áp dụng `border-red-500 focus-visible:ring-red-500`.
- Giữ nguyên logic hiển thị message bên dưới input, chỉ bổ sung visual state cho input invalid.

### Kiểm tra:
- `npm run build`: pass (24 routes, 0 error)

---

**Commit message:**
```
style(product-form): highlight invalid inputs with red border and focus ring
```

---

## Task: Chuyển vị trí toast lên góc trên bên phải

### Ngày: 2026-04-09 22:15:47 +07

### Mô tả công việc:

Thay đổi vị trí hiển thị toast từ `bottom-right` sang `top-right`.

### Công việc đã làm:

- Cập nhật `src/hooks/use-toast.tsx`:
  - Đổi class viewport từ `bottom-4 right-4` thành `top-4 right-4`.
  - Giữ nguyên các style và behavior toast khác.

### Kiểm tra:
- `npm run build`: pass (24 routes, 0 error)

---

**Commit message:**
```
style(toast): move toast viewport to top-right position
```
