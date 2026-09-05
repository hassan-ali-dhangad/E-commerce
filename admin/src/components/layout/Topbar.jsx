import { Bell, Menu, X, ShoppingBag } from "lucide-react";

import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

// ==========================================
// SAMPLE ORDER NOTIFICATIONS
// ==========================================

const sampleOrders = [
  {
    id: 1,
    orderId: "#ORD-1001",
    customer: "Mohamed Hassan",
    total: 120,
    status: "New",
    time: "2 minutes ago",
  },
  {
    id: 2,
    orderId: "#ORD-1002",
    customer: "Ahmed Ali",
    total: 85,
    status: "New",
    time: "10 minutes ago",
  },
  {
    id: 3,
    orderId: "#ORD-1003",
    customer: "Amina Yusuf",
    total: 250,
    status: "Processing",
    time: "25 minutes ago",
  },
  {
    id: 4,
    orderId: "#ORD-1004",
    customer: "Abdi Mohamed",
    total: 75,
    status: "New",
    time: "1 hour ago",
  },
  {
    id: 5,
    orderId: "#ORD-1005",
    customer: "Hodan Ali",
    total: 300,
    status: "Processing",
    time: "2 hours ago",
  },
  {
    id: 6,
    orderId: "#ORD-1006",
    customer: "Ismail Omar",
    total: 150,
    status: "New",
    time: "3 hours ago",
  },
  {
    id: 7,
    orderId: "#ORD-1007",
    customer: "Fatima Hassan",
    total: 99,
    status: "New",
    time: "4 hours ago",
  },
  {
    id: 8,
    orderId: "#ORD-1008",
    customer: "Yusuf Ahmed",
    total: 450,
    status: "Processing",
    time: "Yesterday",
  },
  {
    id: 9,
    orderId: "#ORD-1009",
    customer: "Khadija Ali",
    total: 180,
    status: "New",
    time: "Yesterday",
  },
  {
    id: 10,
    orderId: "#ORD-1010",
    customer: "Abdirahman Noor",
    total: 220,
    status: "New",
    time: "Yesterday",
  },
];

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu */}
      <button onClick={onMenuClick} className="text-slate-600 lg:hidden">
        <Menu size={22} />
      </button>

      {/* Spacer */}
      <div className="flex-1 lg:flex-none" />

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* ================================= */}
        {/* NOTIFICATION */}
        {/* ================================= */}

        <div ref={notificationRef} className="relative">
          {/* Bell Button */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <Bell size={20} />

            {/* Notification Badge */}
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
              {sampleOrders.length}
            </span>
          </button>

          {/* ================================= */}
          {/* NOTIFICATION DROPDOWN */}
          {/* ================================= */}

          {showNotifications && (
            <div className="absolute -right-[50px] top-10 z-50 w-[300px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
             
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Order Notifications
                  </h3>

                  <p className="text-xs text-slate-400">
                    You have {sampleOrders.length} new order notifications
                  </p>
                </div>

                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ================================= */}
              {/* ORDERS */}
              {/* ================================= */}

              <div className="max-h-[280px] overflow-y-auto ">
                {sampleOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex  gap-3 border-b border-slate-100 p-4 transition hover:bg-slate-50"
                  >
                    {/* Order Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                      <ShoppingBag size={18} />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">
                          New Order Received
                        </p>

                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            order.status === "New"
                              ? "bg-green-50 text-green-600"
                              : "bg-yellow-50 text-yellow-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-indigo-600">
                        {order.orderId}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Customer:{" "}
                        <span className="font-medium text-slate-700">
                          {order.customer}
                        </span>
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Order Total:{" "}
                        <span className="font-semibold text-slate-800">
                          ${order.total}
                        </span>
                      </p>

                      <p className="mt-2 text-[10px] text-slate-400">
                        {order.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 p-3">
                <button
                  onClick={() => {
                    setShowNotifications(false);

                    window.location.href = "/admin/orders";
                  }}
                  className="w-full rounded-lg bg-indigo-50 py-2.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                >
                  View All Orders
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        {/* ================================= */}
        {/* USER PROFILE */}
        {/* ================================= */}

        <button className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-900">
              {user?.name || "User"}
            </p>

            <p className="text-[10px] text-slate-400">{user?.role || "User"}</p>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
