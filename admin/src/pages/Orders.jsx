import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Package,
  Search,
  Truck,
} from "lucide-react";
import { useMemo, useState } from "react";

const ordersData = [
  {
    id: "#1005",
    customer: "Ahmed Ali",
    email: "ahmed@example.com",
    items: 2,
    amount: 249.99,
    status: "Delivered",
    payment: "Paid",
    date: "Aug 24, 2026",
  },
  {
    id: "#1004",
    customer: "Mohamed Hassan",
    email: "mohamed@example.com",
    items: 1,
    amount: 189.0,
    status: "Processing",
    payment: "Paid",
    date: "Aug 23, 2026",
  },
  {
    id: "#1003",
    customer: "Abdi Omar",
    email: "abdi@example.com",
    items: 3,
    amount: 599.0,
    status: "Pending",
    payment: "Paid",
    date: "Aug 22, 2026",
  },
  {
    id: "#1002",
    customer: "Amina Yusuf",
    email: "amina@example.com",
    items: 1,
    amount: 89.0,
    status: "Shipped",
    payment: "Paid",
    date: "Aug 21, 2026",
  },
  {
    id: "#1001",
    customer: "Hassan Ali",
    email: "hassan@example.com",
    items: 4,
    amount: 849.5,
    status: "Delivered",
    payment: "Paid",
    date: "Aug 20, 2026",
  },
  {
    id: "#1000",
    customer: "Fatima Mohamed",
    email: "fatima@example.com",
    items: 2,
    amount: 159.99,
    status: "Cancelled",
    payment: "Refunded",
    date: "Aug 19, 2026",
  },
  {
    id: "#999",
    customer: "Abdi Hassan",
    email: "abdi.hassan@example.com",
    items: 1,
    amount: 599.0,
    status: "Delivered",
    payment: "Paid",
    date: "Aug 18, 2026",
  },
  {
    id: "#998",
    customer: "Maryan Ahmed",
    email: "maryan@example.com",
    items: 2,
    amount: 329.0,
    status: "Processing",
    payment: "Paid",
    date: "Aug 17, 2026",
  },
];

const Orders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 6;

  const filteredOrders = useMemo(() => {
    return ordersData.filter((order) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ordersPerPage)
  );

  const startIndex = (currentPage - 1) * ordersPerPage;

  const visibleOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatus = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track customer orders.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Truck size={17} />
          Export Orders
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Orders"
          value="25"
          subtitle="All orders"
          icon={<Package size={19} />}
        />

        <SummaryCard
          title="Pending"
          value="4"
          subtitle="Needs attention"
          icon={<Package size={19} />}
        />

        <SummaryCard
          title="Processing"
          value="6"
          subtitle="Being prepared"
          icon={<Truck size={19} />}
        />

        <SummaryCard
          title="Delivered"
          value="15"
          subtitle="Successfully delivered"
          icon={<Package size={19} />}
        />
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 lg:max-w-md">
            <Search
              size={17}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders, customers..."
              className="h-10 w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={statusFilter}
                onChange={(e) => handleStatus(e.target.value)}
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">
                  Processing
                </option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 hover:bg-slate-50">
              Date
              <ChevronDown size={15} />
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Order
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Items
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Amount
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payment
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleOrders.map((order) => (
                <tr
                  key={order.id}
                  className="transition hover:bg-slate-50/60"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {order.id}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {order.date}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={order.customer} />

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {order.customer}
                        </p>

                        <p className="text-xs text-slate-400">
                          {order.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {order.items}{" "}
                    {order.items === 1 ? "item" : "items"}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-slate-800">
                      ${order.amount.toFixed(2)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <PaymentBadge status={order.payment} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                      title="View order"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.id}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {order.date}
                  </p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Avatar name={order.customer} />

                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {order.customer}
                  </p>

                  <p className="text-xs text-slate-400">
                    {order.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {order.items}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    ${order.amount.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Payment
                  </p>

                  <div className="mt-1">
                    <PaymentBadge status={order.payment} />
                  </div>
                </div>
              </div>

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                <Eye size={14} />
                View Order
              </button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {visibleOrders.length === 0 && (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Search size={20} className="text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No orders found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-600">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-600">
                {Math.min(
                  startIndex + ordersPerPage,
                  filteredOrders.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-600">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------------------------- */
/* Components                         */
/* ---------------------------------- */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
};

const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
      {initials}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-600",
    Processing: "bg-blue-50 text-blue-600",
    Shipped: "bg-purple-50 text-purple-600",
    Delivered: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }) => {
  const styles = {
    Paid: "bg-green-50 text-green-600",
    Refunded: "bg-red-50 text-red-600",
    Failed: "bg-red-50 text-red-600",
    Pending: "bg-amber-50 text-amber-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
        styles[status] || "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
};

export default Orders;