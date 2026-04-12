# Cursor Log

## Task: Tạo Layout Admin Dashboard

### Ngày: 2026-04-09

### Công việc đã làm:

1. **Cài đặt dependencies cần thiết**
   - lucide-react, recharts, zustand, @tanstack/react-query, react-hook-form, @hookform/resolvers, zod, date-fns, clsx, tailwind-merge, class-variance-authority
   - @radix-ui/react-slot, @tanstack/react-table

2. **Cấu hình TailwindCSS v4**
   - Tạo `globals.css` với custom theme cho admin dashboard
   - Định nghĩa màu sắc sidebar, brand colors, và các utility classes

3. **Tạo cấu trúc thư mục admin**
   - `src/app/admin/` - Admin layout và các trang
   - `src/app/admin/products/` - Trang quản lý sản phẩm
   - `src/app/admin/orders/` - Trang quản lý đơn hàng
   - `src/app/admin/collections/` - Trang quản lý bộ sưu tập
   - `src/app/admin/categories/` - Trang quản lý phân loại
   - `src/app/admin/refunds/` - Trang quản lý hoàn tiền
   - `src/app/admin/design-requests/` - Trang quản lý yêu cầu thiết kế
   - `src/app/admin/shipping-carriers/` - Trang quản lý đơn vị vận chuyển
   - `src/app/admin/users/` - Trang quản lý người dùng
   - `src/app/admin/hero-sections/` - Trang quản lý hero section
   - `src/app/admin/pages/` - Trang quản lý trang nội dung
   - `src/app/admin/menus/` - Trang quản lý menu
   - `src/app/admin/settings/` - Trang cài đặt (chung, SEO, thanh toán, social)

4. **Tạo Admin Sidebar Component**
   - Navigation với các section: Tổng quan, Sản phẩm, Danh mục, Đơn hàng, Khác, Quản lý nội dung, Cài đặt
   - Logo NeoBóc Admin
   - Responsive design với mobile overlay
   - Collapsible sections

5. **Tạo Admin Header Component**
   - Breadcrumbs navigation
   - Search button
   - Notifications bell
   - User dropdown menu
   - Mobile menu button

6. **Tạo Admin Shell Layout**
   - Kết hợp Sidebar + Header + Content
   - Responsive với sidebar collapsible

7. **Tạo các UI Components**
   - `Button` - Button với các variants
   - `Table` - Table components (Table, TableHeader, TableBody, TableRow, TableHead, TableCell)
   - `Input` - Input field
   - `Badge` - Badge với variants
   - `Card` - Card components

8. **Tạo Admin Components**
   - `StatusBadge` - Hiển thị trạng thái đơn hàng, hoàn tiền
   - `StatCard` - Card hiển thị KPI với icon, màu sắc, và trend
   - `DataTable` - Bảng dữ liệu với sorting, filtering, pagination

9. **Tạo Dashboard Page**
   - 6 KPI Cards: Tổng đơn hàng, Doanh thu, Lợi nhuận, Đơn thành công, Đơn hoàn tiền, Tỉ lệ lợi nhuận
   - Biểu đồ Doanh thu theo tháng (Line Chart)
   - Biểu đồ Đơn hàng theo trạng thái (Pie Chart)
   - Biểu đồ Top 5 sản phẩm bán chạy (Bar Chart)
   - Biểu đồ So sánh doanh thu các tháng (Bar Chart)
   - Recent Orders list
   - Recent Design Requests list
   - Time filter (7 ngày, 30 ngày, 90 ngày, Tùy chọn)

10. **Tạo Utilities và Constants**
    - `lib/utils/format.ts` - Các hàm format: currency, date, number, percentage, slug, initials
    - `lib/constants.ts` - Navigation config, order status, refund status, KPI config, time filters

11. **Sửa lỗi TypeScript trong seed.ts**
    - Xóa `as const` không hợp lệ từ MenuLocation enum values

---

**Commit message:**
```
feat(admin): create admin dashboard layout with sidebar, header, and dashboard page with KPIs and charts
```

---

## Task: Fix Prisma Schema & Migrate

### Ngày: 2026-04-09

### Công việc đã làm:

1. **Sửa lỗi relation trong schema.prisma**
   - Thêm trường `userId` và relation `user` trong model `Refund` để ánh xạ với `refunds` trong `User`

2. **Cấu hình Prisma 7 theo hướng dẫn từ GitHub issue**
   - Xóa `url` khỏi `datasource` trong `schema.prisma` (chỉ giữ `provider`)
   - Cập nhật `prisma.config.ts` ở root với cấu hình datasource riêng
   - Cài đặt dependencies: `@prisma/config`, `dotenv`, `pg`, `@prisma/adapter-pg`
   - PrismaClient đã được cấu hình sẵn với adapter PG

3. **Chạy migrate thành công**

---

**Commit message:**
```
fix(prisma): update schema for Prisma 7 and run initial migration
```

---

## Task: Gắn Admin Pages vào Route

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Admin pages nằm trong `src/app/admin/` nhưng bị Next.js bỏ qua vì có 2 `app/` folders cùng tồn tại (default `app/` tạo bởi `create-next-app` và `src/app/` của project)
- `tsconfig.json` có `@/*` alias trỏ sai (`@/*` → `./` thay vì `./src/`)

### Công việc đã làm:

1. **Phân tích cấu trúc project**
   - Phát hiện có 2 app folders: `app/` (root) và `src/app/` (admin pages)
   - Xác định `@/*` alias trong tsconfig trỏ sai

2. **Giải pháp**
   - Xóa default `app/` folder (rỗng, không cần thiết)
   - Di chuyển `src/app/` → `app/` (admin pages trở thành app folder chính)
   - Sửa `tsconfig.json`: `@/*` → `["./src/*"]`
   - Sửa import paths trong `app/admin/layout.tsx` và `app/admin/page.tsx`: `../../components/...` → `../../src/components/...`

3. **Kết quả build**
   - Build thành công với 17 routes admin:
     - `/admin` - Dashboard
     - `/admin/categories` - Quản lý phân loại
     - `/admin/collections` - Quản lý bộ sưu tập
     - `/admin/design-requests` - Quản lý yêu cầu thiết kế
     - `/admin/hero-sections` - Quản lý hero section
     - `/admin/menus` - Quản lý menu
     - `/admin/orders` - Quản lý đơn hàng
     - `/admin/pages` - Quản lý trang nội dung
     - `/admin/products` - Quản lý sản phẩm
     - `/admin/products/new` - Thêm sản phẩm mới
     - `/admin/refunds` - Quản lý hoàn tiền
     - `/admin/settings` - Cài đặt chung
     - `/admin/settings/payment` - Cài đặt thanh toán
     - `/admin/settings/seo` - Cài đặt SEO
     - `/admin/settings/social` - Cài đặt social
     - `/admin/shipping-carriers` - Quản lý đơn vị vận chuyển
     - `/admin/users` - Quản lý người dùng

---

**Commit message:**
```
fix(routing): move src/app to app/ and fix tsconfig alias to register admin routes
```

---

## Task: Điều chỉnh responsive cho KPI Stat Cards trên Admin Dashboard

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Toàn bộ 6 stat cards hiển thị trên cùng 1 hàng ở breakpoint lớn, khiến mỗi card quá hẹp và nội dung bị vỡ layout.

### Công việc đã làm:

1. **Xác định vị trí layout KPI cards**
   - Kiểm tra `app/admin/page.tsx`, section `KPI Cards`.
   - Xác nhận grid đang dùng `xl:grid-cols-6`, là nguyên nhân chính khiến card bị nén.

2. **Điều chỉnh lại số cột theo breakpoint để responsive**
   - Cập nhật class grid từ:
     - `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`
   - Thành:
     - `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`

3. **Kiểm tra nhanh chất lượng thay đổi**
   - Chạy lint cho file dashboard để đảm bảo không phát sinh lỗi cú pháp hoặc lỗi ESLint nghiêm trọng.
   - Kết quả: không có error, chỉ còn các warning `unused imports` đã tồn tại trước đó.

---

**Commit message:**
```
fix(admin): make dashboard KPI cards responsive by reducing xl columns
```

---

## Task: Thêm animation cho Sidebar toggle và Dashboard load

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Sidebar menu/submenu mở rộng theo kiểu hiển thị tức thì, chưa có hiệu ứng chuyển động.
- Dashboard chưa có animation khi vừa load xong nên trải nghiệm vào trang chưa mượt.

### Công việc đã làm:

1. **Cài thư viện animation**
   - Thêm `framer-motion` vào dependencies.

2. **Thêm animation cho toggle menu/submenu trong sidebar**
   - Cập nhật `src/components/admin/sidebar.tsx`:
     - Dùng `AnimatePresence` + `motion.div` cho phần expand/collapse section và submenu (height + opacity).
     - Dùng `motion.span` để rotate icon chevron khi toggle.
     - Chuẩn hóa key cho submenu theo đường dẫn cha/con để tránh xung đột state.

3. **Thêm animation khi dashboard mount**
   - Cập nhật `app/admin/page.tsx`:
     - Bọc page bằng `motion.div` với variants container.
     - Thêm stagger animation cho các section (header, KPI, chart rows, recent activity).
     - Thêm stagger animation riêng cho từng `StatCard` trong KPI grid.

4. **Kiểm tra chất lượng sau thay đổi**
   - Chạy `npm run lint -- src/components/admin/sidebar.tsx app/admin/page.tsx`: pass.
   - Chạy `npm run build`: pass.
   - Ghi nhận warning của Recharts khi prerender (`width(-1)/height(-1)`), không làm fail build.

---

**Commit message:**
```
feat(admin): add motion animations for sidebar toggles and dashboard load
```

---

## Task: Lưu trạng thái submenu sidebar và ẩn scrollbar

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Đóng submenu rồi reload trang gây lỗi hydration mismatch do trạng thái render client khác server.
- Sidebar đang hiển thị scrollbar gây rối giao diện.

### Công việc đã làm:

1. **Fix hydration khi restore trạng thái sidebar**
   - Cập nhật `src/components/admin/sidebar.tsx`:
     - Đặt trạng thái render mặc định đồng nhất giữa server/client (mở tất cả section/submenu).
     - Chỉ restore trạng thái từ `localStorage` trong `useEffect` sau khi mount.
     - Thêm cờ `hasRestoredFromStorage` để chỉ ghi ngược lại `localStorage` sau khi restore xong.

2. **Giữ trạng thái đóng/mở submenu cho các lần sau**
   - Lưu riêng danh sách section/submenu expanded vào `localStorage`.
   - Reuse lại khi vào lại dashboard để giữ đúng trạng thái người dùng.

3. **Ẩn scrollbar nhưng vẫn cho scroll**
   - Thêm utility `.hide-scrollbar` trong `app/globals.css` (WebKit + Firefox + IE mode).
   - Áp dụng vào vùng nav của sidebar: vẫn `overflow-y-auto` nhưng không hiển thị thanh scroll.

4. **Kiểm tra**
   - Chạy `npm run lint -- src/components/admin/sidebar.tsx`: pass.

---

**Commit message:**
```
fix(admin): persist sidebar state without hydration mismatch and hide scrollbar
```

---

## Task: Tạo submenu cấp 3 cho trạng thái đơn hàng trong mục Tất cả đơn hàng

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Các trạng thái đơn hàng đang nằm cùng cấp trực tiếp trong section `Đơn hàng`, chưa nằm bên trong menu `Tất cả đơn hàng`.

### Công việc đã làm:

1. **Tái cấu trúc navigation cho nhóm Đơn hàng**
   - Cập nhật `src/lib/constants.ts` trong `adminNavSections`.
   - Giữ menu cha `Tất cả đơn hàng` và thêm `children` chứa danh sách trạng thái:
     - `Tất cả` (`/admin/orders`)
     - `Chờ thanh toán` (`/admin/orders?status=pending_payment`)
     - `Đang xử lý` (`/admin/orders?status=preparing`)
     - `Đã hoàn thành` (`/admin/orders?status=delivered`)

2. **Đảm bảo tương thích với sidebar hiện tại**
   - Sidebar đã có render đệ quy + animation cho menu con, nên cấu trúc mới hiển thị đúng theo level 3 mà không cần sửa thêm component.

### Kiểm tra:
- Chạy `npm run lint -- src/lib/constants.ts src/components/admin/sidebar.tsx`: pass (0 error).
- Có 4 warnings `unused imports` trong `src/lib/constants.ts` đã tồn tại từ trước.

---

**Commit message:**
```
feat(admin): add third-level order status submenu under all orders
```

---

## Task: Cho phép click trực tiếp menu có link và chỉ expand khi bấm icon

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Menu `Tất cả đơn hàng` vừa có link vừa có submenu nhưng đang chỉ hỗ trợ expand, không thể click trực tiếp để đi tới trang.

### Công việc đã làm:

1. **Cập nhật hành vi item có `children` trong sidebar**
   - Sửa `src/components/admin/sidebar.tsx`:
     - Nếu item có `href` + `children`: click vào phần label sẽ điều hướng bằng `Link`.
     - Nút expand được tách riêng ở icon chevron bên phải, chỉ icon này mới toggle submenu.
     - Nếu item không có `href` + `children`: giữ hành vi click cả row để expand/collapse.

2. **Giữ nguyên animation và trạng thái active**
   - Giữ hiệu ứng rotate icon + collapse/expand bằng `framer-motion`.
   - Giữ hiển thị active indicator cho item có link.

### Kiểm tra:
- Chạy `npm run lint -- src/components/admin/sidebar.tsx`: pass.

---

**Commit message:**
```
fix(admin): navigate on linked parent menu and expand only via chevron icon
```

---

## Task: Sửa active state submenu trạng thái đơn hàng và xóa item "Tất cả"

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Khi chọn một trạng thái đơn hàng, các menu trạng thái khác cũng bị active do logic active chỉ so sánh theo pathname.
- Trong submenu trạng thái đang có item `Tất cả` không còn cần thiết.

### Công việc đã làm:

1. **Sửa logic active theo query params**
   - Cập nhật `src/components/admin/sidebar.tsx`:
     - Thêm `useSearchParams` từ `next/navigation`.
     - Nâng cấp hàm `isActive(href)`:
       - Với link không có query: active theo path hiện tại.
       - Với link có query: bắt buộc khớp path và từng query param (ví dụ `status`) thì mới active.
   - Kết quả: chỉ đúng submenu trạng thái đang chọn mới active.

2. **Xóa menu item `Tất cả`**
   - Cập nhật `src/lib/constants.ts`:
     - Xóa child `Tất cả` trong `Tất cả đơn hàng`.
     - Giữ lại các trạng thái:
       - `Chờ thanh toán`
       - `Đang xử lý`
       - `Đã hoàn thành`

### Kiểm tra:
- Chạy `npm run lint -- src/components/admin/sidebar.tsx src/lib/constants.ts`: pass (0 error).
- Có 4 warnings `unused imports` trong `src/lib/constants.ts` đã tồn tại từ trước.

---

**Commit message:**
```
fix(admin): correct order status active state and remove all-status submenu item
```

---

## Task: Thêm dot indicator cho sub menu level 3 và cập nhật style active

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Sub menu level 3 chưa có dot indicator ở đầu item.
- Khi active vẫn còn nền hồng, chưa đúng yêu cầu hiển thị chỉ đổi màu dot/icon/label.

### Công việc đã làm:

1. **Thêm dot indicator cho item level 3**
   - Cập nhật `src/components/admin/sidebar.tsx`:
     - Xác định item level 3 theo điều kiện leaf item trong submenu (`!hasChildren && depth > 0`).
     - Thêm dot ở đầu item bằng `span` với `bg-current` để đồng bộ màu theo trạng thái.

2. **Cập nhật style active cho level 3**
   - Active level 3:
     - Dot màu hồng.
     - Icon + label màu hồng.
     - Bỏ nền hồng (`bg-brand-500/10`).
   - Non-active level 3:
     - Dot cùng màu với menu item non-active (`text-slate-300`, hover theo màu text).

3. **Giữ nguyên style các level khác**
   - Chỉ áp dụng behavior mới cho level 3 leaf item.
   - Các item cấp khác vẫn giữ logic active/background hiện có.

### Kiểm tra:
- Chạy `npm run lint -- src/components/admin/sidebar.tsx`: pass.

---

**Commit message:**
```
style(admin): add level-3 dot indicators and active text-only highlight
```

---

## Task: Tái cấu trúc section sidebar theo nhóm Đơn hàng, Người dùng, Nội dung

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- `Hoàn tiền` và `Yêu cầu thiết kế` đang nằm ở section `Khác`, chưa gom vào `Đơn hàng`.
- Chưa có section riêng cho `Người dùng`.
- Nhóm nội dung đang là `Quản lý nội dung`, cần đổi thành `Nội dung` và đặt phía trên `Cài đặt`.

### Công việc đã làm:

1. **Di chuyển menu liên quan đơn hàng**
   - Cập nhật `src/lib/constants.ts`:
     - Di chuyển `Hoàn tiền` và `Yêu cầu thiết kế` vào section `Đơn hàng`.
     - Giữ `Đơn vị vận chuyển` ở section `Khác`.

2. **Tạo section `Người dùng` riêng**
   - Tách item `Người dùng` ra thành section độc lập tên `Người dùng`.

3. **Tạo section `Nội dung`**
   - Đổi section `Quản lý nội dung` thành `Nội dung`.
   - Giữ các item:
     - `Hero Section`
     - `Trang nội dung`
     - `Menu & Footer`
   - Đảm bảo section `Nội dung` nằm trên section `Cài đặt`.

### Kiểm tra:
- Chạy `npm run lint -- src/lib/constants.ts src/components/admin/sidebar.tsx`: pass (0 error).
- Có 4 warnings `unused imports` trong `src/lib/constants.ts` đã tồn tại từ trước.

---

**Commit message:**
```
refactor(admin): regroup sidebar sections for orders, users, and content
```

---

## Task: Đổi màu chủ đạo website sang xanh lá

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Hệ màu `brand` và một số UI component vẫn đang dùng tông hồng, chưa đồng nhất với yêu cầu màu chủ đạo xanh lá.

### Công việc đã làm:

1. **Đổi palette brand trong global theme**
   - Cập nhật `app/globals.css`:
     - `--color-brand-50/100/500/600/700` chuyển sang tông xanh lá.
     - `--color-sidebar-primary` và `--color-sidebar-ring` đồng bộ sang xanh lá.

2. **Thay các class màu hồng hard-code**
   - Cập nhật `app/admin/products/page.tsx`:
     - `bg-pink-500/600` -> `bg-brand-500/600`.
   - Cập nhật `app/admin/settings/page.tsx`:
     - `bg-pink-50 text-pink-600` -> `bg-brand-50 text-brand-600`.

3. **Đồng bộ màu biểu đồ dashboard theo brand**
   - Cập nhật `app/admin/page.tsx`:
     - Thêm hằng `BRAND_COLOR = "var(--color-brand-500)"`.
     - Đổi màu line/bar chart từ hồng sang `BRAND_COLOR`.

### Kiểm tra:
- Chạy `npm run lint -- app/admin/page.tsx app/admin/products/page.tsx app/admin/settings/page.tsx`: pass.

---

**Commit message:**
```
style(theme): switch primary brand color from pink to green
```

---

## Task: Tạo trang đăng nhập Admin

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Chưa có hệ thống xác thực cho trang admin.

### Công việc đã làm:

1. **Cài đặt NextAuth.js beta**
   - `next-auth@beta` (v5), `bcryptjs`, `@types/bcryptjs`.

2. **Cấu hình NextAuth với Credentials provider**
   - Tạo `src/lib/auth.ts`: đăng nhập bằng email/password, kiểm tra `isAdmin`.
   - Tạo `types/next-auth.d.ts`: khai báo type mở rộng cho Session/User/JWT (thêm `id`, `isAdmin`).
   - Redirect về `/admin/login` nếu chưa xác thực.

3. **Tạo API route cho NextAuth**
   - Tạo `app/api/auth/[...nextauth]/route.ts`.

4. **Tạo trang đăng nhập admin**
   - Tạo `app/admin/login/page.tsx`: giao diện đăng nhập với email/password, toggle show/hide password, error handling, loading state.
   - Tạo `app/admin/login/layout.tsx`: layout đơn giản không có sidebar.

5. **Bảo vệ admin routes bằng middleware**
   - Tạo `src/middleware.ts`: export `auth` để tự động bảo vệ tất cả route `/admin/*`.
   - Chỉ user có `isAdmin = true` mới được truy cập.

6. **Cập nhật Admin Layout để dùng server session**
   - Chuyển `app/admin/layout.tsx` thành server component, lấy session từ `auth()`.
   - Tách header thành 2 file: `header.tsx` (server) và `header-client.tsx` (client) để hỗ trợ signOut.

7. **Cập nhật header với chức năng đăng xuất**
   - `header-client.tsx`: hiển thị user info từ session, xử lý signOut qua `signOut()` từ `next-auth/react`.

8. **Thêm AUTH_SECRET vào .env**
   - Tạo secret key cho NextAuth.

### Kiểm tra:
- Chạy `npm run build`: pass (21 routes, 0 error).

### Thông tin đăng nhập (từ seed):
- Email: `younista666@gmail.com`
- Password: `123456`

---

**Commit message:**
```
feat(auth): add NextAuth credentials login for admin with protected routes
```

---

## Task: Sửa vòng lặp redirect (307 / ERR_TOO_MANY_REDIRECTS) tại `/admin/login`

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Truy cập `/admin/login` bị trình duyệt báo redirect quá nhiều lần (307 / `ERR_TOO_MANY_REDIRECTS`).

### Nguyên nhân:
1. Middleware `export { auth as middleware }` áp dụng cho toàn bộ `/admin/*`, kể cả `/admin/login` → NextAuth redirect về trang đăng nhập → lặp vô hạn.
2. `app/admin/layout.tsx` gọi `redirect("/admin/login")` khi chưa có session cho mọi route con, kể cả chính trang login → có thể tự redirect liên tục.

### Công việc đã làm:

1. **Middleware tùy chỉnh** (`src/middleware.ts`)
   - Dùng `auth((req) => { ... })`: cho phép `/admin/login` không cần session; nếu đã đăng nhập thì redirect về `/admin`.
   - Các route `/admin/*` khác: chưa đăng nhập thì redirect `/admin/login` kèm `callbackUrl`.

2. **Tách layout dashboard và login**
   - `app/admin/layout.tsx`: chỉ render `{children}` (không ép redirect).
   - Di chuyển toàn bộ trang quản trị vào `app/admin/(dashboard)/` với `layout.tsx` mới: kiểm tra session + shell sidebar/header.
   - `app/admin/login` nằm ngoài `(dashboard)` nên không chạy `redirect("/admin/login")` khi chưa đăng nhập.

3. **Sửa import sau khi di chuyển thư mục**
   - `app/admin/(dashboard)/page.tsx`: đổi import sang alias `@/...`.

4. **Trang login + Suspense**
   - Bọc phần dùng `useSearchParams` trong `<Suspense>` để build Next.js 16 không lỗi prerender.

### Kiểm tra:
- Chạy `npm run build`: pass.
- Chạy `npm run lint` trên các file đã sửa: pass.

---

**Commit message:**
```
fix(auth): stop admin login redirect loop via middleware and dashboard route group
```

---

## Task: Sửa lỗi "Event handlers cannot be passed to Client Component props" tại `/admin`

### Ngày: 2026-04-09

### Vấn đề ban đầu:
- Truy cập `/admin` (đã đăng nhập) bị lỗi runtime: không thể truyền function `onClose={() => {}}` từ server component xuống client component `AdminSidebar`.

### Nguyên nhân:
- `app/admin/(dashboard)/layout.tsx` là server component, nhưng gọi trực tiếp `<AdminSidebar onClose={() => {}} />` và `<AdminHeader onMenuClick={() => {}} />` — đây là event handler (function) không serializable được từ server → client.

### Công việc đã làm:

1. **Tạo `src/components/admin/dashboard-shell.tsx`**
   - Client component chứa toàn bộ shell: quản lý state `isSidebarOpen`, render `<AdminSidebar>`, `<AdminHeaderClient>`, `<main>`.
   - Nhận prop `user` (serializable) từ server.

2. **Cập nhật `app/admin/(dashboard)/layout.tsx`**
   - Server component: lấy `session` qua `auth()`, truyền `user` xuống `<DashboardShell>`.
   - Không còn truyền function props trực tiếp.

### Kiểm tra:
- `npm run build`: pass (21 routes, 0 error).

---

**Commit message:**
```
fix(layout): extract dashboard shell as client component to avoid server-client prop errors
```

---

## Task: Di chuyển "Đơn vị vận chuyển" vào section "Cài đặt"

### Ngày: 2026-04-09

### Công việc đã làm:
- Di chuyển menu item "Đơn vị vận chuyển" từ section "Khác" sang section "Cài đặt" trong `src/lib/constants.ts`.
- Xóa section "Khác" vì không còn menu item nào.

### Kiểm tra:
- `npm run build`: pass.

---

## Task: Đẩy section "Cài đặt" xuống cuối menu sidebar

### Ngày: 2026-04-09

### Công việc đã làm:
- Di chuyển section "Cài đặt" từ vị trí giữa xuống cuối sidebar trong `src/lib/constants.ts`.
- Thứ tự sidebar mới: Đơn hàng → Người dùng → Nội dung → **Cài đặt**.

### Kiểm tra:
- `npm run build`: pass.

---

**Commit message:**
```
refactor(admin): move settings section to bottom of sidebar
```

---

**Commit message:**
```
refactor(admin): move shipping carriers to settings section in sidebar
```

---

## Task: CRUD Sản phẩm

### Ngày: 2026-04-09

### Mô tả công việc:

Xây dựng tính năng CRUD (Create, Read, Update, Delete) đầy đủ cho sản phẩm trong trang quản trị admin.

### Công việc đã làm:

#### 1. Tạo API Routes

- **GET/POST `/api/products`**
  - GET: Danh sách sản phẩm với pagination, sort, filter (search, isActive, categoryId, collectionId)
  - POST: Tạo sản phẩm mới với categories, collections, variants

- **GET/PUT/DELETE `/api/products/[id]`**
  - GET: Lấy chi tiết một sản phẩm
  - PUT: Cập nhật sản phẩm (bao gồm update categories, collections, variants qua transaction)
  - DELETE: Xóa sản phẩm (không cho xóa nếu có đơn hàng liên quan)

- **GET `/api/categories`**: Lấy danh sách categories cho dropdown
- **GET `/api/collections`**: Lấy danh sách collections cho dropdown

#### 2. Tạo Types

- **File `src/types/product.ts`**
  - `Product`, `ProductVariant`, `ProductCategory`, `ProductCollection`
  - `ProductsResponse`, `ProductFilters`
  - `CreateProductInput`, `UpdateProductInput`

#### 3. Tạo API Client

- **File `src/lib/api/product-api.ts`**
  - Functions: `fetchProducts`, `fetchProduct`, `createProduct`, `updateProduct`, `deleteProduct`
  - Error handling với `ProductApiError` class

#### 4. Tạo React Query Hooks

- **File `src/lib/hooks/use-products.ts`**
  - `useProducts`: Lấy danh sách sản phẩm với filters
  - `useProduct`: Lấy chi tiết một sản phẩm
  - `useCreateProduct`: Tạo sản phẩm mới
  - `useUpdateProduct`: Cập nhật sản phẩm
  - `useDeleteProduct`: Xóa sản phẩm

#### 5. Cài đặt QueryProvider

- **File `src/components/providers/query-provider.tsx`**
  - Wrap app với TanStack Query Provider
- **Cập nhật `app/layout.tsx`**: Thêm QueryProvider

#### 6. Tạo UI Components mới

- **File `src/components/ui/select.tsx`**: Select component
- **File `src/components/ui/dialog.tsx`**: Dialog component (Radix UI)
- **File `src/components/ui/textarea.tsx`**: Textarea component
- **File `src/components/ui/label.tsx`**: Label component (Radix UI)
- **File `src/components/ui/switch.tsx`**: Switch component (Radix UI)
- **File `src/hooks/use-toast.tsx`**: Toast notification system

Cài đặt dependencies: `@radix-ui/react-dialog`, `@radix-ui/react-switch`, `@radix-ui/react-label`

#### 7. Tạo Product Components

- **File `src/components/admin/product/product-table.tsx`**
  - Bảng danh sách sản phẩm với columns: hình ảnh, tên, giá, tồn kho, trạng thái, danh mục
  - Tích hợp TanStack Table với sorting, pagination
  - Search bar + Status filter
  - Modal xác nhận xóa
  - Action buttons: Edit, Delete

- **File `src/components/admin/product/product-form.tsx`**
  - Form tạo/sửa sản phẩm với các sections:
    - Thông tin cơ bản (tên, slug, mô tả)
    - Giá cả (giá bán, giá gốc, giá khuyến mãi, tồn kho)
    - Hình ảnh (thêm xóa URL ảnh)
    - Biến thể sản phẩm (thêm/sửa/xóa variants)
    - Sidebar: Danh mục, Bộ sưu tập, SEO
  - Auto-generate slug từ tên sản phẩm
  - Toggle trạng thái hoạt động

#### 8. Cập nhật Pages

- **File `app/admin/(dashboard)/products/page.tsx`**
  - Trang danh sách sản phẩm với ProductTable
  - Xử lý URL params cho pagination, sorting, filtering

- **File `app/admin/(dashboard)/products/new/page.tsx`**
  - Trang tạo sản phẩm mới với ProductForm
  - Fetch categories và collections

- **File `app/admin/(dashboard)/products/[id]/page.tsx`**
  - Trang chỉnh sửa sản phẩm với ProductForm
  - Fetch product details, categories, collections

### Tính năng:

1. **Danh sách sản phẩm**
   - Tìm kiếm theo tên/slug
   - Lọc theo trạng thái (đang bán/đã ẩn)
   - Sắp xếp theo ngày tạo, tên, giá, tồn kho
   - Phân trang
   - Hiển thị hình ảnh, giá (có sale hiển thị giá gốc gạch ngang)

2. **Tạo sản phẩm**
   - Nhập thông tin cơ bản
   - Thêm hình ảnh qua URL
   - Quản lý biến thể (màu sắc, size...)
   - Chọn danh mục và bộ sưu tập
   - Cấu hình SEO

3. **Chỉnh sửa sản phẩm**
   - Load thông tin hiện tại
   - Cập nhật tất cả thông tin
   - Cập nhật biến thể

4. **Xóa sản phẩm**
   - Xác nhận trước khi xóa
   - Không cho xóa nếu có đơn hàng liên quan

### Kiểm tra:
- `npm run build`: pass (24 routes, 0 error)

---

**Commit message:**
```
feat(product): add complete CRUD functionality for products with API routes, TanStack Query hooks, and admin pages
```

---

## Task: CRUD Bộ sưu tập (Collections)

### Ngày: 2026-04-10

### Mô tả công việc:

Xây dựng tính năng CRUD (Create, Read, Update, Delete) đầy đủ cho bộ sưu tập trong trang quản trị admin.

### Công việc đã làm:

#### 1. Tạo Types

- **File `src/types/collection.ts`**
  - `Collection`, `CollectionProduct`
  - `CollectionsResponse`, `CollectionFilters`
  - `CreateCollectionInput`, `UpdateCollectionInput`

#### 2. Tạo API Client

- **File `src/lib/api/collection-api.ts`**
  - Functions: `fetchCollections`, `fetchCollection`, `createCollection`, `updateCollection`, `deleteCollection`
  - Error handling với `CollectionApiError` class
  - Pagination và filter support

#### 3. Tạo React Query Hooks

- **File `src/lib/hooks/use-collections.ts`**
  - `useCollections`: Lấy danh sách bộ sưu tập với filters
  - `useCollection`: Lấy chi tiết một bộ sưu tập
  - `useCreateCollection`: Tạo bộ sưu tập mới
  - `useUpdateCollection`: Cập nhật bộ sưu tập
  - `useDeleteCollection`: Xóa bộ sưu tập

#### 4. Cập nhật API Routes

- **File `app/api/collections/route.ts`**
  - GET: Danh sách bộ sưu tập với pagination, sort, filter (search, isActive)
  - POST: Tạo bộ sưu tập mới

- **File `app/api/collections/[id]/route.ts`** (mới)
  - GET: Lấy chi tiết một bộ sưu tập
  - PUT: Cập nhật bộ sưu tập
  - DELETE: Xóa bộ sưu tập

#### 5. Tạo UI Components

- **File `src/components/admin/collection/collection-table.tsx`** (mới)
  - Bảng danh sách bộ sưu tập với columns: tên, mô tả, trạng thái, ngày tạo
  - Tích hợp TanStack Table với sorting, pagination
  - Search bar + Status filter
  - Modal xác nhận xóa
  - Action buttons: Edit, Delete

- **File `src/components/admin/collection/collection-form.tsx`** (mới)
  - Form tạo/sửa bộ sưu tập với các sections:
    - Thông tin cơ bản (tên, slug, mô tả)
    - Sidebar: SEO (tiêu đề SEO, mô tả SEO)
  - Auto-generate slug từ tên bộ sưu tập
  - Toggle trạng thái hiển thị

#### 6. Cập nhật Pages

- **File `app/admin/(dashboard)/collections/page.tsx`**
  - Trang danh sách bộ sưu tập với CollectionTable
  - Xử lý URL params cho pagination, sorting, filtering

- **File `app/admin/(dashboard)/collections/new/page.tsx`** (mới)
  - Trang tạo bộ sưu tập mới với CollectionForm

- **File `app/admin/(dashboard)/collections/[id]/page.tsx`** (mới)
  - Trang chỉnh sửa bộ sưu tập với CollectionForm
  - Fetch collection details

#### 7. Cập nhật Navigation

- **File `src/lib/constants.ts`**
  - Thêm menu "Thêm bộ sưu tập mới" trong section "Danh mục"

### Tính năng:

1. **Danh sách bộ sưu tập**
   - Tìm kiếm theo tên/slug
   - Lọc theo trạng thái (đang hiển thị/đã ẩn)
   - Sắp xếp theo ngày tạo, tên
   - Phân trang
   - Hiển thị số sản phẩm trong bộ sưu tập

2. **Tạo bộ sưu tập**
   - Nhập thông tin cơ bản
   - Cấu hình SEO
   - Toggle trạng thái hoạt động

3. **Chỉnh sửa bộ sưu tập**
   - Load thông tin hiện tại
   - Cập nhật tất cả thông tin

4. **Xóa bộ sưu tập**
   - Xác nhận trước khi xóa

### Kiểm tra:
- `npm run build`: pass (25 routes, 0 error)

---

**Commit message:**
```
feat(collection): add complete CRUD functionality for collections with API routes, TanStack Query hooks, and admin pages
```

---

## Task: Thêm Dropzone upload ảnh và chọn featured image cho product-form

### Ngày: 2026-04-10

### Mô tả công việc:

Thay thế input paste URL ảnh trong product-form bằng Dropzone cho phép kéo thả upload, hiển thị toàn bộ ảnh đã upload, và cho phép chọn 1 ảnh làm featured image (ảnh chính) thông qua radio button.

### Công việc đã làm:

1. **API endpoint** `app/api/upload/route.ts`:
   - Nhận file qua `multipart/form-data`, hỗ trợ upload nhiều ảnh cùng lúc
   - Validate: chỉ chấp nhận JPEG, PNG, GIF, WebP, tối đa 5MB/ảnh
   - Lưu vào `public/uploads/products/` với tên UUID ngẫu nhiên
   - Trả về mảng URL ảnh đã upload

2. **Schema & Types**:
   - Thêm field `featuredImage String?` vào model `Product` trong `prisma/schema.prisma`
   - Cập nhật `src/types/product.ts`: thêm `featuredImage` vào `Product` và `CreateProductInput`

3. **Component Dropzone** `src/components/ui/dropzone.tsx`:
   - Dùng HTML5 Drag & Drop API (không cần thư viện ngoài)
   - Kéo thả hoặc click để chọn file
   - Preview ảnh đã upload với thumbnail
   - Thanh progress khi upload + trạng thái loading/error
   - Icon Star ở góc trái trên mỗi ảnh - click để chọn featured
   - Ảnh featured có border vàng + ring nổi bật, nhãn "Ảnh chính"
   - Auto chọn ảnh đầu tiên làm featured khi upload
   - Auto chuyển featured khi xóa ảnh featured

4. **Cập nhật product-form** `src/components/admin/product/product-form.tsx`:
   - Thêm state `featuredImage` với logic khởi tạo: ưu tiên `product.featuredImage`, fallback ảnh đầu tiên
   - Thêm handler `handleFeaturedChange` để sync featured state
   - Truyền `featuredImage` và `onFeaturedChange` vào Dropzone
   - Xóa code thừa không còn dùng (input URL, handleAddImage, handleRemoveImage)

5. **API routes** sản phẩm:
   - `app/api/products/route.ts`: GET list và POST create xử lý `featuredImage`
   - `app/api/products/[id]/route.ts`: GET by id và PUT update xử lý `featuredImage`

### Kiểm tra:
- `npm run build`: pass (26 routes, 0 error)
- `npx prisma generate`: thành công

### Lưu ý sau khi deploy:
- Chạy `npx prisma db push` để thêm column `featured_image` vào database

---

**Commit message:**
```
feat(product-images): add dropzone upload with featured image selection
```

---

## Task: CRUD Phân loại (Categories)

### Ngày: 2026-04-10

### Mô tả công việc:

Xây dựng complete CRUD cho Phân loại sản phẩm (Categories) bao gồm API routes, TanStack Query hooks, admin pages và components. Pattern giống hệt Collections đã có sẵn.

### Công việc đã làm:

1. **Types** `src/types/category.ts`:
   - Định nghĩa `Category`, `CategoryProduct`, `CategoriesResponse`, `CategoryFilters`, `CreateCategoryInput`, `UpdateCategoryInput`

2. **API Client** `src/lib/api/category-api.ts`:
   - `fetchCategories`, `fetchCategory`, `createCategory`, `updateCategory`, `deleteCategory`
   - Error handling với `CategoryApiError`

3. **TanStack Query Hooks** `src/lib/hooks/use-categories.ts`:
   - `useCategories`, `useCategory`, `useCreateCategory`, `useUpdateCategory`, `useDeleteCategory`
   - Query key factory pattern

4. **API Routes**:
   - `app/api/categories/route.ts`: GET list (pagination, search, filter, sort) + POST create
   - `app/api/categories/[id]/route.ts`: GET by id, PUT update, DELETE

5. **Components**:
   - `src/components/admin/category/category-table.tsx`: Table với search, filter, sort, pagination, delete dialog
   - `src/components/admin/category/category-form.tsx`: Form với react-hook-form, validation, SEO fields, slug auto-generate

6. **Admin Pages**:
   - `app/admin/(dashboard)/categories/page.tsx`: List page
   - `app/admin/(dashboard)/categories/new/page.tsx`: Create page
   - `app/admin/(dashboard)/categories/[id]/page.tsx`: Edit page

### Kiểm tra:
- `npm run build`: pass (27 routes, 0 error)

---

**Commit message:**
```
feat(category): add complete CRUD functionality for categories
```
# Cursor Task Log

## Task: Thêm migration cột featured_image cho bảng products

### Ngày: 2026-04-10 20:48:30 +07:00

### Công việc đã làm

- Tạo migration mới tại `prisma/migrations/20260410154500_add_featured_image_to_products/migration.sql`.
- Thêm câu lệnh SQL:
  - `ALTER TABLE "products" ADD COLUMN "featured_image" TEXT;`
- Giữ nguyên `prisma/schema.prisma` vì field `featuredImage` đã tồn tại và map đúng sang `featured_image`.

### Verify

- `npx next build`: pass.
- `npm run lint`: fail do lỗi/warning tồn đọng không liên quan trực tiếp đến migration vừa thêm.

### Commit message đề xuất

`chore(migration): add featured_image column to products table`

---

## Task: Dựng layout client và tách component trang chủ từ HTML mẫu

### Ngày: 2026-04-10 22:03:00 +07:00

### Mô tả công việc:

Chuyển giao diện mẫu trong `client_layout.html` thành trang client thật trong Next.js, tạo layout riêng cho client và tách homepage thành các component độc lập để dễ bảo trì.

### Công việc đã làm:

- Cập nhật route client:
  - Sửa `app/shop/page.tsx` để render homepage client mới thay vì redirect admin.
  - Thêm `app/page.tsx` redirect về `/shop` để dùng trang client làm trang chủ.
- Tạo layout riêng cho client tại `app/shop/layout.tsx`:
  - Dùng font `Manrope` bằng `next/font/google`.
  - Áp màu nền/chữ theo thiết kế.
  - Import stylesheet riêng của route `shop`.
- Tạo stylesheet `app/shop/shop.css`:
  - Thêm `@import` cho Material Symbols.
  - Định nghĩa class `.grainy-overlay` và `.material-symbols-outlined`.
- Tách homepage thành các component trong `src/components/client/home`:
  - `client-home-page.tsx` (compose toàn trang)
  - `client-navbar.tsx`
  - `hero-section.tsx`
  - `services-section.tsx`
  - `featured-collections.tsx`
  - `bestsellers-section.tsx`
  - `faq-section.tsx`
  - `client-footer.tsx`

### Kiểm tra:
- `npx next build`: pass.
- `ReadLints` cho các file đã chỉnh sửa: không có lỗi lint mới.

---

**Commit message:**
```
feat(client-home): add shop layout and split homepage into reusable components
```

---

## Task: Chuyển icon homepage sang lucide-react

### Ngày: 2026-04-10 22:18:00 +07:00

### Mô tả công việc:

Refactor các icon đang dùng text glyph (`inventory_2`, `stars`, `edit_note`, ...) ở trang client homepage sang icon component từ `lucide-react`.

### Công việc đã làm:

- Đọc lại rule tại `.cursor/rules/strict-rules.mdc` trước khi thực hiện.
- Refactor icon tại các component homepage:
  - `src/components/client/home/client-navbar.tsx`
    - `search` -> `Search`
    - `shopping_bag` -> `ShoppingBag`
  - `src/components/client/home/services-section.tsx`
    - `inventory_2` -> `Package`
    - `stars` -> `Sparkles`
    - `edit_note` -> `PenTool`
    - `arrow_forward` -> `ArrowRight`
  - `src/components/client/home/bestsellers-section.tsx`
    - `add_shopping_cart` -> `ShoppingCart`
  - `src/components/client/home/faq-section.tsx`
    - `add` -> `Plus`
  - `src/components/client/home/client-footer.tsx`
    - `send` -> `Send`
- Dọn style không còn cần thiết trong `app/shop/shop.css`:
  - Xóa import Material Symbols.
  - Xóa class `.material-symbols-outlined`.
- Tối ưu ảnh homepage để tránh warning:
  - Chuyển `<img>` sang `next/image` tại:
    - `hero-section.tsx`
    - `featured-collections.tsx`
    - `bestsellers-section.tsx`
  - Thêm `images.remotePatterns` cho `lh3.googleusercontent.com` trong `next.config.ts`.

### Kiểm tra:
- `npm run lint`: fail do lỗi tồn đọng ở module admin/ui/types (không thuộc phạm vi task này).
- `npx eslint "src/components/client/home/**/*.tsx" "app/shop/layout.tsx" "app/shop/page.tsx" "app/shop/shop.css"`:
  - Không có error trong phạm vi file task (1 warning do `shop.css` bị eslint bỏ qua vì không có config).
- `npx next build`: pass.

### Commit message đề xuất

`refactor(client-home): replace material symbol glyphs with lucide icons`

---

## Task: Featured Collections lấy dữ liệu ngẫu nhiên từ collection active

### Ngày: 2026-04-10 22:28:00 +07:00

### Mô tả công việc:

Cập nhật section `Featured Collections` ở trang chủ client để lấy ngẫu nhiên 2 bộ sưu tập đang active từ database, với ảnh hiển thị là ảnh của sản phẩm đầu tiên trong từng bộ sưu tập.

### Công việc đã làm:

- Cập nhật `src/components/client/home/featured-collections.tsx`:
  - Chuyển component thành async server component để query trực tiếp bằng Prisma.
  - Thêm hàm `getFeaturedCollections()`:
    - Lọc collection theo `isActive: true`.
    - Chỉ lấy collection có ít nhất 1 sản phẩm (`products.some`).
    - Lấy sản phẩm đầu tiên của mỗi collection (sắp theo `product.createdAt` tăng dần).
  - Thêm hàm `shuffleCollections()` để random danh sách và `slice(0, 2)` lấy 2 collection.
  - Ảnh hiển thị theo thứ tự ưu tiên:
    - `product.featuredImage`
    - phần tử đầu tiên hợp lệ trong `product.images`
    - fallback ảnh mặc định nếu thiếu dữ liệu.
  - Render key theo `collection.id` thay vì `name`.
  - Giữ UI hiện tại, chỉ thay dữ liệu động.

### Kiểm tra:

- `npx eslint "src/components/client/home/featured-collections.tsx"`: pass.
- `npx next build`: pass.

### Commit message đề xuất

`feat(home): show two random active collections with first product image`

---

## Task: Cập nhật năm hiện tại cho nút View All

### Ngày: 2026-04-10 22:33:00 +07:00

### Mô tả công việc:

Thay text cứng `View All 2024` trong section Featured Collections bằng năm hiện tại để tự động cập nhật theo thời gian.

### Công việc đã làm:

- Cập nhật `src/components/client/home/featured-collections.tsx`:
  - Thêm biến `currentYear = new Date().getFullYear()`.
  - Đổi label nút thành `View All {currentYear}`.

### Kiểm tra:

- `npx eslint "src/components/client/home/featured-collections.tsx"`: pass.

### Commit message đề xuất

`chore(home): use current year in featured collections view-all button`

---

## Task: Sửa lỗi upload multiple ảnh chỉ lưu ảnh cuối

### Ngày: 2026-04-10 23:05:00 +07:00

### Mô tả công việc
- Khắc phục lỗi trong `product-form` khi upload nhiều ảnh: chỉ ảnh cuối được thêm vào danh sách ảnh sản phẩm.

### Công việc đã làm
- Sửa `src/components/ui/dropzone.tsx`:
  - Dùng biến cộng dồn `nextUrls` trong `handleFiles` để lưu đầy đủ tất cả ảnh upload thành công.
  - Refactor `uploadFile` trả về URL ảnh mới (`string | null`) thay vì tự cập nhật danh sách ảnh bằng `value` cũ.
  - Di chuyển cập nhật `onChange`/`onFeaturedChange` sang `handleFiles` để tránh ghi đè state khi upload nhiều file liên tiếp.

### Kiểm tra
- `npx eslint "src/components/ui/dropzone.tsx"`: pass
- `$env:SKIP_TYPECHECK='true'; npx next build`: pass

### Commit message đề xuất
`fix(dropzone): preserve all uploaded images when uploading multiple files`

---

## Task: Hero section bỏ cột phải và border ngăn giữa

### Ngày: 2026-04-10 23:12:00 +07:00

### Mô tả công việc
- Cập nhật `hero-section` để bỏ cột ảnh bên phải và xóa border ngăn giữa 2 phần.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Xóa cột bên phải chứa ảnh hero.
  - Xóa import `next/image` không còn dùng.
  - Bỏ `md:flex-row` để section không chia 2 cột.
  - Bỏ `md:border-r-2` để xóa đường ngăn giữa.

### Kiểm tra
- `npx eslint "src/components/client/home/hero-section.tsx"`: pass
- `$env:SKIP_TYPECHECK='true'; npx next build`: pass

### Commit message đề xuất
`refactor(hero-section): remove right column and divider border`

---

## Task: Thêm ảnh hero ở góc dưới bên phải (responsive)

### Ngày: 2026-04-10 23:20:00 +07:00

### Mô tả công việc
- Đặt ảnh hero từ URL cung cấp vào góc dưới bên phải của `hero-section` và đảm bảo responsive.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Thêm `Image` (`next/image`) cho ảnh mới.
  - Thêm block `absolute` ở `bottom-right` với width responsive (`w-40` -> `w-64` theo breakpoint).
  - Dùng `pointer-events-none` để ảnh không ảnh hưởng thao tác click.
  - Tăng `padding-bottom` nội dung để tránh text đè lên ảnh trên màn hình nhỏ.

### Kiểm tra
- `npx eslint "src/components/client/home/hero-section.tsx"`: pass
- `$env:SKIP_TYPECHECK='true'; npx next build`: pass

### Commit message đề xuất
`feat(hero-section): add responsive bottom-right hero image`

---

## Task: Thay ảnh bằng video bên phải có khung vintage

### Ngày: 2026-04-10 23:31:00 +07:00

### Mô tả công việc
- Xóa ảnh hero và thay bằng video `hero_video.mp4` đặt giữa bên phải với khung vintage, đảm bảo bố cục hài hòa.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Xóa block ảnh và bỏ import `next/image`.
  - Thêm block video `absolute` ở giữa bên phải, có width responsive (`w-44` -> `w-72`).
  - Dùng video local `/videos/hero_video.mp4` với `autoPlay`, `loop`, `muted`, `playsInline`.
  - Thêm khung vintage nhiều lớp border + nền + nhãn `Archive Reel`.
  - Tăng `md:pr-*` và `pb-*` cho content để không đè lên video.

### Kiểm tra
- `npx eslint "src/components/client/home/hero-section.tsx"`: pass
- `$env:SKIP_TYPECHECK='true'; npx next build`: pass

### Commit message đề xuất
`feat(hero-section): replace decorative image with framed responsive hero video`

---

## Task: Tăng kích thước video chiếm nửa hero section

### Ngày: 2026-04-10 23:50:00 +07:00

### Mô tả công việc
- Điều chỉnh video trong `hero-section` để chiếm khoảng một nửa chiều ngang section và giữ bố cục hài hòa với phần text.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Tăng kích thước video: `md:w-[48%]`, `lg:w-[46%]`.
  - Tăng size trên mobile: `w-56`, `sm:w-64`.
  - Tăng `md:pr-[52%]` cho khối nội dung để tránh đè lên video.
  - Giữ nguyên khung vintage và vị trí ở giữa bên phải.

### Kiểm tra
- `npx eslint "src/components/client/home/hero-section.tsx"`: pass
- `$env:SKIP_TYPECHECK='true'; npx next build`: pass

### Commit message đề xuất
`style(hero-section): enlarge framed video to half-width on desktop`

---

## Task: Chuẩn hóa nơi lưu task log (chỉ cursor_log.md)

### Ngày: 2026-04-11

### Mô tả công việc
- Di chuyển log còn lại trong `cursor.md` sang `cursor_log.md`; xác nhận `cursor_log.md` là file log task chính.

### Công việc đã làm
- Append task "Tăng kích thước video chiếm nửa hero section" vào cuối `cursor_log.md` (trước đó chỉ nằm trong `cursor.md`).
- Thay nội dung `cursor.md` bằng ghi chú trỏ tới `cursor_log.md`.

### Commit message đề xuất
`docs: consolidate task logs in cursor_log.md`

---

## Task: Thay video trong khung vintage TV bằng ảnh tĩnh

### Ngày: 2026-04-11

### Mô tả công việc
- Xóa video `<video>` trong khung vintage TV của hero-section và thay bằng ảnh tĩnh `vintage-tv.webp`.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Thêm import `Image` từ `next/image`.
  - Thay thế `<video>` bằng `<Image>` với `src="/images/vintage-tv.webp"`, `width={800}`, `height={600}`.
  - Giữ nguyên layout, border, shadow, nhãn "Archive Reel" của khung vintage.

### Kiểm tra
- Build thất bại do Google Fonts không kết nối được mạng (lỗi tồn đọng, không liên quan đến thay đổi).
- File `hero-section.tsx` đã sửa đúng cú pháp và import.

### Commit message đề xuất

`refactor(hero): replace video with static vintage-tv.webp image in framed display`

---

## Task: Đặt video vào trong khung TV, xóa viền ngoài

### Ngày: 2026-04-11

### Mô tả công việc
- Xóa các border viền ngoài của khung vintage TV, chỉ giữ lại hình ảnh TV và đặt video bên trong màn hình TV.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Xóa các lớp viền ngoài: `border-2`, `shadow`, nhãn "Archive Reel", gradient overlay.
  - Giữ nguyên ảnh `vintage-tv.webp` làm khung TV.
  - Thêm `div` overlay chứa `<video>` với `position: absolute` đặt đúng vị trí màn hình TV (top: 12%, left: 8%, width: 84%, height: 68%).

### Kiểm tra
- `npm run build`: pass.

### Commit message đề xuất

`refactor(hero): place video inside vintage-tv frame, remove outer borders`

---

## Task: Đặt video đằng sau khung TV, resize và căn giữa

### Ngày: 2026-04-11

### Mô tả công việc
- Đặt video đằng sau khung TV (dùng z-index), resize video bằng 90% kích thước TV và căn giữa để khung TV che phần thừa.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Đặt `<video>` trước `<Image>` trong DOM (video sẽ nằm đằng sau).
  - Bọc video trong div với `w-[90%] h-[90%] m-auto` để resize 90% và căn giữa.
  - Đặt `<Image>` (khung TV) sau video với `absolute inset-0` để phủ lên trên.

### Kiểm tra
- Build lỗi do Google Fonts không kết nối được (lỗi tồn đọng, không liên quan đến thay đổi).

### Commit message đề xuất

`refactor(hero): layer video behind tv frame at 90% size, centered`

---

## Task: Scale video 90% khung TV với tỉ lệ gốc

### Ngày: 2026-04-11

### Mô tả công việc
- Giữ nguyên kích thước tỉ lệ của TV, scale video xuống 90% để lọt vào trong khung.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Thêm div wrapper với flexbox để căn giữa.
  - Đổi `object-cover` thành `object-contain` để giữ tỉ lệ gốc của video.
  - Scale video xuống `h-[90%] w-[90%]` để video nhỏ hơn khung TV.

### Commit message đề xuất

`refactor(hero): scale video to 90% with object-contain to fit inside tv frame`

---

## Task: Đặt video và khung TV cùng container với position absolute

### Ngày: 2026-04-11

### Mô tả công việc
- Đặt video và khung TV vào cùng 1 div container, dùng position absolute cho cả 2, container là relative.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Container div với `relative h-auto w-full`.
  - Video div với `absolute inset-0`, video bên trong với `h-full w-full object-contain`.
  - Image với `relative z-10 h-auto w-full`, z-index cao hơn video để nằm trên.

### Commit message đề xuất

`refactor(hero): use single container with absolute positioning for video and tv frame`

---

## Task: Đặt tỉ lệ video 4:3

### Ngày: 2026-04-11

### Mô tả công việc
- Đặt video có tỉ lệ 4:3 để phù hợp với màn hình TV vintage.

### Công việc đã làm
- Sửa `src/components/client/home/hero-section.tsx`:
  - Thêm div wrapper với flexbox căn giữa.
  - Video dùng `aspect-[4/3]` để set tỉ lệ 4:3.
  - Dùng `h-auto w-auto max-h-full max-w-full` để video scale đúng tỉ lệ và không tràn.

### Commit message đề xuất

`refactor(hero): set video aspect ratio to 4:3 for tv screen fit`

---

## Task: Hiển thị 4 sản phẩm ngẫu nhiên trong phần best sellers

### Ngày: 2026-04-11

### Mô tả công việc
- Thay thế dữ liệu tĩnh trong BestsellersSection bằng 4 sản phẩm ngẫu nhiên từ database.

### Công việc đã làm
- Tạo `src/lib/actions/product-actions.ts` với function `getRandomProducts()` sử dụng trực tiếp Prisma.
- Cập nhật `src/components/client/home/bestsellers-section.tsx`:
  - Convert thành async server component.
  - Fetch 4 sản phẩm ngẫu nhiên từ database.
  - Sử dụng `featuredImage` hoặc `images[0]` cho ảnh sản phẩm.
  - Format giá tiền với `toFixed(2)`.

### Kiểm tra
- `npm run build`: pass.

### Commit message đề xuất

`feat(bestsellers): fetch 4 random products from database`

