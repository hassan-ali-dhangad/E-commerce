import { ArrowRight } from "lucide-react";

const orders = [
  {
    id: "#1005",
    customer: "Ahmed Ali",
    email: "ahmed@example.com",
    amount: "$249.99",
    status: "Delivered",
  },
  {
    id: "#1004",
    customer: "Mohamed Hassan",
    email: "mohamed@example.com",
    amount: "$189.00",
    status: "Processing",
  },
  {
    id: "#1003",
    customer: "Abdi Omar",
    email: "abdi@example.com",
    amount: "$599.00",
    status: "Pending",
  },
  {
    id: "#1002",
    customer: "Amina Yusuf",
    email: "amina@example.com",
    amount: "$89.00",
    status: "Shipped",
  },
];

const statusStyles = {
  Delivered: "bg-green-50 text-green-700 ring-green-600/10",
  Processing: "bg-indigo-50 text-indigo-700 ring-indigo-600/10",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/10",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-600/10",
};

const avatarStyles = [
  "bg-indigo-50 text-indigo-600",
  "bg-slate-100 text-slate-600",
  "bg-amber-50 text-amber-600",
  "bg-sky-50 text-sky-600",
];

const RecentOrders = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">
            Recent Orders
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Latest customer purchases
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700">
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                avatarStyles[index % avatarStyles.length]
              }`}
            >
              {order.customer.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-800">
                {order.customer}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {order.email}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-[13px] font-bold text-slate-900">
                {order.amount}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                  statusStyles[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
