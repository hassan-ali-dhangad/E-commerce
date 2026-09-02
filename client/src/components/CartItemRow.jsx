import { Link } from "react-router-dom";

import { useStore } from "../context/StoreContext";





export default function CartItemRow({ item }) {
  const { updateQuantity, removeFromCart } = useStore();
  const { product, quantity, selectedColor, selectedSize } = item;

  return (
    <div className="flex gap-4 py-4 border-b border-[#f1f5f9] last:border-0">
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-xl bg-[#f8fafc] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-[#64748b] font-medium">{product.brand}</p>
            <Link to={`/product/${product.id}`}>
              <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-semibold text-[#0f172a] text-sm hover:text-[#4f46e5] transition-colors line-clamp-2">
                {product.name}
              </h4>
            </Link>
            {(selectedColor || selectedSize) &&
            <p className="text-xs text-[#64748b] mt-0.5">
                {[selectedColor, selectedSize].filter(Boolean).join(" / ")}
              </p>
            }
          </div>
          <button
            onClick={() => removeFromCart(product.id)}
            className="flex-shrink-0 w-7 h-7 cursor-pointer rounded-lg hover:bg-[#fee2e2] text-[#94a3b8] hover:text-[#ef4444] transition-colors flex items-center justify-center">
            
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center gap-1 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] px-1 py-1">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-lg hover:bg-white transition-colors text-[#334155]">
              
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center text-sm font-medium text-[#0f172a]">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-7 h-7 cursor-pointer flex items-center justify-center rounded-lg hover:bg-white transition-colors text-[#334155]">
              
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a]">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>);

}