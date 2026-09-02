import { useParams, Link } from "react-router-dom";
import { orders } from "../data/orders";
import Badge from "../components/Badge";

export default function OrderHistory() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-6">
        <Link to="/" className="hover:text-[#4f46e5]">Home</Link>
        <span>/</span>
        <Link to="/dashboard" className="hover:text-[#4f46e5]">Dashboard</Link>
        <span>/</span>
        <span className="text-[#334155] font-medium">Orders</span>
      </div>

      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-bold text-[#0f172a] mb-6">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) =>
        <div key={order.id} className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:border-[#c7d2fe] transition-colors">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9] bg-[#f8fafc]">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-[#94a3b8]">Order</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] text-sm">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#94a3b8]">Date</p>
                  <p className="text-sm font-medium text-[#334155]">{new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-[#94a3b8]">Total</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-sm font-bold text-[#0f172a]">${order.total.toFixed(2)}</p>
                </div>
              </div>
              <Badge type={order.status} size="md" />
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-4 mb-4">
                {order.items.map((item) =>
              <div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-[#f8fafc]" />
                    <div>
                      <p className="text-sm font-medium text-[#0f172a] max-w-[150px] line-clamp-1">{item.name}</p>
                      {item.variant && <p className="text-xs text-[#64748b]">{item.variant}</p>}
                      <p className="text-xs text-[#94a3b8]">Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
              )}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {order.trackingNumber &&
              <p className="text-xs text-[#64748b]">
                    📦 Tracking: <span className="font-mono font-medium text-[#334155]">{order.trackingNumber}</span>
                  </p>
              }
                <div className="ml-auto flex gap-2">
                  <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-1.5 text-xs font-medium text-[#4f46e5] border border-[#c7d2fe] bg-[#eef2ff] rounded-xl hover:bg-[#e0e7ff] transition-colors">
                  
                    View Details
                  </Link>
                  {order.status === "delivered" &&
                <button className="px-4 py-1.5 text-xs font-medium text-[#334155] border border-[#e2e8f0] rounded-xl hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors">
                      Leave Review
                    </button>
                }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

}

export function OrderDetail() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="text-center py-16 max-w-4xl mx-auto px-4">
        <span className="text-5xl block mb-4">📦</span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-xl font-bold text-[#0f172a] mb-2">Order not found</h2>
        <Link to="/orders" className="text-[#4f46e5]">Back to Orders</Link>
      </div>);

  }

  const statusSteps = ["processing", "shipped", "delivered"];
  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-6">
        <Link to="/" className="hover:text-[#4f46e5]">Home</Link>
        <span>/</span>
        <Link to="/orders" className="hover:text-[#4f46e5]">Orders</Link>
        <span>/</span>
        <span className="text-[#334155] font-medium">{order.id}</span>
      </div>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-bold text-[#0f172a]">{order.id}</h1>
          <p className="text-sm text-[#64748b]">Placed on {new Date(order.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <Badge type={order.status} size="md" />
      </div>

      {/* Tracking progress */}
      {order.status !== "cancelled" &&
      <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 mb-5">
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-5">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#e2e8f0] -z-0" />
            <div
            className="absolute left-0 top-5 h-0.5 bg-[#4f46e5] transition-all"
            style={{ width: `${currentStepIndex / (statusSteps.length - 1) * 100}%` }} />
          
            {statusSteps.map((s, i) => {
            const done = i <= currentStepIndex;
            const labels = {
              processing: { label: "Processing", icon: "🔄" },
              shipped: { label: "Shipped", icon: "🚚" },
              delivered: { label: "Delivered", icon: "✅" }
            };
            return (
              <div key={s} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-colors ${done ? "bg-[#4f46e5] border-[#4f46e5]" : "bg-white border-[#e2e8f0]"}`}>
                    {done ? <span className="text-white text-sm">✓</span> : <span className="text-[#94a3b8]">{labels[s].icon}</span>}
                  </div>
                  <span className={`text-xs font-medium ${done ? "text-[#4f46e5]" : "text-[#94a3b8]"}`}>{labels[s].label}</span>
                </div>);

          })}
          </div>
          {order.trackingNumber &&
        <p className="mt-4 text-xs text-[#64748b]">
              Tracking number: <span className="font-mono font-medium text-[#0f172a]">{order.trackingNumber}</span>
            </p>
        }
          {order.estimatedDelivery && order.status !== "delivered" &&
        <p className="mt-1 text-xs text-[#64748b]">
              Estimated delivery: <span className="font-medium text-[#0f172a]">{new Date(order.estimatedDelivery).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
            </p>
        }
        </div>
      }

      <div className="grid md:grid-cols-2 gap-5">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-4">Items Ordered</h2>
          <div className="space-y-4">
            {order.items.map((item) =>
            <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-[#f8fafc]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0f172a]">{item.name}</p>
                  {item.variant && <p className="text-xs text-[#64748b]">{item.variant}</p>}
                  <p className="text-xs text-[#94a3b8]">Qty: {item.quantity}</p>
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-sm font-bold text-[#0f172a]">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <div className="border-t border-[#f1f5f9] pt-3 mt-4 flex justify-between">
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a]">Total</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a]">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-4">Shipping Address</h2>
          <div className="text-sm text-[#334155] space-y-1">
            <p className="font-medium text-[#0f172a]">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <Link to="/shop" className="flex-1 py-2 text-xs font-medium text-[#4f46e5] bg-[#eef2ff] rounded-xl text-center hover:bg-[#e0e7ff] transition-colors">
              Buy Again
            </Link>
            {order.status !== "cancelled" && order.status !== "delivered" &&
            <button className="flex-1 py-2 text-xs font-medium text-[#ef4444] border border-[#fca5a5] rounded-xl hover:bg-[#fee2e2] transition-colors">
                Cancel Order
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

}