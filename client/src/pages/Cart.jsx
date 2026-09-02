import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import CartItemRow from "../components/CartItemRow";

const SHIPPING_THRESHOLD = 50;

export default function Cart() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  const shipping = 2;
  const total = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <span className="text-6xl block mb-6">🛒</span>
        <h2
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          className="text-2xl font-bold text-[#0f172a] mb-3"
        >
          Your cart is empty
        </h2>
        <p className="text-[#64748b] mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors"
        >
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          className="text-2xl font-bold text-[#0f172a]"
        >
          Shopping Cart{" "}
          <span className="text-[#64748b] font-normal text-lg">
            ({cart.length} {cart.length === 1 ? "item" : "items"})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="text-sm cursor-pointer text-[#94a3b8] hover:text-[#ef4444] transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          {/* Free shipping progress */}
          {cartTotal < SHIPPING_THRESHOLD && (
            <div className="bg-[#eef2ff] rounded-2xl p-4 mb-4 border border-[#c7d2fe]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🚚</span>
                <p className="text-sm font-medium text-[#3730a3]">
                  Add{" "}
                  <span className="font-bold">
                    ${(SHIPPING_THRESHOLD - cartTotal).toFixed(2)}
                  </span>{" "}
                  more for free shipping
                </p>
              </div>
              <div className="h-2 bg-[#c7d2fe] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4f46e5] rounded-full transition-all"
                  style={{
                    width: `${Math.min((cartTotal / SHIPPING_THRESHOLD) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
          {cartTotal >= SHIPPING_THRESHOLD && (
            <div className="bg-[#d1fae5] rounded-2xl p-4 mb-4 border border-[#6ee7b7]">
              <p className="text-sm font-medium text-[#065f46]">
                🎉 You've earned free shipping!
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-4 sm:p-5">
            {cart.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm text-[#4f46e5] hover:text-[#4338ca] font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sticky top-24">
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="font-bold text-[#0f172a] mb-5"
            >
              Order Summary
            </h2>

            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-[#334155]">
                <span>Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-[#334155]">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-[#10b981] font-medium"
                      : "font-medium"
                  }
                >
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-[#f1f5f9] pt-3">
                <div className="flex justify-between">
                  <span
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="font-bold text-[#0f172a]"
                  >
                    Total
                  </span>
                  <span
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    className="font-bold text-[#0f172a] text-lg"
                  >
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3.5 cursor-pointer bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors shadow-md shadow-[#4f46e5]/25 mb-3"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
