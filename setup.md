# Hướng dẫn cài đặt dự án NeoBóc Ecommerce

## Yêu cầu đã có sẵn

Trước khi bắt đầu, đảm bảo máy tính/VPS đã cài đặt:

- **Node.js** (phiên bản khuyến nghị: 20.x hoặc cao hơn)
- **npm** hoặc **yarn**
- **PostgreSQL** (đã được cài đặt và chạy)
- **Git**

---

## Các bước cài đặt

### 1. Clone dự án

```bash
git clone <repository-url> neoboc-ecommerce
cd neoboc-ecommerce
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Sao chép file mẫu và cấu hình:

```bash
cp .env.example .env
```

Sau đó, mở file `.env` và điền các giá trị cần thiết:

```env
# Database URL - Kết nối PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/neoboc"

# NextAuth Configuration
AUTH_SECRET="<tạo secret key ngẫu nhiên bằng lệnh: openssl rand -base64 32>"
AUTH_URL="http://localhost:3000"
```

#### Tạo AUTH_SECRET

Trên Linux/macOS:

```bash
openssl rand -base64 32
```

Trên Windows (PowerShell):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) )
```

### 4. Cài đặt database (Prisma)

#### Chạy migrations

```bash
npx prisma migrate deploy
```

Lệnh này sẽ áp dụng tất cả migrations đã có vào database.

#### (Tùy chọn) Tạo migrations mới

Nếu có thay đổi trong schema, chạy migration mới:

```bash
npx prisma migrate dev --name <migration-name>
```

#### (Tùy chọn) Seed database

Nếu muốn tạo dữ liệu mẫu ban đầu:

```bash
npx prisma db seed
```

### 5. Build và khởi chạy

#### Chế độ Development

```bash
npm run dev
```

Truy cập: http://localhost:3000/admin/login

#### Chế độ Production

```bash
npm run build
npm start
```

---

## Thông tin đăng nhập mặc định

Sau khi seed database, sử dụng tài khoản sau để đăng nhập:

| Trường | Giá trị |
|--------|---------|
| Email | younista666@gmail.com |
| Password | 123456 |

> **Lưu ý**: Đây là tài khoản admin. Hãy thay đổi password sau khi đăng nhập lần đầu.

---

## Cấu trúc thư mục quan trọng

```
neoboc-ecommerce/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts            # Seed data
├── app/
│   ├── admin/             # Admin dashboard
│   │   ├── (dashboard)/   # Dashboard pages
│   │   └── login/        # Login page
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth API
│   │   ├── products/     # Products CRUD API
│   │   ├── categories/   # Categories API
│   │   └── collections/  # Collections API
│   └── shop/             # Shop frontend
├── src/
│   ├── components/       # React components
│   │   ├── admin/       # Admin components
│   │   ├── ui/          # UI components (Button, Input, etc.)
│   │   └── providers/   # Context providers
│   ├── lib/              # Utilities & configs
│   │   ├── api/         # API client functions
│   │   ├── hooks/       # React hooks
│   │   └── utils/       # Helper functions
│   └── types/            # TypeScript types
└── .env                  # Environment variables (KHÔNG commit)
```

---

## Các lệnh hữu ích

| Lệnh | Mô tả |
|-------|--------|
| `npm run dev` | Khởi chạy development server |
| `npm run build` | Build production |
| `npm start` | Chạy production server |
| `npm run lint` | Kiểm tra lint |
| `npx prisma studio` | Mở Prisma Studio (GUI cho database) |
| `npx prisma migrate dev` | Tạo migration mới |
| `npx prisma migrate deploy` | Áp dụng migrations |
| `npx prisma db seed` | Seed database |

---

## Khắc phục sự cố

### Lỗi kết nối database

Kiểm tra:
1. PostgreSQL đang chạy: `pg_isready` hoặc `systemctl status postgresql`
2. DATABASE_URL đúng định dạng
3. Database `neoboc` đã được tạo

Tạo database nếu chưa có:

```sql
CREATE DATABASE neoboc;
```

### Lỗi Prisma Client

Nếu gặp lỗi liên quan đến Prisma Client:

```bash
npx prisma generate
```

### Xóa và tạo lại database

```bash
# Xóa database cũ
DROP DATABASE neoboc;

# Tạo database mới
CREATE DATABASE neoboc;

# Chạy lại migrations
npx prisma migrate deploy

# Seed dữ liệu
npx prisma db seed
```

---

## Liên hệ hỗ trợ

Nếu gặp vấn đề không có trong hướng dẫn này, vui lòng kiểm tra:

1. File `.env` đã được cấu hình đúng chưa
2. Database đã được tạo và migrations đã chạy thành công
3. Node.js version tương thích (khuyến nghị 20.x+)
