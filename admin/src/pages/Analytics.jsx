import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  DollarSign,
  Download,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

const monthlySales = [
  { month: "Jan", revenue: 4200, orders: 38 },
  { month: "Feb", revenue: 5100, orders: 45 },
  { month: "Mar", revenue: 4800, orders: 42 },
  { month: "Apr", revenue: 6200, orders: 54 },
  { month: "May", revenue: 7100, orders: 61 },
  { month: "Jun", revenue: 6800, orders: 58 },
  { month: "Jul", revenue: 8200, orders: 72 },
  { month: "Aug", revenue: 9400, orders: 84 },
];

const topProducts = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    sales: 124,
    revenue: 4960,
  },
  {
    name: "Smart Watch Pro",
    category: "Electronics",
    sales: 98,
    revenue: 8820,
  },
  {
    name: "Running Shoes",
    category: "Sports",
    sales: 86,
    revenue: 6020,
  },
  {
    name: "Leather Backpack",
    category: "Fashion",
    sales: 71,
    revenue: 3550,
  },
  {
    name: "Modern Desk Lamp",
    category: "Home & Living",
    sales: 64,
    revenue: 1920,
  },
];

const categoryData = [
  {
    name: "Electronics",
    value: 42,
    revenue: "$18,420",
  },
  {
    name: "Fashion",
    value: 24,
    revenue: "$10,540",
  },
  {
    name: "Home & Living",
    value: 17,
    revenue: "$7,420",
  },
  {
    name: "Sports",
    value: 11,
    revenue: "$4,810",
  },
  {
    name: "Beauty",
    value: 6,
    revenue: "$2,630",
  },
];

const recentActivity = [
  {
    title: "New order received",
    description: "Order #1005 was placed by Ahmed Ali.",
    time: "12 minutes ago",
    type: "order",
  },
  {
    title: "New customer registered",
    description: "Maryan Ahmed created an account.",
    time: "34 minutes ago",
    type: "customer",
  },
  {
    title: "Product sold",
    description: "Wireless Headphones × 2 were sold.",
    time: "1 hour ago",
    type: "product",
  },
  {
    title: "Order delivered",
    description: "Order #1001 was successfully delivered.",
    time: "2 hours ago",
    type: "delivery",
  },
];

const Analytics = () => {
  const maxRevenue = Math.max(
    ...monthlySales.map((item) => item.revenue)
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your store performance and business growth.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              defaultValue="30"
              className="h-10 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">This year</option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard
          title="Total Revenue"
          value="$42,820"
          change="+18.4%"
          description="vs previous period"
          positive
          icon={<DollarSign size={19} />}
        />

        <AnalyticsCard
          title="Total Orders"
          value="384"
          change="+12.8%"
          description="vs previous period"
          positive
          icon={<ShoppingCart size={19} />}
        />

        <AnalyticsCard
          title="Customers"
          value="1,248"
          change="+9.6%"
          description="vs previous period"
          positive
          icon={<Users size={19} />}
        />

        <AnalyticsCard
          title="Avg. Order Value"
          value="$111.51"
          change="-2.4%"
          description="vs previous period"
          positive={false}
          icon={<TrendingUp size={19} />}
        />
      </div>

      {/* Revenue Chart */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Monthly revenue performance
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              Revenue
            </div>
          </div>

          {/* Chart */}
          <div className="mt-8">
            <div className="flex h-64 items-end gap-2 sm:gap-4">
              {monthlySales.map((item) => {
                const height =
                  (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.month}
                    className="group flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="relative flex h-full items-end justify-center">
                      <div
                        className="w-full max-w-10 rounded-t-md bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-600"
                        style={{
                          height: `${height}%`,
                        }}
                      >
                        <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white group-hover:block">
                          ${(item.revenue / 1000).toFixed(1)}k
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-center text-[10px] font-medium text-slate-400 sm:text-xs">
                      {item.month}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Footer */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div>
              <p className="text-xs text-slate-400">
                Total revenue
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                $51,800
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Average monthly
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                $6,475
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Growth
              </p>

              <p className="mt-1 flex items-center gap-1 text-lg font-bold text-green-600">
                <ArrowUpRight size={17} />
                18.4%
              </p>
            </div>
          </div>
        </section>

        {/* Order Performance */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Order Performance
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current order breakdown
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <ProgressRow
              label="Delivered"
              value="62%"
              percentage={62}
            />

            <ProgressRow
              label="Processing"
              value="18%"
              percentage={18}
            />

            <ProgressRow
              label="Shipped"
              value="12%"
              percentage={12}
            />

            <ProgressRow
              label="Pending"
              value="6%"
              percentage={6}
            />

            <ProgressRow
              label="Cancelled"
              value="2%"
              percentage={2}
            />
          </div>

          <div className="mt-7 rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Total orders
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              384
            </p>

            <p className="mt-1 text-xs text-green-600">
              12.8% increase from last period
            </p>
          </div>
        </section>
      </div>

      {/* Top Products + Categories */}
      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Top Products */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Top Products
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Best performing products
              </p>
            </div>

            <BarChart3
              size={19}
              className="text-slate-400"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-3 px-5 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  {index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {product.name}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {product.category} · {product.sales} sales
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  ${product.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Category Performance */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Category Performance
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Revenue by category
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {categoryData.map((category) => (
              <div key={category.name}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {category.name}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {category.revenue}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {category.value}%
                    </p>
                  </div>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{
                      width: `${category.value}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Activity */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Latest store activity
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((activity) => (
            <div
              key={activity.title}
              className="flex gap-3 px-5 py-4"
            >
              <ActivityIcon type={activity.type} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {activity.title}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  {activity.description}
                </p>
              </div>

              <p className="shrink-0 text-[10px] text-slate-400">
                {activity.time}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/* -------------------------------- */
/* Analytics Card                   */
/* -------------------------------- */

const AnalyticsCard = ({
  title,
  value,
  change,
  description,
  positive,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          {icon}
        </div>

        <div
          className={`flex items-center gap-0.5 text-xs font-semibold ${
            positive
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}

          {change}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
};

/* -------------------------------- */
/* Progress Row                     */
/* -------------------------------- */

const ProgressRow = ({
  label,
  value,
  percentage,
}) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">
          {label}
        </span>

        <span className="text-xs font-semibold text-slate-700">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

/* -------------------------------- */
/* Activity Icon                    */
/* -------------------------------- */

const ActivityIcon = ({ type }) => {
  const icons = {
    order: <ShoppingCart size={15} />,
    customer: <Users size={15} />,
    product: <Package size={15} />,
    delivery: <TrendingUp size={15} />,
  };

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
      {icons[type]}
    </div>
  );
};

export default Analytics;