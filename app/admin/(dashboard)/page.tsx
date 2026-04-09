"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { KPI_CARDS_CONFIG, TIME_FILTERS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils/format";
import {
  Calendar,
  ShoppingCart,
  RefreshCw,
  Clock,
  CheckCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ORDER_STATUS_COLORS = {
  pending_payment: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  shipping: "#6366f1",
  delivered: "#22c55e",
  cancelled: "#ef4444",
};
const BRAND_COLOR = "var(--color-brand-500)";

const dashboardContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const dashboardSectionVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const kpiGridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const kpiCardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const mockRevenueData = [
  { date: "2024-01", revenue: 12000000, orders: 45 },
  { date: "2024-02", revenue: 15000000, orders: 52 },
  { date: "2024-03", revenue: 18000000, orders: 68 },
  { date: "2024-04", revenue: 22000000, orders: 78 },
  { date: "2024-05", revenue: 28000000, orders: 95 },
  { date: "2024-06", revenue: 32000000, orders: 112 },
];

const mockOrdersByStatus = [
  { status: "pending_payment", count: 12, label: "Chờ thanh toán" },
  { status: "confirmed", count: 25, label: "Đã xác nhận" },
  { status: "preparing", count: 18, label: "Đang chuẩn bị" },
  { status: "shipping", count: 15, label: "Đang vận chuyển" },
  { status: "delivered", count: 156, label: "Đã giao hàng" },
  { status: "cancelled", count: 8, label: "Đã hủy" },
];

const mockTopProducts = [
  { name: "Nailbox Hồng Neo", sales: 120, revenue: 24000000 },
  { name: "Nailbox Xanh Lá", sales: 95, revenue: 19000000 },
  { name: "Nailbox Vàng Cam", sales: 78, revenue: 15600000 },
  { name: "Nailbox Tím", sales: 65, revenue: 13000000 },
  { name: "Nailbox Đỏ", sales: 52, revenue: 10400000 },
];

const mockRecentOrders = [
  {
    id: "1",
    order_code: "NB-20240409-0001",
    customer_name: "Nguyễn Thị Lan",
    total_amount: 1200000,
    status: "confirmed",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    order_code: "NB-20240409-0002",
    customer_name: "Trần Văn Minh",
    total_amount: 2400000,
    status: "preparing",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    order_code: "NB-20240409-0003",
    customer_name: "Lê Thị Hương",
    total_amount: 800000,
    status: "pending_payment",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    order_code: "NB-20240408-0001",
    customer_name: "Phạm Đức Anh",
    total_amount: 3600000,
    status: "shipping",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "5",
    order_code: "NB-20240408-0002",
    customer_name: "Hoàng Thu Minh",
    total_amount: 1600000,
    status: "delivered",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockRecentDesignRequests = [
  {
    id: "1",
    design_code: "DR-20240409-001",
    customer_name: "Võ Thị Mai",
    nail_shape: "Coffin",
    nail_length: "Long",
    nail_size: "M",
    is_confirmed: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    design_code: "DR-20240409-002",
    customer_name: "Đặng Thị Lan",
    nail_shape: "Almond",
    nail_length: "Medium",
    nail_size: "S",
    is_confirmed: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    design_code: "DR-20240408-001",
    customer_name: "Bùi Thị Hà",
    nail_shape: "Stiletto",
    nail_length: "Extra Long",
    nail_size: "L",
    is_confirmed: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("30d");

  const kpiData = [
    { id: "total_orders", title: "Tổng đơn hàng", value: 234, change: 12.5, changeLabel: "so với tháng trước" },
    { id: "revenue", title: "Doanh thu", value: 32000000, change: 18.2, changeLabel: "so với tháng trước", format: "currency" as const },
    { id: "profit", title: "Lợi nhuận", value: 9600000, change: 15.8, changeLabel: "so với tháng trước", format: "currency" as const },
    { id: "successful_orders", title: "Đơn thành công", value: 156, change: 8.3, changeLabel: "so với tháng trước" },
    { id: "refund_orders", title: "Đơn hoàn tiền", value: 8, change: -5.2, changeLabel: "so với tháng trước" },
    { id: "profit_margin", title: "Tỉ lệ lợi nhuận", value: 30, change: 2.1, changeLabel: "so với tháng trước", format: "percentage" as const },
  ];

  return (
    <motion.div
      className="space-y-6"
      variants={dashboardContainerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Page Header */}
      <motion.section
        variants={dashboardSectionVariants}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tổng quan hoạt động kinh doanh
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <div className="flex rounded-lg border border-slate-200 bg-white p-1">
            {TIME_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setTimeFilter(filter.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  timeFilter === filter.value
                    ? "bg-brand-500 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* KPI Cards */}
      <motion.section variants={dashboardSectionVariants}>
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={kpiGridVariants}
        >
          {kpiData.map((kpi, index) => {
            const config = KPI_CARDS_CONFIG[index];
            return (
              <motion.div key={kpi.id} variants={kpiCardVariants}>
                <StatCard
                  title={kpi.title}
                  value={kpi.value}
                  icon={config.icon}
                  color={config.color}
                  format={kpi.format || "number"}
                  change={kpi.change}
                  changeLabel={kpi.changeLabel}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Charts Row 1 */}
      <motion.section
        variants={dashboardSectionVariants}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Revenue Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Doanh thu theo tháng</h3>
          <p className="mt-1 text-sm text-slate-500">Biểu đồ doanh thu 6 tháng gần nhất</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={BRAND_COLOR}
                  strokeWidth={2}
                  dot={{ fill: BRAND_COLOR, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status Pie Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Đơn hàng theo trạng thái</h3>
          <p className="mt-1 text-sm text-slate-500">Phân bố đơn hàng theo từng trạng thái</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockOrdersByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="label"
                >
                  {mockOrdersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={ORDER_STATUS_COLORS[entry.status as keyof typeof ORDER_STATUS_COLORS]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Charts Row 2 */}
      <motion.section
        variants={dashboardSectionVariants}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Top Products Bar Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Top 5 sản phẩm bán chạy</h3>
          <p className="mt-1 text-sm text-slate-500">Sản phẩm có doanh thu cao nhất</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTopProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]}
                />
                <Bar dataKey="revenue" fill={BRAND_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Comparison */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">So sánh doanh thu các tháng</h3>
          <p className="mt-1 text-sm text-slate-500">Doanh thu theo từng tháng</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), "Doanh thu"]}
                />
                <Bar dataKey="revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.section>

      {/* Recent Activity */}
      <motion.section
        variants={dashboardSectionVariants}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Recent Orders */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Đơn hàng gần đây</h3>
              <p className="mt-1 text-sm text-slate-500">5 đơn hàng mới nhất</p>
            </div>
            <a
              href="/admin/orders"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Xem tất cả
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {mockRecentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
                    <ShoppingCart className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{order.order_code}</p>
                    <p className="text-sm text-slate-500">{order.customer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{formatCurrency(order.total_amount)}</p>
                  <StatusBadge status={order.status} type="order" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Design Requests */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Yêu cầu thiết kế gần đây</h3>
              <p className="mt-1 text-sm text-slate-500">5 yêu cầu mới nhất</p>
            </div>
            <a
              href="/admin/design-requests"
              className="text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Xem tất cả
            </a>
          </div>
          <div className="divide-y divide-slate-100">
            {mockRecentDesignRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50">
                    <RefreshCw className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{request.design_code}</p>
                    <p className="text-sm text-slate-500">
                      {request.customer_name} • {request.nail_shape} • {request.nail_length}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      request.is_confirmed
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {request.is_confirmed ? (
                      <>
                        <CheckCircle className="h-3 w-3" /> Đã xác nhận
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" /> Chờ xác nhận
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
