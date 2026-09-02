import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

const customersData = [
  {
    id: "CUS-001",
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    phone: "+252 61 234 5678",
    orders: 8,
    spent: 1249.5,
    status: "Active",
    joined: "Aug 20, 2026",
  },
  {
    id: "CUS-002",
    name: "Mohamed Hassan",
    email: "mohamed@example.com",
    phone: "+252 63 456 7890",
    orders: 5,
    spent: 789.0,
    status: "Active",
    joined: "Aug 18, 2026",
  },
  {
    id: "CUS-003",
    name: "Amina Yusuf",
    email: "amina@example.com",
    phone: "+252 61 345 6789",
    orders: 12,
    spent: 2450.0,
    status: "Active",
    joined: "Aug 15, 2026",
  },
  {
    id: "CUS-004",
    name: "Abdi Omar",
    email: "abdi@example.com",
    phone: "+252 62 567 8901",
    orders: 3,
    spent: 349.99,
    status: "Inactive",
    joined: "Aug 12, 2026",
  },
  {
    id: "CUS-005",
    name: "Fatima Mohamed",
    email: "fatima@example.com",
    phone: "+252 61 678 9012",
    orders: 7,
    spent: 1099.0,
    status: "Active",
    joined: "Aug 10, 2026",
  },
  {
    id: "CUS-006",
    name: "Hassan Ali",
    email: "hassan@example.com",
    phone: "+252 61 789 0123",
    orders: 15,
    spent: 3899.5,
    status: "Active",
    joined: "Aug 8, 2026",
  },
  {
    id: "CUS-007",
    name: "Maryan Ahmed",
    email: "maryan@example.com",
    phone: "+252 63 890 1234",
    orders: 4,
    spent: 599.0,
    status: "Active",
    joined: "Aug 5, 2026",
  },
  {
    id: "CUS-008",
    name: "Abdullahi Noor",
    email: "abdullahi@example.com",
    phone: "+252 61 901 2345",
    orders: 1,
    spent: 89.99,
    status: "Inactive",
    joined: "Aug 2, 2026",
  },
  {
    id: "CUS-009",
    name: "Khadra Hassan",
    email: "khadra@example.com",
    phone: "+252 62 123 4567",
    orders: 9,
    spent: 1599.0,
    status: "Active",
    joined: "Jul 29, 2026",
  },
  {
    id: "CUS-010",
    name: "Omar Ibrahim",
    email: "omar@example.com",
    phone: "+252 61 234 8901",
    orders: 6,
    spent: 899.5,
    status: "Active",
    joined: "Jul 25, 2026",
  },
];

const Customers = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 6;

  const filteredCustomers = useMemo(() => {
    return customersData.filter((customer) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue) ||
        customer.phone.toLowerCase().includes(searchValue) ||
        customer.id.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / customersPerPage)
  );

  const startIndex =
    (currentPage - 1) * customersPerPage;

  const visibleCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + customersPerPage
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
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your customers and view their activity.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <UserPlus size={17} />
          Add Customer
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Customers"
          value="120"
          subtitle="All registered customers"
          icon={<Users size={19} />}
        />

        <SummaryCard
          title="Active Customers"
          value="108"
          subtitle="90% of customers"
          icon={<Users size={19} />}
        />

        <SummaryCard
          title="New This Month"
          value="24"
          subtitle="+12% from last month"
          icon={<UserPlus size={19} />}
        />

        <SummaryCard
          title="Avg. Customer Value"
          value="$1,248"
          subtitle="Average lifetime spend"
          icon={<span className="text-sm font-bold">$</span>}
        />
      </div>

      {/* Customers Card */}
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
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Search customers..."
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
                onChange={(e) =>
                  handleStatus(e.target.value)
                }
                className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-600 outline-none focus:border-indigo-500"
              >
                <option value="All">All Customers</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Sort
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
                  Customer
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Contact
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Orders
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Total Spent
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Joined
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {visibleCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-slate-50/60"
                >
                  {/* Customer */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.name} />

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {customer.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {customer.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Mail size={13} className="text-slate-400" />
                        {customer.email}
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {customer.phone}
                      </p>
                    </div>
                  </td>

                  {/* Orders */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-700">
                      {customer.orders}
                    </span>
                  </td>

                  {/* Spent */}
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-800">
                      ${customer.spent.toFixed(2)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={customer.status} />
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {customer.joined}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="View customer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        title="More options"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-slate-100 md:hidden">
          {visibleCustomers.map((customer) => (
            <div
              key={customer.id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={customer.name} />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {customer.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <StatusBadge status={customer.status} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Orders
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {customer.orders}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Spent
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    ${customer.spent.toFixed(0)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400">
                    Joined
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-600">
                    {customer.joined.replace(", 2026", "")}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <Eye size={14} />
                  View Customer
                </button>

                <button
                  type="button"
                  className="flex h-8 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
                >
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty */}
        {visibleCustomers.length === 0 && (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Users size={20} className="text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No customers found
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-medium text-slate-600">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-600">
                {Math.min(
                  startIndex + customersPerPage,
                  filteredCustomers.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-600">
                {filteredCustomers.length}
              </span>{" "}
              customers
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
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
                  type="button"
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
                type="button"
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

/* -------------------------------- */
/* Summary Card                     */
/* -------------------------------- */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
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

/* -------------------------------- */
/* Avatar                           */
/* -------------------------------- */

const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
      {initials}
    </div>
  );
};

/* -------------------------------- */
/* Status Badge                     */
/* -------------------------------- */

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-green-50 text-green-600",
    Inactive: "bg-slate-100 text-slate-500",
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

export default Customers;