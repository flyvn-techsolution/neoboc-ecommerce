# Agent Log

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
