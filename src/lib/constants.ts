import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  ArrowLeftRight,
  Palette,
  Truck,
  Users,
  Image,
  FileText,
  Menu,
  Settings,
  Banknote,
  Search,
  Globe,
  Shield,
  LayoutGrid,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export type IconComponent = React.ComponentType<{ className?: string }>;

export interface NavItem {
  title: string;
  href?: string;
  icon: IconComponent;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: IconComponent }
> = {
  pending_payment: {
    label: "Chờ thanh toán",
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
  },
  preparing: {
    label: "Đang chuẩn bị",
    color: "bg-purple-100 text-purple-800",
    icon: RefreshCw,
  },
  shipping: {
    label: "Đang vận chuyển",
    color: "bg-indigo-100 text-indigo-800",
    icon: Truck,
  },
  delivered: {
    label: "Giao hàng thành công",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
};

export const REFUND_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  pending: {
    label: "Đang chờ",
    color: "bg-amber-100 text-amber-800",
  },
  approved: {
    label: "Đã duyệt",
    color: "bg-blue-100 text-blue-800",
  },
  rejected: {
    label: "Từ chối",
    color: "bg-red-100 text-red-800",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-800",
  },
};

export const KPI_CARDS_CONFIG = [
  {
    id: "total_orders",
    title: "Tổng đơn hàng",
    icon: ShoppingCart,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "revenue",
    title: "Doanh thu",
    icon: DollarSign,
    color: "text-green-500 bg-green-50",
  },
  {
    id: "profit",
    title: "Lợi nhuận",
    icon: TrendingUp,
    color: "text-purple-500 bg-purple-50",
  },
  {
    id: "successful_orders",
    title: "Đơn thành công",
    icon: CheckCircle,
    color: "text-blue-500 bg-blue-50",
  },
  {
    id: "refund_orders",
    title: "Đơn hoàn tiền",
    icon: ArrowLeftRight,
    color: "text-red-500 bg-red-50",
  },
  {
    id: "profit_margin",
    title: "Tỉ lệ lợi nhuận",
    icon: TrendingUp,
    color: "text-purple-500 bg-purple-50",
  },
];

export const TIME_FILTERS = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
  { value: "custom", label: "Tùy chọn" },
];

export const adminNavSections: NavSection[] = [
  {
    title: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Sản phẩm",
    items: [
      {
        title: "Danh sách sản phẩm",
        href: "/admin/products",
        icon: Package,
      },
      {
        title: "Thêm sản phẩm mới",
        href: "/admin/products/new",
        icon: Package,
      },
    ],
  },
  {
    title: "Danh mục",
    items: [
      {
        title: "Bộ sưu tập",
        href: "/admin/collections",
        icon: FolderTree,
      },
      {
        title: "Phân loại",
        href: "/admin/categories",
        icon: Tag,
      },
    ],
  },
  {
    title: "Đơn hàng",
    items: [
      {
        title: "Tất cả đơn hàng",
        href: "/admin/orders",
        icon: ShoppingCart,
        children: [
          {
            title: "Chờ thanh toán",
            href: "/admin/orders?status=pending_payment",
            icon: Clock,
          },
          {
            title: "Đang xử lý",
            href: "/admin/orders?status=preparing",
            icon: RefreshCw,
          },
          {
            title: "Đã hoàn thành",
            href: "/admin/orders?status=delivered",
            icon: CheckCircle,
          },
        ],
      },
    ],
  },
  {
    title: "Khác",
    items: [
      {
        title: "Hoàn tiền",
        href: "/admin/refunds",
        icon: ArrowLeftRight,
      },
      {
        title: "Yêu cầu thiết kế",
        href: "/admin/design-requests",
        icon: Palette,
      },
      {
        title: "Đơn vị vận chuyển",
        href: "/admin/shipping-carriers",
        icon: Truck,
      },
    ],
  },
  {
    title: "Quản lý nội dung",
    items: [
      {
        title: "Người dùng",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Hero Section",
        href: "/admin/hero-sections",
        icon: Image,
      },
      {
        title: "Trang nội dung",
        href: "/admin/pages",
        icon: FileText,
      },
      {
        title: "Menu & Footer",
        href: "/admin/menus",
        icon: Menu,
      },
    ],
  },
  {
    title: "Cài đặt",
    items: [
      {
        title: "Cài đặt chung",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "SEO",
        href: "/admin/settings/seo",
        icon: Search,
      },
      {
        title: "Thanh toán",
        href: "/admin/settings/payment",
        icon: Banknote,
      },
      {
        title: "Social Links",
        href: "/admin/settings/social",
        icon: Globe,
      },
    ],
  },
];

export const SITE_CONFIG = {
  name: "NeoBóc",
  description: "Hệ thống quản lý bán hàng nailbox",
  logo: "/logo.svg",
};
