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

---

## Task: Hiển thị ảnh featuredImage trong product-table

### Ngày: 2026-04-10 13:11:19 +0700

### Mô tả công việc:

Đảm bảo cột ảnh trong bảng sản phẩm ưu tiên hiển thị `featuredImage` (ảnh chính) thay vì chỉ lấy ảnh đầu tiên từ mảng `images`.

### Công việc đã làm:

- Cập nhật `src/components/admin/product/product-table.tsx`:
  - Import thêm `normalizeImageSrc`.
  - Trong cell cột `Hình ảnh`:
    - Ưu tiên lấy ảnh từ `row.original.featuredImage`.
    - Nếu `featuredImage` không có hoặc không hợp lệ thì fallback về ảnh đầu tiên của `images` để tương thích dữ liệu cũ.

### Kiểm tra:
- `npm run build`: pass (26 routes, 0 error)

---

**Commit message:**
```
fix(product-table): prioritize featuredImage for thumbnail preview
```

---

## Task: Toast thành công có nền xanh nhẹ

### Ngày: 2026-04-10 13:14:58 +0700

### Mô tả công việc:

Đảm bảo tất cả toast thành công trong trang admin hiển thị nền xanh nhẹ bằng cách dùng variant `success`.

### Công việc đã làm:

- Cập nhật các trang dùng `useToast` để bổ sung `variant: "success"` cho toast có `title: "Thành công"`:
  - `app/admin/(dashboard)/products/new/page.tsx`
  - `app/admin/(dashboard)/products/[id]/page.tsx`
  - `app/admin/(dashboard)/products/page.tsx`
  - `app/admin/(dashboard)/collections/new/page.tsx`
  - `app/admin/(dashboard)/collections/[id]/page.tsx`
  - `app/admin/(dashboard)/collections/page.tsx`
- Giữ nguyên toast lỗi với `variant: "destructive"`.
- Lưu ý: style `success` đã có sẵn trong `src/hooks/use-toast.tsx` (`bg-green-50 border-green-200 text-green-900`), nên chỉ cần gán đúng variant ở nơi gọi.

### Kiểm tra:
- `npm run build`: pass (26 routes, 0 error)

---

**Commit message:**
```
style(toast): apply success variant for success notifications in admin pages
```

---

## Task: Bổ sung tự động tạo slug cho category-form và collection-form

### Ngày: 2026-04-10 13:53:29 +0700

### Mô tả công việc:

Thêm tính năng tự động tạo `slug` từ `name` cho form phân loại và bộ sưu tập để đồng bộ hành vi nhập liệu với product form.

### Công việc đã làm:

- Cập nhật `src/components/admin/category/category-form.tsx`:
  - Dùng helper `generateSlug` từ `@/lib/utils/format` thay vì khai báo hàm local trong component.
  - Khi thay đổi trường `name`, tự động cập nhật trường `slug` theo giá trị đã chuẩn hóa.
  - Loại bỏ điều kiện chỉ tự tạo slug ở chế độ tạo mới, đảm bảo đổi tên là cập nhật slug ngay.
- Cập nhật `src/components/admin/collection/collection-form.tsx`:
  - Dùng helper `generateSlug` từ `@/lib/utils/format` thay vì khai báo hàm local trong component.
  - Khi thay đổi trường `name`, tự động cập nhật trường `slug` theo giá trị đã chuẩn hóa.
  - Loại bỏ điều kiện chỉ tự tạo slug ở chế độ tạo mới, đảm bảo đổi tên là cập nhật slug ngay.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
feat(forms): auto-generate category and collection slug from name
```

---

## Task: Di chuyển section SEO sang cột phải trong category-form

### Ngày: 2026-04-10 13:56:35 +0700

### Mô tả công việc:

Điều chỉnh bố cục `category-form` để section `SEO` nằm ở cột bên phải và hiển thị bên dưới section `Trạng thái`.

### Công việc đã làm:

- Cập nhật `src/components/admin/category/category-form.tsx`:
  - Gỡ card `SEO` khỏi cột trái (`lg:col-span-2`).
  - Chèn card `SEO` vào cột phải (`space-y-6`) ngay sau card `Trạng thái`.
  - Giữ nguyên toàn bộ field, validation, nội dung text và style hiện có của SEO form.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
refactor(category-form): move SEO section to right sidebar below status
```

---

## Task: Xóa section Trạng thái và chuyển action bar category-form giống collection-form

### Ngày: 2026-04-10 14:00:01 +0700

### Mô tả công việc:

Điều chỉnh `category-form` theo yêu cầu:
- Xóa section `Trạng thái`.
- Đưa switch trạng thái lên cạnh nút lưu ở phần action bar phía trên.
- Dùng cụm nút `Quay lại` và `Lưu` giống cấu trúc của `collection-form`.

### Công việc đã làm:

- Cập nhật `src/components/admin/category/category-form.tsx`:
  - Thêm action bar phía trên form, gồm:
    - Nút `Quay lại` kiểu `ghost` ở bên trái.
    - Switch `isActive` + label trạng thái (`Đang hiển thị` / `Đã ẩn`) cạnh nút lưu ở bên phải.
    - Nút `Lưu phân loại`.
  - Xóa hoàn toàn card `Trạng thái` ở cột phải.
  - Xóa thanh action cuối form (border top) để tránh trùng cụm nút điều khiển.
  - Giữ nguyên section `SEO` ở cột phải.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
refactor(category-form): replace status card with top action bar like collection form
```

---

## Task: Gộp menu Danh mục vào Sản phẩm và đưa Đơn hàng lên trên

### Ngày: 2026-04-10 14:02:40 +0700

### Mô tả công việc:

Điều chỉnh menu sidebar admin theo yêu cầu:
- Di chuyển toàn bộ menu trong section `Danh mục` vào section `Sản phẩm`.
- Đưa section `Đơn hàng` lên trên section `Sản phẩm`.

### Công việc đã làm:

- Cập nhật `src/lib/constants.ts` trong `adminNavSections`:
  - Di chuyển section `Đơn hàng` lên ngay sau `Tổng quan`.
  - Gộp các item `Bộ sưu tập` và `Phân loại` vào section `Sản phẩm`.
  - Xóa section `Danh mục` riêng để tránh trùng nội dung.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
refactor(sidebar): merge category menu into product section and move orders above products
```

---

## Task: Xóa menu "Thêm sản phẩm mới" trong sidebar

### Ngày: 2026-04-10 14:04:34 +0700

### Mô tả công việc:

Xóa item menu `Thêm sản phẩm mới` khỏi section `Sản phẩm` trong sidebar admin.

### Công việc đã làm:

- Cập nhật `src/lib/constants.ts`:
  - Xóa item:
    - `title: "Thêm sản phẩm mới"`
    - `href: "/admin/products/new"`
    - `icon: Package`
  - Giữ nguyên các item còn lại trong section `Sản phẩm`.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
refactor(sidebar): remove create-product menu item
```

---

## Task: Đổi tên menu "Danh sách sản phẩm" thành "Sản phẩm"

### Ngày: 2026-04-10 14:06:25 +0700

### Mô tả công việc:

Đổi tên item menu trong section `Sản phẩm` từ `Danh sách sản phẩm` thành `Sản phẩm`.

### Công việc đã làm:

- Cập nhật `src/lib/constants.ts`:
  - Đổi `title` của item có `href: "/admin/products"` từ `Danh sách sản phẩm` -> `Sản phẩm`.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
refactor(sidebar): rename product list menu to products
```

---

## Task: Bỏ lưu trạng thái expand menu và chỉ mở nhánh theo trang hiện tại

### Ngày: 2026-04-10 14:09:49 +0700

### Mô tả công việc:

Xóa tính năng lưu trạng thái expand của sidebar menu. Khi mở menu, chỉ expand section/menu con tương ứng với route hiện tại.

### Công việc đã làm:

- Cập nhật `src/components/admin/sidebar.tsx`:
  - Xóa toàn bộ logic persist `expandedSections` và `expandedChildren` qua `localStorage`.
  - Xóa các state và handler toggle mở/đóng section/menu con theo kiểu lưu thủ công.
  - Thêm logic tính `expandedSections` và `expandedChildren` bằng `useMemo` dựa trên `pathname` + query hiện tại.
  - Chỉ mở section/menu con có chứa item active; các section/menu khác mặc định thu gọn.
  - Chuyển nút toggle section/menu con sang hiển thị trạng thái thụ động theo nhánh active hiện tại.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
refactor(sidebar): expand only active route branch and remove persisted menu state
```

---

## Task: Khôi phục nút expand submenu sau khi bỏ lưu trạng thái

### Ngày: 2026-04-10 14:12:31 +0700

### Mô tả công việc:

Sửa lỗi nút expand submenu không hoạt động sau lần refactor sidebar; vẫn giữ yêu cầu không lưu trạng thái expand vào localStorage.

### Công việc đã làm:

- Cập nhật `src/components/admin/sidebar.tsx`:
  - Khôi phục state cục bộ `expandedSections` và `expandedChildren` để hỗ trợ thao tác expand/collapse bằng nút.
  - Khôi phục handler `toggleSection` và `toggleChildren` cho section header và icon expand của submenu.
  - Giữ nguyên nguyên tắc không persist localStorage.
  - Dùng `activeExpansion` (tính từ route hiện tại) làm trạng thái mặc định và tự đồng bộ lại khi đổi trang/query, đảm bảo lúc mở trang chỉ mở nhánh tương ứng.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
fix(sidebar): restore submenu expand toggle without reintroducing persisted state
```

---

## Task: Product-form load toàn bộ danh mục và bộ sưu tập (không lọc active)

### Ngày: 2026-04-10 14:18:04 +0700

### Mô tả công việc:

Điều chỉnh luồng dữ liệu cho `product-form` để tải toàn bộ danh mục và bộ sưu tập, thay vì chỉ lấy các bản ghi `isActive=true`.

### Công việc đã làm:

- Cập nhật `src/lib/api/category-api.ts`:
  - Thêm hàm `fetchAllCategories()` để lấy toàn bộ danh mục qua phân trang (lặp nhiều trang `pageSize=100`).
- Cập nhật `src/lib/api/collection-api.ts`:
  - Thêm hàm `fetchAllCollections()` để lấy toàn bộ bộ sưu tập qua phân trang (lặp nhiều trang `pageSize=100`).
- Cập nhật `app/admin/(dashboard)/products/new/page.tsx`:
  - Thay fetch trực tiếp với query `isActive=true` bằng `fetchAllCategories()` và `fetchAllCollections()`.
  - Đồng bộ lại set state `categories`/`collections` từ dữ liệu full list.
- Cập nhật `app/admin/(dashboard)/products/[id]/page.tsx`:
  - Thay các hàm fetch local (đang gọi `isActive=true`) bằng `fetchAllCategories()` và `fetchAllCollections()`.
  - Cập nhật query key React Query sang `["categories", "all"]` và `["collections", "all"]`.
  - Dọn import không còn sử dụng sau refactor.

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
feat(product-form): load all categories and collections instead of active-only
```

---

## Task: Cập nhật DB và product-form theo mô hình biến thể mới + tồn kho tổng

### Ngày: 2026-04-10 14:27:27 +0700

### Mô tả công việc:

Refactor dữ liệu sản phẩm theo yêu cầu mới:
- Biến thể không còn `loại biến thể + giá trị`, chỉ còn `tên biến thể`, `SKU`, `tồn kho`, `ảnh biến thể`.
- Bổ sung chọn ảnh biến thể từ danh sách ảnh đã có của sản phẩm trong `product-form`.
- Bỏ tồn kho cấp sản phẩm; tồn kho sản phẩm được tính bằng tổng tồn kho các biến thể.

### Công việc đã làm:

- Cập nhật schema Prisma:
  - `prisma/schema.prisma`:
    - Xóa field `stock` khỏi model `Product`.
    - Cập nhật model `ProductVariant`:
      - Xóa `variantName`, `optionValue`.
      - Thêm `name` và `image`.
      - Giữ `sku`, `stock`.
- Thêm migration DB:
  - `prisma/migrations/20260410142500_variant_image_and_remove_product_stock/migration.sql`:
    - Thêm cột `name`, migrate dữ liệu từ `option_value/variant_name`.
    - Thêm cột `image`.
    - Xóa cột `variant_name`, `option_value`.
    - Xóa cột `stock` của bảng `products`.
- Cập nhật API sản phẩm:
  - `app/api/products/route.ts`:
    - Xử lý biến thể theo cấu trúc mới (`name`, `sku`, `stock`, `image`).
    - Không nhận/ghi `product.stock` nữa.
    - Trả `stock` dạng computed = tổng `variants.stock`.
    - Với sort theo `stock`: sort theo tồn kho tổng computed rồi mới phân trang.
  - `app/api/products/[id]/route.ts`:
    - Cập nhật PUT theo cấu trúc biến thể mới.
    - Bỏ update `product.stock`.
    - Trả `stock` computed từ variants.
- Cập nhật type:
  - `src/types/product.ts`:
    - `ProductVariant`: đổi sang `name`, `sku`, `stock`, `image`.
    - `CreateProductInput`: bỏ `stock` cấp sản phẩm.
- Cập nhật `product-form`:
  - `src/components/admin/product/product-form.tsx`:
    - Xóa input `Số lượng tồn kho` của sản phẩm.
    - Thêm hiển thị `tồn kho tổng` computed từ danh sách biến thể.
    - Đổi UI biến thể sang 4 trường:
      - Tên biến thể
      - SKU
      - Tồn kho
      - Ảnh biến thể (select từ ảnh sản phẩm đã upload)
    - Khi ảnh sản phẩm bị xóa, tự clear `image` ở biến thể nếu ảnh đó không còn tồn tại.
    - Payload submit biến thể theo schema mới.
- Cập nhật dữ liệu seed:
  - `prisma/seed.ts`:
    - Xóa `stock` ở create product.
    - Đổi dữ liệu `productVariant` sang `name` + `image` + `stock`.
- Đồng bộ Prisma Client:
  - Chạy `npx prisma generate`.

### Kiểm tra:
- `npx prisma generate`: thành công
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
feat(product-variants): migrate to name-sku-stock-image model and derive product stock from variants
```
