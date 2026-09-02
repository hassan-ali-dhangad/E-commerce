import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import Badge from "./Badge";

export default function ProductCard({ product, view = "grid" }) {
  const { cart, addToCart, updateQuantity, toggleWishlist, isInWishlist } =
    useStore();
  const inWishlist = isInWishlist(product.id);
  const cartItem = cart.find((item) => item.product.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] flex gap-4 p-4 hover:border-[#c7d2fe] hover:shadow-md transition-all">
        <Link to={`/product/${product.id}`} className="flex-shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-[#f8fafc] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <p className="text-xs text-[#64748b] mb-0.5">{product.brand}</p>
            <Link to={`/product/${product.id}`}>
              <h3
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="font-semibold text-[#0f172a] hover:text-[#4f46e5] transition-colors line-clamp-2"
              >
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-[#64748b] mt-2 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex items-baseline gap-2">
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-lg font-bold text-[#0f172a]"
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#94a3b8] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {quantity > 0 ? (
              <div className="flex items-center gap-1 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] px-1 py-1">
                <button
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-[#334155]"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="w-8 text-center text-sm font-medium text-[#0f172a]">
                  {quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white transition-colors text-[#334155]"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="px-4 py-2 bg-[#4f46e5] text-white text-sm font-medium rounded-xl hover:bg-[#4338ca] transition-colors"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden hover:border-[#c7d2fe] hover:shadow-lg transition-all duration-200">
      {/* Image */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden bg-[#f8fafc]"
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && <Badge type={product.badge} />}
          {discount && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#ef4444] text-white">
              -{discount}%
            </span>
          )}
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute cursor-pointer top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <svg
            className={`w-4 h-4 ${inWishlist ? "text-[#ef4444]" : "text-[#94a3b8]"}`}
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-[#64748b] mb-0.5 font-medium">
          {product.brand}
        </p>
        <Link to={`/product/${product.id}`}>
          <h3
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="font-semibold text-[#0f172a] hover:text-[#4f46e5] transition-colors line-clamp-2 text-sm mb-2"
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-1.5">
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-base font-bold text-[#0f172a]"
            >
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#94a3b8] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-1 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] px-1 py-1">
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-lg hover:bg-white transition-colors text-[#334155]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span className="w-6 text-center text-sm font-medium text-[#0f172a]">
                {quantity}
              </span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-lg hover:bg-white transition-colors text-[#334155]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-8 h-8 cursor-pointer bg-[#4f46e5] text-white rounded-xl flex items-center justify-center hover:bg-[#4338ca] transition-colors"
              title="Add to cart"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
