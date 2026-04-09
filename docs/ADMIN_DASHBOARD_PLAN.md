# Kế Hoạch Thiết Kế Admin Dashboard — NeoBóc Ecommerce

## 1. Tổng Quan Hệ Thống

### 1.1. Giới thiệu dự án

- **Tên website:** NeoBóc
- **Mục đích:** Giới thiệu và bán các sản phẩm nailbox thiết kế riêng và những bộ nailbox có sẵn
- **Đối tượng sử dụng:** Khách hàng mua nailbox (user và guest user), quản trị viên hệ thống (admin)

### 1.2. Công nghệ sử dụng

| Layer | Công nghệ |
|---|---|
| Frontend (Admin) | NextJS 16 (App Router) + TailwindCSS v4 + Lucide Icon |
| Frontend (Customer) | NextJS 16 (App Router) + TailwindCSS v4 + Lucide Icon |
| Backend / API | NextJS 16 — Route Handlers (API Routes) |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | NextAuth.js (hỗ trợ Credentials + OAuth) |
| State Management | Zustand (client) / TanStack Query (server state) |
| Form Handling | React Hook Form + Zod |
| Charts | Recharts / Tremor |
| UI Components | Shadcn/ui (dựa trên Radix UI) |

### 1.3. Ràng buộc hệ thống

- Cả user đã đăng ký và guest user đều có thể sử dụng giỏ hàng, mua hàng, gửi yêu cầu thiết kế.
- Guest user được nhận diện qua session/cookie không cần đăng nhập.
- Chỉ có admin (flag `isAdmin = true`) mới được truy cập dashboard.

---

## 2. Thiết Kế Database (PostgreSQL + Prisma)

### 2.1. Tổng quan Entity-Relationship

```
User (1) ──── (N) Order
User (1) ──── (N) DesignRequest
User (1) ──── (N) Refund

Product (N) ── (M) Collection
Product (N) ── (M) Category
Product (1) ── (N) ProductVariant
Product (N) ── (N) OrderItem
Product (N) ── (N) CartItem

Order (1) ──── (N) OrderItem
Order (1) ──── (N) OrderStatusHistory
Order (1) ──── (1) ShippingCarrier
Order (1) ──── (N) Refund

DesignRequest (1) ──── (N) DesignRequestImage
```

### 2.2. Danh sách bảng chi tiết

#### 2.2.1. Bảng `users`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK, default: uuid_generate_v4() |
| email | `varchar(255)` | UNIQUE, NOT NULL |
| password_hash | `varchar(255)` | NULL (guest user không có) |
| phone | `varchar(20)` | NULL |
| name | `varchar(255)` | NULL |
| is_admin | `boolean` | DEFAULT false |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.2. Bảng `products`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| name | `varchar(255)` | NOT NULL |
| slug | `varchar(255)` | UNIQUE, NOT NULL |
| description | `text` | NULL |
| price | `decimal(12,2)` | NOT NULL |
| original_price | `decimal(12,2)` | NULL |
| sale_price | `decimal(12,2)` | NULL |
| stock | `integer` | DEFAULT 0 |
| images | `jsonb` | Mảng URL ảnh |
| seo_title | `varchar(255)` | NULL |
| seo_description | `text` | NULL |
| is_active | `boolean` | DEFAULT true |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.3. Bảng `product_variants`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| product_id | `uuid` | FK → products(id), NOT NULL |
| variant_name | `varchar(255)` | NOT NULL (tên phân loại, vd: "Màu sắc") |
| option_value | `varchar(255)` | NOT NULL (vd: "Đỏ") |
| sku | `varchar(100)` | UNIQUE, NULL |
| stock | `integer` | DEFAULT 0 |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.4. Bảng `collections`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| name | `varchar(255)` | NOT NULL |
| slug | `varchar(255)` | UNIQUE, NOT NULL |
| description | `text` | NULL |
| seo_title | `varchar(255)` | NULL |
| seo_description | `text` | NULL |
| is_active | `boolean` | DEFAULT true |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.5. Bảng `categories`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| name | `varchar(255)` | NOT NULL |
| slug | `varchar(255)` | UNIQUE, NOT NULL |
| description | `text` | NULL |
| seo_title | `varchar(255)` | NULL |
| seo_description | `text` | NULL |
| is_active | `boolean` | DEFAULT true |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.6. Bảng `collection_products` (junction table)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| collection_id | `uuid` | FK → collections(id) |
| product_id | `uuid` | FK → products(id) |
| **PK** | | (collection_id, product_id) |

#### 2.2.7. Bảng `category_products` (junction table)

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| category_id | `uuid` | FK → categories(id) |
| product_id | `uuid` | FK → products(id) |
| **PK** | | (category_id, product_id) |

#### 2.2.8. Bảng `shipping_carriers`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| name | `varchar(255)` | NOT NULL |
| code | `varchar(50)` | UNIQUE, NOT NULL |
| tracking_url_pattern | `varchar(500)` | NOT NULL (vd: `https://example.com/track/{tracking_code}`) |
| is_active | `boolean` | DEFAULT true |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.9. Bảng `orders`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| order_code | `varchar(50)` | UNIQUE, NOT NULL, auto-gen (vd: `NB-YYYYMMDD-XXXX`) |
| user_id | `uuid` | FK → users(id), NULL (guest) |
| customer_name | `varchar(255)` | NOT NULL |
| contact_info | `jsonb` | Mảng object `{ platform, value }` |
| shipping_address | `text` | NOT NULL |
| subtotal | `decimal(12,2)` | NOT NULL |
| discount_amount | `decimal(12,2)` | DEFAULT 0 |
| total_amount | `decimal(12,2)` | NOT NULL |
| status | `enum` | Xem 2.3 |
| shipping_carrier_id | `uuid` | FK → shipping_carriers(id), NULL |
| tracking_code | `varchar(100)` | NULL |
| notes | `text` | NULL |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.10. Bảng `order_items`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| order_id | `uuid` | FK → orders(id), NOT NULL |
| product_id | `uuid` | FK → products(id), NOT NULL |
| product_variant_id | `uuid` | FK → product_variants(id), NULL |
| product_name | `varchar(255)` | NOT NULL (snapshot) |
| variant_name | `varchar(255)` | NULL (snapshot) |
| quantity | `integer` | NOT NULL |
| unit_price | `decimal(12,2)` | NOT NULL |
| created_at | `timestamp` | DEFAULT now() |

#### 2.2.11. Bảng `order_status_history`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| order_id | `uuid` | FK → orders(id), NOT NULL |
| status | `enum` | Xem 2.3 |
| metadata | `jsonb` | NULL (vd: lý do hủy, ghi chú) |
| created_by | `uuid` | FK → users(id), NULL |
| created_at | `timestamp` | DEFAULT now() |

#### 2.2.12. Bảng `refunds`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| order_id | `uuid` | FK → orders(id), NOT NULL |
| refund_code | `varchar(50)` | UNIQUE, NOT NULL |
| amount | `decimal(12,2)` | NOT NULL |
| reason | `text` | NOT NULL |
| bank_name | `varchar(255)` | NULL |
| bank_account_number | `varchar(50)` | NULL |
| bank_account_holder | `varchar(255)` | NULL |
| status | `enum` | `pending`, `approved`, `rejected`, `completed` |
| processed_by | `uuid` | FK → users(id), NULL |
| processed_at | `timestamp` | NULL |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.13. Bảng `design_requests`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| design_code | `varchar(50)` | UNIQUE, NOT NULL |
| user_id | `uuid` | FK → users(id), NULL |
| customer_name | `varchar(255)` | NOT NULL |
| contact_info | `jsonb` | Mảng object `{ platform, value }` |
| nail_shape | `varchar(100)` | NOT NULL (dáng móng) |
| nail_length | `varchar(100)` | NOT NULL (độ dài móng) |
| nail_size | `varchar(100)` | NOT NULL (size móng) |
| custom_options | `jsonb` | Các tùy chọn custom |
| has_template | `boolean` | DEFAULT false |
| is_confirmed | `boolean` | DEFAULT false |
| notes | `text` | NULL |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.14. Bảng `design_request_images`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| design_request_id | `uuid` | FK → design_requests(id), NOT NULL |
| image_url | `varchar(500)` | NOT NULL |
| is_template | `boolean` | DEFAULT false |
| created_at | `timestamp` | DEFAULT now() |

#### 2.2.15. Bảng `settings`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| key | `varchar(255)` | UNIQUE, NOT NULL |
| type | `enum` | `string`, `number`, `boolean`, `json` |
| value | `text` | NOT NULL |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

**Các key cài đặt mặc định:**

| Key | Type | Mô tả |
|---|---|---|
| `site_logo` | `string` | URL logo website |
| `site_name` | `string` | Tên website |
| `seo_default_title` | `string` | SEO title mặc định |
| `seo_default_description` | `string` | SEO description mặc định |
| `payment_vnpt_account` | `string` | Thông tin tài khoản VNPT |
| `payment_bank_info` | `json` | Thông tin ngân hàng thanh toán |
| `social_links` | `json` | Mảng `{ platform, url }` |
| `contact_info` | `json` | Thông tin liên hệ |
| `footer_content` | `string` | Nội dung footer (HTML) |

#### 2.2.16. Bảng `hero_sections`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| title | `varchar(255)` | NULL |
| subtitle | `text` | NULL |
| image_url | `varchar(500)` | NOT NULL |
| link | `varchar(500)` | NULL |
| is_active | `boolean` | DEFAULT true |
| display_order | `integer` | DEFAULT 0 |
| start_time | `timestamp` | NULL |
| end_time | `timestamp` | NULL |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.17. Bảng `pages`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| name | `varchar(255)` | NOT NULL |
| slug | `varchar(255)` | UNIQUE, NOT NULL |
| html_content | `text` | NULL |
| seo_title | `varchar(255)` | NULL |
| seo_description | `text` | NULL |
| is_active | `boolean` | DEFAULT true |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.18. Bảng `menus`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| name | `varchar(255)` | NOT NULL |
| url | `varchar(500)` | NOT NULL |
| open_in_new_tab | `boolean` | DEFAULT false |
| display_order | `integer` | DEFAULT 0 |
| location | `enum` | `header`, `footer` |
| is_active | `boolean` | DEFAULT true |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.19. Bảng `carts`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| session_id | `varchar(255)` | NOT NULL (guest) |
| user_id | `uuid` | FK → users(id), NULL |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

#### 2.2.20. Bảng `cart_items`

| Trường | Kiểu | Ràng buộc |
|---|---|---|
| id | `uuid` | PK |
| cart_id | `uuid` | FK → carts(id), NOT NULL |
| product_id | `uuid` | FK → products(id), NOT NULL |
| product_variant_id | `uuid` | FK → product_variants(id), NULL |
| quantity | `integer` | NOT NULL, DEFAULT 1 |
| created_at | `timestamp` | DEFAULT now() |
| updated_at | `timestamp` | DEFAULT now() |

### 2.3. Enum `order_status`

```sql
CREATE TYPE order_status AS ENUM (
  'pending_payment',    -- Đang chờ thanh toán
  'confirmed',          -- Đã xác nhận
  'preparing',           -- Đang chuẩn bị hàng
  'shipping',            -- Đang vận chuyển
  'delivered',           -- Giao hàng thành công
  'cancelled'            -- Đơn hàng bị hủy
);
```

### 2.4. Database Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_design_requests_user_id ON design_requests(user_id);
CREATE INDEX idx_settings_key ON settings(key);
```

---

## 3. Kiến Trúc Ứng Dụng

### 3.1. Thư mục dự án

```
neoboc-ecommerce/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (admin)/                  # Admin layout group
│   │   │   ├── layout.tsx            # Admin shell (sidebar + header)
│   │   │   ├── page.tsx              # Dashboard tổng quan
│   │   │   ├── (dashboard)/
│   │   │   │   ├── analytics/
│   │   │   │   ├── orders/
│   │   │   │   │   ├── page.tsx      # Danh sách đơn hàng
│   │   │   │   │   └── [id]/page.tsx # Chi tiết đơn hàng
│   │   │   │   ├── refunds/
│   │   │   │   ├── design-requests/
│   │   │   │   ├── products/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── edit/page.tsx
│   │   │   │   │       └── variants/page.tsx
│   │   │   │   ├── collections/
│   │   │   │   ├── categories/
│   │   │   │   ├── shipping-carriers/
│   │   │   │   ├── users/
│   │   │   │   ├── hero-sections/
│   │   │   │   ├── pages/
│   │   │   │   ├── menus/
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx      # Cài đặt chung
│   │   │   │       ├── seo/page.tsx   # SEO pattern
│   │   │   │       ├── payment/page.tsx
│   │   │   │       └── social/page.tsx
│   │   ├── (shop)/                   # Customer layout group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Trang chủ
│   │   │   ├── products/
│   │   │   ├── collections/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── orders/
│   │   │   ├── design-request/
│   │   │   └── [...slug]/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── products/
│   │   │   ├── collections/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── carts/
│   │   │   ├── refunds/
│   │   │   ├── design-requests/
│   │   │   ├── settings/
│   │   │   ├── hero-sections/
│   │   │   ├── pages/
│   │   │   ├── menus/
│   │   │   ├── upload/
│   │   │   └── analytics/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                       # Shadcn/ui components
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── data-table.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── stat-card.tsx
│   │   │   └── ...
│   │   ├── shop/                     # Customer-specific components
│   │   └── shared/                   # Dùng chung
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── validators/               # Zod schemas
│   │   │   ├── product.ts
│   │   │   ├── order.ts
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── format.ts             # Format currency, date
│   │   │   │   └── ...
│   │   ├── constants.ts
│   │   └── helpers/
│   ├── types/
│   │   └── index.ts
│   └── hooks/
│       ├── use-cart.ts
│       └── ...
├── public/
│   └── uploads/
├── .env
├── prisma/schema.prisma
└── package.json
```

### 3.2. Admin Layout Shell

```
┌─────────────────────────────────────────────────────┐
│ Header: Logo + Search + User Menu                   │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │  Main Content Area                       │
│ (fixed)  │  - Breadcrumb                           │
│          │  - Page Title + Actions                 │
│          │  - Content                               │
│          │                                          │
└──────────┴──────────────────────────────────────────┘
```

**Sidebar Navigation Structure:**

```
📊 Tổng quan
📦 Sản phẩm
   ├─ Danh sách sản phẩm
   ├─ Thêm sản phẩm mới
   └─ Quản lý biến thể
🗂️ Bộ sưu tập
🗂️ Phân loại
📋 Đơn hàng
   ├─ Tất cả đơn hàng
   ├─ Chờ thanh toán
   ├─ Đang xử lý
   └─ Đã hoàn thành
💰 Hoàn tiền
✏️ Yêu cầu thiết kế
🚚 Đơn vị vận chuyển
👥 Người dùng
🎨 Hero Section
📄 Trang nội dung
🔗 Menu & Footer
⚙️ Cài đặt
   ├─ Cài đặt chung
   ├─ SEO
   ├─ Thanh toán
   └─ Social Links
```

---

## 4. Chi Tiết Từng Trang Admin

### 4.1. Trang Tổng Quan (Dashboard Analytics)

**Mục đích:** Hiển thị tổng quan KPIs và biểu đồ kinh doanh.

**KPI Cards (tổng cộng 6 thẻ):**

| Thẻ | Chỉ số | Màu |
|---|---|---|
| Tổng đơn hàng | Số đơn hàng trong khoảng thời gian | Xanh dương |
| Doanh thu | Tổng total_amount | Xanh lá |
| Lợi nhuận | Doanh thu - Giá gốc | Tím |
| Đơn thành công | Đếm status = delivered | Xanh dương |
| Đơn hoàn tiền | Số refund đã approved/completed | Đỏ |
| Tỉ lệ lợi nhuận | Lợi nhuận / Doanh thu × 100% | Tím |

**Biểu đồ:**

- **Doanh thu theo ngày/tuần/tháng** (Line Chart — Recharts)
- **Đơn hàng theo trạng thái** (Donut Chart)
- **Top 10 sản phẩm bán chạy** (Bar Chart)
- **So sánh doanh thu các tháng** (Bar Chart)

**Filter:** Khoảng thời gian (7 ngày, 30 ngày, 90 ngày, Tùy chọn)

**Recent Activity:** Danh sách 10 đơn hàng mới nhất + 5 yêu cầu thiết kế gần đây.

### 4.2. Quản Lý Sản Phẩm

#### 4.2.1. Danh sách sản phẩm (`/admin/products`)

- **Bảng Data Table với các cột:** Hình ảnh, Tên, SKU, Giá, Tồn kho, Bộ sưu tập, Trạng thái, Ngày tạo, Hành động.
- **Tính năng:** Tìm kiếm theo tên/SKU, lọc theo bộ sưu tập/phân loại/trạng thái, phân trang.
- **Hành động:** Sửa, Xóa (soft delete), Quản lý biến thể.

#### 4.2.2. Thêm / Sửa sản phẩm (`/admin/products/new`, `/admin/products/[id]/edit`)

**Form gồm các phần:**

1. **Thông tin cơ bản:**
   - Tên sản phẩm (required)
   - Slug (auto-generate từ tên, cho sửa)
   - Mô tả (rich text editor)

2. **Giá cả:**
   - Giá bán (required)
   - Giá gốc (nullable)
   - Giá khuyến mãi (nullable, có date range)

3. **Hình ảnh:**
   - Multi-image upload (drag & drop)
   - Preview ảnh, sắp xếp thứ tự, đánh dấu ảnh chính

4. **Kho:**
   - Tồn kho tổng

5. **Phân loại & Bộ sưu tập:**
   - Multi-select danh mục
   - Multi-select bộ sưu tập

6. **Biến thể:**
   - Dynamic form: Thêm phân loại (vd: "Màu sắc"), thêm option (vd: "Đỏ", "Xanh")
   - Auto-generate variants với SKU + stock riêng

7. **SEO:**
   - Meta title
   - Meta description
   - Preview Google snippet

#### 4.2.3. Quản lý biến thể (`/admin/products/[id]/variants`)

- Bảng: Tên biến thể, SKU, Tồn kho, Giá (override), Hành động.
- Thêm / Sửa / Xóa biến thể inline.

### 4.3. Quản Lý Bộ Sưu Tập (`/admin/collections`)

- Bảng: Tên, Slug, Số sản phẩm, Trạng thái, Ngày tạo, Hành động.
- Modal/Trang thêm-sửa: Tên, Slug, Mô tả, SEO, Trạng thái.
- Gán/bỏ sản phẩm vào bộ sưu tập (multi-select products).

### 4.4. Quản Lý Phân Loại (`/admin/categories`)

- Bảng: Tên, Slug, Số sản phẩm, Trạng thái, Ngày tạo, Hành động.
- CRUD tương tự Bộ sưu tập.

### 4.5. Quản Lý Đơn Hàng

#### 4.5.1. Danh sách đơn hàng (`/admin/orders`)

- **Bảng:** Mã đơn, Khách hàng, Tổng tiền, Trạng thái, Ngày đặt, Hành động.
- **Filter:** Trạng thái, khoảng ngày, tìm kiếm mã đơn.
- **Bulk actions:** Cập nhật trạng thái nhiều đơn.

#### 4.5.2. Chi tiết đơn hàng (`/admin/orders/[id]`)

**Tabs:**

1. **Thông tin đơn hàng:**
   - Mã đơn, trạng thái (dropdown cập nhật), ngày tạo
   - Thông tin khách hàng (tên, contact_info)
   - Địa chỉ giao hàng

2. **Sản phẩm:**
   - Bảng: Sản phẩm, Biến thể, Số lượng, Đơn giá, Thành tiền

3. **Chi tiết giá:**
   - Tổng phụ, Giảm giá, Phí ship, Thành tiền

4. **Vận chuyển:**
   - Chọn đơn vị vận chuyển
   - Nhập mã vận đơn
   - Link tracking (auto-generate từ pattern)

5. **Lịch sử trạng thái:**
   - Timeline: trạng thái → thời gian → người cập nhật

### 4.6. Quản Lý Hoàn Tiền (`/admin/refunds`)

- Bảng: Mã hoàn, Mã đơn, Số tiền, Lý do, Trạng thái, Ngày tạo.
- **Tạo refund:** Chọn đơn hàng → Nhập số tiền → Nhập thông tin ngân hàng → Lý do.
- **Chi tiết refund:** Xem đầy đủ thông tin, duyệt/từ chối (approve/reject).

### 4.7. Yêu Cầu Thiết Kế (`/admin/design-requests`)

- Bảng: Mã yêu cầu, Khách hàng, Dáng móng, Độ dài, Size, Mẫu có sẵn, Xác nhận, Ngày.
- **Chi tiết:** Xem đầy đủ thông tin + hình ảnh mẫu.
- **Hành động:** Xác nhận / Từ chối (is_confirmed flag).

### 4.8. Quản Lý Đơn Vị Vận Chuyển (`/admin/shipping-carriers`)

- Bảng: Tên, Mã code, URL tracking pattern, Trạng thái, Hành động.
- CRUD đơn vị vận chuyển.

### 4.9. Quản Lý Người Dùng (`/admin/users`)

- Bảng: Tên, Email, SĐT, Admin flag, Ngày đăng ký, Hành động.
- Toggle admin flag, xem lịch sử đơn hàng của user.

### 4.10. Quản Lý Hero Section (`/admin/hero-sections`)

- Bảng: Tiêu đề, Hình ảnh, Trạng thái, Thứ tự, Thời gian hiển thị.
- **Form:** Upload ảnh, tiêu đề, phụ đề, link, flag ẩn/hiện, thời gian bắt đầu/kết thúc, thứ tự.

### 4.11. Quản Lý Trang Nội Dung (`/admin/pages`)

- Bảng: Tên trang, URL slug, Trạng thái.
- **Form:** Tên, Slang, HTML content (rich text), SEO.

### 4.12. Quản Lý Menu & Footer (`/admin/menus`)

- Kéo thả sắp xếp thứ tự (dnd).
- CRUD: Tên link, URL, mở tab mới, vị trí (header/footer).

### 4.13. Cài Đặt (`/admin/settings`)

| Tab | Nội dung |
|---|---|
| **Chung** | Logo, tên website, footer content |
| **SEO** | SEO pattern mặc định (title, description) |
| **Thanh toán** | Thông tin ngân hàng, tài khoản VNPT |
| **Social** | Danh sách link social media |
| **Liên hệ** | Email, SĐT, địa chỉ |

---

## 5. API Design

### 5.1. Nguyên tắc thiết kế

- Sử dụng **Route Handlers** của Next.js 16 (`app/api/...`).
- **Method:** GET (lấy danh sách + chi tiết), POST (tạo mới), PUT/PATCH (cập nhật), DELETE (xóa).
- **Response format:** `{ data, meta, error }`.
- **Validation:** Zod schema ở cả client và server.
- **Auth:** Middleware kiểm tra session, chỉ admin được truy cập `/api/admin/*`.

### 5.2. Các API Endpoints chính

```
# Authentication
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/session

# Products
GET    /api/products                    # List (admin: all, public: active only)
POST   /api/products                    # Create
GET    /api/products/[id]               # Detail
PUT    /api/products/[id]               # Update
DELETE /api/products/[id]               # Soft delete

# Product Variants
GET    /api/products/[id]/variants
POST   /api/products/[id]/variants
PUT    /api/products/[id]/variants/[variantId]
DELETE /api/products/[id]/variants/[variantId]

# Collections
GET    /api/collections
POST   /api/collections
GET    /api/collections/[id]
PUT    /api/collections/[id]
DELETE /api/collections/[id]

# Categories
GET    /api/categories
POST   /api/categories
GET    /api/categories/[id]
PUT    /api/categories/[id]
DELETE /api/categories/[id]

# Orders
GET    /api/orders                     # Admin: all, with filters
POST   /api/orders                     # Create (checkout)
GET    /api/orders/[id]
PATCH  /api/orders/[id]/status         # Update status + history
PATCH  /api/orders/[id]/shipping       # Update tracking

# Refunds
GET    /api/refunds
POST   /api/refunds
GET    /api/refunds/[id]
PATCH  /api/refunds/[id]/status        # Approve / Reject

# Design Requests
GET    /api/design-requests
POST   /api/design-requests
GET    /api/design-requests/[id]
PATCH  /api/design-requests/[id]/confirm

# Shipping Carriers
GET    /api/shipping-carriers
POST   /api/shipping-carriers
PUT    /api/shipping-carriers/[id]
DELETE /api/shipping-carriers/[id]

# Users
GET    /api/users
GET    /api/users/[id]
PATCH  /api/users/[id]/admin-flag

# Settings
GET    /api/settings
PUT    /api/settings/[key]

# Hero Sections
GET    /api/hero-sections
POST   /api/hero-sections
PUT    /api/hero-sections/[id]
DELETE /api/hero-sections/[id]

# Pages
GET    /api/pages
POST   /api/pages
PUT    /api/pages/[id]
DELETE /api/pages/[id]

# Menus
GET    /api/menus?location=header|footer
POST   /api/menus
PUT    /api/menus/[id]
DELETE /api/menus/[id]
PATCH  /api/menus/reorder               # Bulk reorder

# Carts (customer)
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/[id]
DELETE /api/cart/items/[id]

# Upload
POST   /api/upload                      # Image upload (multipart)

# Analytics
GET    /api/analytics/dashboard         # KPIs + charts data
GET    /api/analytics/revenue           # Revenue time series
```

---

## 6. Authentication & Authorization

### 6.1. Chiến lược Auth

| Phương thức | Dùng cho |
|---|---|
| NextAuth.js Credentials | Admin đăng nhập (email + password) |
| NextAuth.js Session (JWT) | Bảo vệ route admin |
| Session Cookie | Guest cart identification |

### 6.2. Middleware bảo vệ

```typescript
// middleware.ts
// Redirect non-admin users from /admin/* to /login
// Redirect authenticated users from /login to /admin
```

### 6.3. Phân quyền

| Role | Truy cập |
|---|---|
| Guest | Shop, Cart, Checkout, Design Request |
| User (registered) | Shop, Cart, Checkout, Design Request, Order History |
| Admin | Full access (shop + all admin routes) |

---

## 7. UI/UX Design System

### 7.1. Màu sắc

| Role | Màu | Tailwind class |
|---|---|---|
| Primary (NeoBóc brand) | Hồng nhạt / đậm | `pink-500`, `pink-600` |
| Sidebar Background | Xám tối | `slate-900` |
| Sidebar Text | Trắng nhạt | `slate-200` |
| Content Background | Trắng / Xám nhạt | `white`, `slate-50` |
| Success | Xanh lá | `green-500` |
| Warning | Cam | `amber-500` |
| Danger/Error | Đỏ | `red-500` |
| Info | Xanh dương | `blue-500` |

### 7.2. Typography

| Element | Font | Size |
|---|---|---|
| Sidebar title | Inter / Be Vietnam Pro | 18px, semibold |
| Page heading | Inter / Be Vietnam Pro | 24px, semibold |
| Section heading | Inter / Be Vietnam Pro | 16px, semibold |
| Body text | Inter / Be Vietnam Pro | 14px, regular |
| Small / caption | Inter / Be Vietnam Pro | 12px, regular |

### 7.3. Layout Specifications

| Element | Spec |
|---|---|
| Sidebar width | 260px (collapsible to 72px icon-only) |
| Header height | 64px |
| Content max-width | 1400px |
| Card padding | 24px |
| Table row height | 52px |
| Form gap | 16px |
| Page padding | 24px |

### 7.4. Component Library (Shadcn/ui)

Sử dụng các components từ Shadcn/ui:

```
Button, Badge, Card, Input, Textarea, Select,
Checkbox, RadioGroup, Dialog, Sheet (sidebar mobile),
Table, Tabs, Tab, Avatar, DropdownMenu,
Toast, Form, Label, Switch, Command, Calendar,
Popover, Tooltip, Separator, Breadcrumb, Skeleton,
DataTable (custom), StatCard (custom), StatusBadge (custom)
```

---

## 8. Quy Trình Triển Khai (3 Giai Đoạn)

### Giai đoạn 1: Nền tảng & Auth (Tuần 1–2)

1. Cài đặt project: Prisma + PostgreSQL, NextAuth.js, Shadcn/ui
2. Thiết kế & migrate database schema
3. Xây dựng Admin Shell (sidebar, header, layout)
4. Xây dựng trang Login + Middleware bảo vệ
5. Seed data mẫu (categories, collections, shipping carriers)

### Giai đoạn 2: CRUD Module (Tuần 3–5)

1. CRUD Sản phẩm + Biến thể
2. CRUD Bộ sưu tập + Phân loại
3. CRUD Đơn vị vận chuyển
4. CRUD Người dùng
5. CRUD Hero Section + Trang nội dung + Menu
6. CRUD Cài đặt

### Giai đoạn 3: Orders & Analytics (Tuần 6–8)

1. Dashboard Analytics (KPIs + Charts)
2. Quản lý Đơn hàng (list + detail + cập nhật trạng thái)
3. Quản lý Hoàn tiền
4. Yêu cầu thiết kế
5. Upload ảnh (Cloudinary / local storage)
6. Responsive + Polish UI
7. Testing & Bug fixes

---

## 9. Các Package Cần Cài Đặt

```bash
# Core
npm install next@latest react@latest react-dom@latest

# Database & ORM
npm install prisma @prisma/client
npm install @types/node

# Auth
npm install next-auth

# UI & Icons
npm install lucide-react
npx shadcn@latest init

# Form & Validation
npm install react-hook-form zod @hookform/resolvers

# State & Data Fetching
npm install @tanstack/react-query zustand

# Charts
npm install recharts

# Utilities
npm install clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select ...
npm install date-fns

# Rich Text Editor (cho page content)
npm install @tiptap/react @tiptap/starter-kit

# Drag & Drop (cho menu ordering)
npm install @dnd-kit/core @dnd-kit/sortable

# File Upload
npm install react-dropzone
```

---

## 10. Môi Trường Development

### `.env` mẫu

```env
DATABASE_URL="postgresql://user:password@localhost:5432/neoboc_ecommerce"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloud storage (tùy chọn)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Database Connection (Prisma)

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 11. Checklist Triển Khai

- [ ] Cài đặt PostgreSQL + tạo database `neoboc_ecommerce`
- [ ] Khởi tạo Prisma schema và migrate
- [ ] Cài đặt NextAuth.js với Credentials provider
- [ ] Xây dựng Admin Shell (sidebar + header)
- [ ] Bảo vệ route `/admin/*` bằng middleware
- [ ] CRUD Products + Variants
- [ ] CRUD Collections + Categories
- [ ] CRUD Shipping Carriers
- [ ] CRUD Users (admin flag)
- [ ] CRUD Hero Sections
- [ ] CRUD Pages
- [ ] CRUD Menus (với drag-drop)
- [ ] CRUD Settings (logo, SEO, payment, social)
- [ ] Dashboard Analytics (KPIs + Charts)
- [ ] Order Management (list, detail, status update, tracking)
- [ ] Refund Management
- [ ] Design Request Management
- [ ] Cart & Checkout API (guest + user)
- [ ] Image Upload
- [ ] Seed data
- [ ] Testing toàn bộ chức năng
- [ ] Responsive admin layout

---

*Kế hoạch này là bản thiết kế chi tiết cho hệ thống Admin Dashboard của NeoBóc Ecommerce. Mọi thay đổi về thiết kế, kiến trúc hoặc phạm vi tính năng sẽ được cập nhật trong tài liệu này.*
