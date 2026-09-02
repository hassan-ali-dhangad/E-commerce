import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";



export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState("shipping");
  const [orderId] = useState(`ORD-2024-${Math.floor(Math.random() * 9000 + 1000)}`);

  const [shipping, setShipping] = useState({
    firstName: "Alex", lastName: "Johnson",
    email: "alex.johnson@email.com", phone: "+1 (555) 234-5678",
    address: "123 Maple Street", city: "San Francisco", state: "CA", zip: "94102", country: "US"
  });
  const [payment, setPayment] = useState({
    cardNumber: "", cardName: "", expiry: "", cvv: "", saveCard: false
  });
  const [shippingMethod, setShippingMethod] = useState("standard");

  const shippingCost = shippingMethod === "express" ? 14.99 : shippingMethod === "overnight" ? 24.99 : cartTotal >= 50 ? 0 : 7.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shippingCost + tax;

  const steps = [
  { key: "shipping", label: "Shipping" },
  { key: "payment", label: "Payment" },
  { key: "confirmation", label: "Confirmation" }];

  const stepIndex = steps.findIndex((s) => s.key === step);

  const handlePlaceOrder = () => {
    clearCart();
    setStep("confirmation");
  };

  if (step === "confirmation") {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center">
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-8 sm:p-12">
          <div className="w-20 h-20 bg-[#d1fae5] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-3xl font-extrabold text-[#0f172a] mb-2">Order Confirmed!</h1>
          <p className="text-[#64748b] mb-1">Thank you, {shipping.firstName}!</p>
          <p className="text-[#64748b] mb-6">Your order <span className="font-semibold text-[#0f172a]">{orderId}</span> has been placed successfully.</p>

          <div className="bg-[#f8fafc] rounded-2xl p-5 text-left mb-6 border border-[#e2e8f0]">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#94a3b8] mb-1">Order Number</p>
                <p className="font-semibold text-[#0f172a]">{orderId}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8] mb-1">Estimated Delivery</p>
                <p className="font-semibold text-[#0f172a]">
                  {shippingMethod === "overnight" ? "Tomorrow" : shippingMethod === "express" ? "2-3 business days" : "5-7 business days"}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8] mb-1">Shipping to</p>
                <p className="font-semibold text-[#0f172a]">{shipping.city}, {shipping.state}</p>
              </div>
              <div>
                <p className="text-xs text-[#94a3b8] mb-1">Total Charged</p>
                <p className="font-semibold text-[#0f172a]">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#64748b] mb-6">A confirmation email has been sent to <span className="font-medium text-[#0f172a]">{shipping.email}</span></p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/orders" className="px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors">
              View Order History
            </Link>
            <Link to="/shop" className="px-6 py-3 bg-white text-[#334155] font-semibold rounded-xl border border-[#e2e8f0] hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-2xl font-bold text-[#0f172a] mb-6">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center mb-8 max-w-md">
        {steps.slice(0, 2).map((s, i) =>
        <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            i < stepIndex ? "bg-[#10b981] text-white" : i === stepIndex ? "bg-[#4f46e5] text-white" : "bg-[#f1f5f9] text-[#94a3b8]"}`
            }>
                {i < stepIndex ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === stepIndex ? "text-[#4f46e5]" : i < stepIndex ? "text-[#10b981]" : "text-[#94a3b8]"}`}>
                {s.label}
              </span>
            </div>
            {i < 1 && <div className={`flex-1 h-0.5 mx-3 transition-colors ${i < stepIndex ? "bg-[#10b981]" : "bg-[#e2e8f0]"}`} />}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === "shipping" &&
          <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-5">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                { label: "First Name", key: "firstName", col: 1 },
                { label: "Last Name", key: "lastName", col: 1 },
                { label: "Email Address", key: "email", col: 2 },
                { label: "Phone Number", key: "phone", col: 2 },
                { label: "Street Address", key: "address", col: 2 },
                { label: "City", key: "city", col: 1 },
                { label: "State", key: "state", col: 1 },
                { label: "ZIP Code", key: "zip", col: 1 }].
                map(({ label, key, col }) =>
                <div key={key} className={col === 2 ? "col-span-2" : ""}>
                      <label className="block text-xs font-medium text-[#334155] mb-1.5">{label}</label>
                      <input
                    type="text"
                    value={shipping[key]}
                    onChange={(e) => setShipping((s) => ({ ...s, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors" />
                  
                    </div>
                )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-4">Shipping Method</h2>
                <div className="space-y-3">
                  {[
                { id: "standard", label: "Standard Shipping", sub: "5-7 business days", price: cartTotal >= 50 ? "FREE" : "$7.99" },
                { id: "express", label: "Express Shipping", sub: "2-3 business days", price: "$14.99" },
                { id: "overnight", label: "Overnight Shipping", sub: "Next business day", price: "$24.99" }].
                map((opt) =>
                <label key={opt.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === opt.id ? "border-[#4f46e5] bg-[#eef2ff]" : "border-[#e2e8f0] hover:border-[#c7d2fe]"}`}>
                      <input
                    type="radio"
                    name="shipping"
                    value={opt.id}
                    checked={shippingMethod === opt.id}
                    onChange={() => setShippingMethod(opt.id)}
                    className="accent-[#4f46e5]" />
                  
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0f172a]">{opt.label}</p>
                        <p className="text-xs text-[#64748b]">{opt.sub}</p>
                      </div>
                      <span className={`text-sm font-semibold ${opt.price === "FREE" ? "text-[#10b981]" : "text-[#0f172a]"}`}>{opt.price}</span>
                    </label>
                )}
                </div>
              </div>

              <button
              onClick={() => setStep("payment")}
              className="w-full py-3.5 bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors">
              
                Continue to Payment →
              </button>
            </div>
          }

          {step === "payment" &&
          <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-5">Payment Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1.5">Card Number</label>
                    <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={payment.cardNumber}
                    onChange={(e) => setPayment((p) => ({ ...p, cardNumber: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                    maxLength={19} />
                  
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#334155] mb-1.5">Cardholder Name</label>
                    <input
                    type="text"
                    placeholder="Alex Johnson"
                    value={payment.cardName}
                    onChange={(e) => setPayment((p) => ({ ...p, cardName: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors" />
                  
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1.5">Expiry Date</label>
                      <input
                      type="text"
                      placeholder="MM / YY"
                      value={payment.expiry}
                      onChange={(e) => setPayment((p) => ({ ...p, expiry: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors" />
                    
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#334155] mb-1.5">CVV</label>
                      <input
                      type="text"
                      placeholder="123"
                      value={payment.cvv}
                      onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                      maxLength={4} />
                    
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={payment.saveCard}
                    onChange={(e) => setPayment((p) => ({ ...p, saveCard: e.target.checked }))}
                    className="accent-[#4f46e5]" />
                  
                    <span className="text-sm text-[#334155]">Save card for future purchases</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 mt-4 p-3 bg-[#f8fafc] rounded-xl">
                  <svg className="w-4 h-4 text-[#10b981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-[#64748b]">Your payment information is encrypted and secure.</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                onClick={() => setStep("shipping")}
                className="flex-1 py-3 bg-white text-[#334155] font-medium rounded-xl border border-[#e2e8f0] hover:border-[#4f46e5] hover:text-[#4f46e5] transition-colors">
                
                  ← Back
                </button>
                <button
                onClick={handlePlaceOrder}
                className="flex-2 flex-1 py-3 bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors">
                
                  Place Order — ${total.toFixed(2)}
                </button>
              </div>
            </div>
          }
        </div>

        {/* Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5 sticky top-24">
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) =>
              <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover bg-[#f8fafc]" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#4f46e5] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#0f172a] line-clamp-1">{item.product.name}</p>
                    {item.selectedColor && <p className="text-[10px] text-[#94a3b8]">{item.selectedColor}</p>}
                  </div>
                  <span className="text-xs font-semibold text-[#0f172a]">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-[#f1f5f9] pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-[#334155]">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#334155]">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-[#10b981] font-medium" : ""}>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[#334155]">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#0f172a] border-t border-[#f1f5f9] pt-2">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Total</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}