import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { orders } from "../data/orders";
import { products } from "../data/products";
import { useStore } from "../context/StoreContext";
import Badge from "../components/Badge";
import ProductCard from "../components/ProductCard";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const { wishlist, toggleWishlist } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const setTab = (tab) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next);
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "orders", label: "Orders", icon: "📦" },
    { key: "wishlist", label: "Wishlist", icon: "❤️" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          {/* User card */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format"
                alt="Alex Johnson"
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className="font-bold text-[#0f172a]"
                >
                  Alex Johnson
                </p>
                <p className="text-xs text-[#64748b]">alex.johnson@email.com</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                ["1", "Orders"],
                ["2", "Wishlist"],
                ["3", "Reviews"],
              ].map(([v, l]) => (
                <div key={l} className="bg-[#f8fafc] rounded-xl py-2">
                  <p
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="font-bold text-[#0f172a]"
                  >
                    {v}
                  </p>
                  <p className="text-[#64748b]">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          <nav className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#eef2ff] text-[#4f46e5] border-r-2 border-[#4f46e5]"
                    : "text-[#334155] hover:bg-[#f8fafc]"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
                {tab.key === "wishlist" && wishlist.length > 0 && (
                  <span className="ml-auto text-xs bg-[#e0e7ff] text-[#4f46e5] px-1.5 py-0.5 rounded-full font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </button>
            ))}
            <div className="border-t border-[#f1f5f9]">
              <Link
                to="/login"
                className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#ef4444] hover:bg-[#fee2e2] transition-colors"
              >
                <span>🚪</span> Sign Out
              </Link>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <div>
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-2xl font-bold text-[#0f172a] mb-6"
              >
                Dashboard
              </h1>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    label: "Total Orders",
                    value: "4",
                    icon: "📦",
                    color: "#eef2ff",
                    textColor: "#4f46e5",
                  },
                  {
                    label: "Total Spent",
                    value: "$1,413",
                    icon: "💰",
                    color: "#d1fae5",
                    textColor: "#059669",
                  },
                  {
                    label: "Wishlist",
                    value: "3",
                    icon: "❤️",
                    color: "#fee2e2",
                    textColor: "#ef4444",
                  },
                  {
                    label: "Reviews",
                    value: "3",
                    icon: "⭐",
                    color: "#fef3c7",
                    textColor: "#d97706",
                  },
                ].map(({ label, value, icon, color, textColor }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl border border-[#e2e8f0] p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ backgroundColor: color }}
                      >
                        {icon}
                      </div>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        color: textColor,
                      }}
                      className="text-2xl font-extrabold"
                    >
                      {value}
                    </p>
                    <p className="text-xs text-[#64748b]">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="font-bold text-[#0f172a]"
                  >
                    Recent Orders
                  </h2>
                  <button
                    onClick={() => setTab("orders")}
                    className="text-sm text-[#4f46e5] hover:text-[#4338ca]"
                  >
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f8fafc] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0f172a]">
                          {order.id}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""} ·{" "}
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge type={order.status} size="sm" />
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                        className="text-sm font-bold text-[#0f172a] flex-shrink-0"
                      >
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-2xl font-bold text-[#0f172a] mb-6"
              >
                My Orders
              </h1>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-5 border-b border-[#f1f5f9]">
                      <div>
                        <p
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                          className="font-bold text-[#0f172a]"
                        >
                          {order.id}
                        </p>
                        <p className="text-xs text-[#64748b]">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge type={order.status} size="md" />
                        <span
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                          className="font-bold text-[#0f172a]"
                        >
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover bg-[#f8fafc]"
                            />
                            <div>
                              <p className="text-xs font-medium text-[#0f172a] max-w-[120px] line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-[#94a3b8]">
                                ×{item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {order.trackingNumber && (
                          <p className="text-xs text-[#64748b]">
                            Tracking:{" "}
                            <span className="font-medium text-[#0f172a]">
                              {order.trackingNumber}
                            </span>
                          </p>
                        )}
                        <div className="flex gap-2 ml-auto">
                          <Link
                            to={`/orders/${order.id}`}
                            className="px-4 py-1.5 text-xs font-medium text-[#4f46e5] border border-[#c7d2fe] rounded-xl hover:bg-[#eef2ff] transition-colors"
                          >
                            View Details
                          </Link>
                          {order.status === "delivered" && (
                            <button className="px-4 py-1.5 text-xs font-medium text-[#334155] border border-[#e2e8f0] rounded-xl hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors">
                              Buy Again
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div>
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-2xl font-bold text-[#0f172a] mb-6"
              >
                My Wishlist{" "}
                <span className="text-[#64748b] font-normal text-lg">
                  ({wishlistProducts.length})
                </span>
              </h1>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl block mb-4">❤️</span>
                  <p className="text-[#64748b]">
                    Your wishlist is empty. Start adding products!
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block mt-4 text-[#4f46e5] font-medium"
                  >
                    Browse Shop →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-2xl font-bold text-[#0f172a] mb-6"
              >
                My Profile
              </h1>
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-5">
                <div className="flex items-center gap-5 mb-6">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format"
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover"
                    />
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#4f46e5] rounded-lg flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <p
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      className="text-xl font-bold text-[#0f172a]"
                    >
                      Alex Johnson
                    </p>
                    <p className="text-[#64748b] text-sm">
                      Member since January 2024
                    </p>
                    <span className="text-xs bg-[#d1fae5] text-[#065f46] px-2 py-0.5 rounded-full font-medium">
                      Verified Account ✓
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "First Name", value: "Alex" },
                    { label: "Last Name", value: "Johnson" },
                    { label: "Email", value: "alex.johnson@email.com" },
                    { label: "Phone", value: "+1 (555) 234-5678" },
                    { label: "Date of Birth", value: "April 15, 1990" },
                    { label: "Gender", value: "Prefer not to say" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        defaultValue={value}
                        className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h2
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  className="font-bold text-[#0f172a] mb-4"
                >
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ["Street Address", "123 Maple Street"],
                    ["City", "San Francisco"],
                    ["State", "CA"],
                    ["ZIP Code", "94102"],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                        {l}
                      </label>
                      <input
                        type="text"
                        defaultValue={v}
                        className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5]"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-4 px-6 py-3 cursor-pointer bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors">
                Save Changes
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? "bg-[#4f46e5]" : "bg-[#e2e8f0]"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}
