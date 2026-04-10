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

---

## Task: Xóa "Thêm bộ sưu tập" khỏi sidebar

### Ngày: 2026-04-10 12:20:09 +0700

### Mô tả công việc:

Xóa mục điều hướng thêm bộ sưu tập khỏi sidebar trang quản trị.

### Công việc đã làm:

- Cập nhật `src/lib/constants.ts`:
  - Trong `adminNavSections` > section `Danh mục`, xóa item menu:
    - `title: "Thêm bộ sưu tập mới"`
    - `href: "/admin/collections/new"`
  - Giữ nguyên các mục còn lại trong sidebar và giữ nguyên route `/admin/collections/new`.

### Kiểm tra:
- `npm run build`: pass (25 routes, 0 error)

---

**Commit message:**
```
chore(admin-sidebar): remove add-collection navigation item
```

---

## Task: Fix hydration mismatch ở AdminSidebar sau khi xóa menu bộ sưu tập

### Ngày: 2026-04-10 12:25:22 +0700

### Mô tả công việc:

Khắc phục lỗi hydration mismatch (server/client render khác nhau ở item sidebar thuộc section `Danh mục`) phát sinh sau khi thay đổi menu admin.

### Công việc đã làm:

- Đọc docs Next.js 16 trong `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md` để xác nhận cách dùng `next/dynamic` với `ssr: false` cho Client Component.
- Cập nhật `src/components/admin/dashboard-shell.tsx`:
  - Thay import trực tiếp `AdminSidebar` bằng dynamic import:
    - `dynamic(() => import("./sidebar").then((mod) => mod.AdminSidebar), { ssr: false })`
  - Mục tiêu: không prerender HTML của sidebar trên server, tránh lệch markup giữa server và client khi menu thay đổi.

### Kiểm tra:
- `npm run build`: pass (25 routes, 0 error)

---

**Commit message:**
```
fix(admin-sidebar): load sidebar client-only to prevent hydration mismatch
```

---

## Task: Fix lỗi `Failed to construct 'URL': Invalid URL` ở bảng sản phẩm

### Ngày: 2026-04-10 12:29:11 +0700

### Mô tả công việc:

Khắc phục lỗi runtime khi render ảnh sản phẩm trong admin table do một số giá trị `images[]` không phải URL hợp lệ cho `next/image`.

### Công việc đã làm:

- Cập nhật `src/lib/utils/format.ts`:
  - Thêm helper `normalizeImageSrc(src)` để chuẩn hóa nguồn ảnh trước khi render:
    - Chấp nhận URL `http/https` hợp lệ.
    - Chấp nhận đường dẫn local bắt đầu bằng `/`.
    - Với path không có scheme (ví dụ `uploads/a.jpg`) tự chuẩn hóa thành path tuyệt đối (`/uploads/a.jpg`).
    - Loại bỏ giá trị rỗng hoặc scheme không hỗ trợ.
- Cập nhật `src/components/admin/product/product-table.tsx`:
  - Dùng `normalizeImageSrc` để lấy ảnh đầu tiên hợp lệ từ `images`.
  - Nếu không có ảnh hợp lệ thì fallback icon placeholder, không render `Image` với `src` lỗi.
- Cập nhật `src/components/admin/product/product-form.tsx`:
  - Khi thêm ảnh mới, chuẩn hóa URL bằng `normalizeImageSrc` trước khi lưu vào state.
  - Khi preview danh sách ảnh, chỉ render `Image` nếu `normalizedUrl` hợp lệ, ngược lại hiển thị placeholder.

### Kiểm tra:
- `npm run build`: pass (25 routes, 0 error)

---

**Commit message:**
```
fix(product-images): normalize image sources to prevent next/image invalid URL crashes
```

---

## Task: Fix lỗi `images?.map is not a function` do API trả `images` dạng string JSON

### Ngày: 2026-04-10 12:33:21 +0700

### Mô tả công việc:

Khắc phục lỗi runtime ở `/admin/products` khi `images` từ API là chuỗi JSON (`"[\"/...\"]"`) thay vì mảng, dẫn tới `images?.map is not a function`.

### Công việc đã làm:

- Cập nhật `src/lib/utils/format.ts`:
  - Thêm helper `toImageArray(images)` để parse/sanitize dữ liệu ảnh từ nhiều kiểu đầu vào:
    - `string[]` hợp lệ.
    - chuỗi JSON của mảng ảnh.
    - chuỗi đơn lẻ.
  - Kết hợp với `normalizeImageSrc` để chuẩn hóa path/URL và loại bỏ giá trị không hợp lệ.
- Cập nhật `app/api/products/route.ts`:
  - GET list: luôn trả `images` dưới dạng `string[]` bằng `toImageArray(product.images)`.
  - POST create: chuẩn hóa `images` trước khi lưu DB để tránh tiếp tục lưu sai kiểu.
  - Response sau create: luôn trả `images` đã parse đúng kiểu.
- Cập nhật `app/api/products/[id]/route.ts`:
  - GET by id: luôn trả `images` dạng `string[]`.
  - PUT update: chuẩn hóa `images` trước khi ghi DB.
  - Response sau update: luôn trả `images` đúng kiểu.
- Cập nhật UI để thêm lớp an toàn:
  - `src/components/admin/product/product-table.tsx`: dùng `toImageArray(...)` khi lấy ảnh đầu tiên.
  - `src/components/admin/product/product-form.tsx`: khởi tạo/default `images` bằng `toImageArray(...)`.
- Sửa nguồn seed gây sai kiểu dữ liệu:
  - `prisma/seed.ts`: bỏ `JSON.stringify(...)` ở field `images`, lưu trực tiếp mảng JSON như schema `Json` yêu cầu.

### Kiểm tra:
- `npm run build`: pass (25 routes, 0 error)

---

**Commit message:**
```
fix(products-api): normalize images payload to array and handle legacy stringified json
```

---

## Task: Fix lỗi `collections.map is not a function` ở trang tạo/sửa sản phẩm

### Ngày: 2026-04-10 12:36:53 +0700

### Mô tả công việc:

Khắc phục lỗi runtime tại `/admin/products/new` (và phòng ngừa tương tự ở `/admin/products/[id]`) do response `/api/collections` có dạng phân trang `{ data, pagination }` nhưng UI đang dùng trực tiếp như mảng.

### Công việc đã làm:

- Cập nhật `app/admin/(dashboard)/products/new/page.tsx`:
  - Khi fetch categories: chỉ set state khi payload là mảng.
  - Khi fetch collections: hỗ trợ cả 2 dạng payload:
    - mảng trực tiếp `[]`
    - object phân trang `{ data: [] }`
  - Chuẩn hóa để `collections` luôn là `ProductCollection[]` trước khi truyền vào `ProductForm`.
- Cập nhật `app/admin/(dashboard)/products/[id]/page.tsx`:
  - `fetchCategories()` parse an toàn và trả mảng.
  - `fetchCollections()` parse an toàn theo cả 2 dạng (`[]` hoặc `{ data: [] }`).
  - Tránh lỗi `.map` khi API thay đổi format response.

### Kiểm tra:
- `npm run build`: pass (25 routes, 0 error)

---

**Commit message:**
```
fix(product-form): normalize collections response shape on new/edit product pages
```

---

## Task: Thêm Dropzone upload ảnh cho product-form

### Ngày: 2026-04-10

### Mô tả công việc:

Thay thế input paste URL ảnh trong product-form bằng Dropzone cho phép kéo thả và upload trực tiếp, ảnh lưu vào thư mục `public/uploads/products/`.

### Công việc đã làm:

- Tạo API endpoint `app/api/upload/route.ts`:
  - Hỗ trợ POST multipart/form-data, nhận nhiều file cùng lúc.
  - Validate: chỉ chấp nhận JPEG, PNG, GIF, WebP; giới hạn 5MB/file.
  - Lưu file vào `public/uploads/products/` với tên ngẫu nhiên UUID để tránh trùng lặp.
  - Trả về mảng URL `/uploads/products/<filename>` sau khi upload thành công.
- Tạo component `src/components/ui/dropzone.tsx`:
  - Dùng HTML5 Drag & Drop API, không cần package bổ sung.
  - Hỗ trợ kéo thả, click để chọn file, chọn nhiều file.
  - Preview ảnh đã upload với thumbnail.
  - Thanh progress khi upload, trạng thái loading/error.
  - Xóa ảnh đã upload bằng nút X trên thumbnail.
  - Hiển thị "Ảnh chính" cho ảnh đầu tiên.
  - Auto-cleanup ObjectURL khi component unmount hoặc upload xong.
- Cập nhật `src/components/admin/product/product-form.tsx`:
  - Thay phần Images Card từ input URL + button "Thêm" sang dùng component `Dropzone`.
  - Xóa state `newImageUrl`, hàm `handleAddImage`, `handleRemoveImage` không còn cần thiết.
  - Xóa import `Image` từ next/image, `ImageIcon`, `X`, `normalizeImageSrc` không còn dùng.
  - Thêm handler `handleImagesChange` để sync state images lên form.

### Kiểm tra:
- `npm run build`: pass (26 routes, 0 error)

---

**Commit message:**
```
feat(product-images): add dropzone upload with /api/upload endpoint for product images
```

---

## Task: Thêm radio button chọn featured image trong Dropzone

### Ngày: 2026-04-10

### Mô tả công việc:

Mỗi sản phẩm có nhiều ảnh, cần cho phép chọn 1 ảnh làm featured image (ảnh chính). Dropzone hiển thị toàn bộ ảnh đã upload với radio button (icon Star) trên mỗi ảnh để chọn featured.

### Công việc đã làm:

- Cập nhật `prisma/schema.prisma`:
  - Thêm field `featuredImage String?` vào model `Product`.
  - Chạy `prisma generate` để cập nhật Prisma client.
- Cập nhật `src/types/product.ts`:
  - Thêm `featuredImage: string | null` vào interface `Product`.
  - Thêm `featuredImage?: string` vào interface `CreateProductInput`.
- Cập nhật `src/components/ui/dropzone.tsx`:
  - Thêm props `featuredImage?: string | null` và `onFeaturedChange?: (url: string | null) => void`.
  - Mỗi thumbnail ảnh có nút Star ở góc trái trên - click để chọn featured.
  - Ảnh featured có border brand + ring, nhãn "Ảnh chính" ở góc trái dưới.
  - Khi upload xong ảnh đầu tiên và chưa có featured thì auto chọn featured.
  - Khi xóa ảnh featured thì tự động chọn ảnh đầu tiên còn lại.
- Cập nhật `src/components/admin/product/product-form.tsx`:
  - Thêm state `featuredImage` với logic khởi tạo: ưu tiên `product.featuredImage`, fallback ảnh đầu tiên trong mảng `images`.
  - Thêm handler `handleFeaturedChange` để sync featured state.
  - Truyền `featuredImage` và `onFeaturedChange` vào Dropzone.
  - Thêm `featuredImage: featuredImage || undefined` vào submit data.
- Cập nhật API routes:
  - `app/api/products/route.ts`: GET list và POST create xử lý `featuredImage`.
  - `app/api/products/[id]/route.ts`: GET by id và PUT update xử lý `featuredImage`.

### Kiểm tra:
- `npm run build`: pass (26 routes, 0 error)
- `npx prisma generate`: thành công

---

**Commit message:**
```
feat(product-images): add featured image selection with radio button in dropzone
```
