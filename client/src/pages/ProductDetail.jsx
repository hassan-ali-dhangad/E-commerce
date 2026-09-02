import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useStore } from "../context/StoreContext";
import Badge from "../components/Badge";
import ProductCard from "../components/ProductCard";


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  if (!product) {
    return (
      <div className="text-center py-20">
        <span className="text-5xl block mb-4">😕</span>
        <h2
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          className="text-2xl font-bold text-[#0f172a] mb-2"
        >
          Product not found
        </h2>
        <Link to="/shop" className="text-[#4f46e5]">
          Back to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-6 flex-wrap">
        <Link to="/" className="hover:text-[#4f46e5]">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#4f46e5]">
          Shop
        </Link>
        <span>/</span>
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-[#4f46e5] capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#334155] font-medium line-clamp-1">
          {product.name}
        </span>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div>
          <div className="relative rounded-2xl bg-[#f8fafc] overflow-hidden aspect-square mb-3 border border-[#e2e8f0]">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge type={product.badge} size="md" />
              </div>
            )}
            {discount && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-[#ef4444] text-white text-sm font-semibold rounded-full">
                  -{discount}%
                </span>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-[#4f46e5]"
                      : "border-[#e2e8f0] hover:border-[#c7d2fe]"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="text-sm font-medium text-[#64748b] mb-1">
                {product.brand}
              </p>
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-2xl sm:text-3xl font-bold text-[#0f172a]"
              >
                {product.name}
              </h1>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                inWishlist
                  ? "bg-[#fee2e2] border-[#fca5a5] text-[#ef4444]"
                  : "bg-white border-[#e2e8f0] text-[#94a3b8] hover:border-[#ef4444] hover:text-[#ef4444]"
              }`}
            >
              <svg
                className="w-5 h-5"
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
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-[#94a3b8]">|</span>
            <span
              className={`text-sm font-medium ${product.inStock ? "text-[#10b981]" : "text-[#ef4444]"}`}
            >
              {product.inStock ? "✓ In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-3xl font-extrabold text-[#0f172a]"
            >
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-[#94a3b8] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-[#10b981] bg-[#d1fae5] px-2 py-0.5 rounded-full">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Colors */}
          {product.colors && (
            <div className="mb-5">
              <p className="text-sm font-medium text-[#0f172a] mb-2">
                Color: <span className="text-[#4f46e5]">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      selectedColor === color
                        ? "border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5]"
                        : "border-[#e2e8f0] text-[#334155] hover:border-[#4f46e5]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && (
            <div className="mb-5">
              <p className="text-sm font-medium text-[#0f172a] mb-2">
                Size: <span className="text-[#4f46e5]">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 text-xs font-medium rounded-lg border transition-colors ${
                      selectedSize === size
                        ? "border-[#4f46e5] bg-[#4f46e5] text-white"
                        : "border-[#e2e8f0] text-[#334155] hover:border-[#4f46e5]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-[#0f172a] mb-2">Quantity</p>
            <div className="inline-flex items-center gap-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-1 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg hover:bg-white transition-colors text-[#334155] flex items-center justify-center"
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
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="w-12 text-center font-bold text-[#0f172a]"
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg hover:bg-white transition-colors text-[#334155] flex items-center justify-center"
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
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                addedToCart
                  ? "bg-[#10b981] text-white"
                  : "bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-md shadow-[#4f46e5]/25"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToCart ? (
                <>
                  <span>✓</span> Added to Cart!
                </>
              ) : (
                <>
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>{" "}
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => {
                addToCart(product, quantity, selectedColor, selectedSize);
                navigate("/checkout");
              }}
              disabled={!product.inStock}
              className="flex-1 py-3 bg-white text-[#4f46e5] font-semibold rounded-xl border-2 border-[#4f46e5] hover:bg-[#eef2ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

         
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-1 bg-[#f8fafc] rounded-xl p-1 w-fit mb-6 border border-[#e2e8f0]">
          {["description", "features"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                activeTab === tab
                  ? "bg-white text-[#4f46e5] shadow-sm"
                  : "text-[#64748b] hover:text-[#334155]"
              }`}
            >
              {tab}
          
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <p className="text-[#334155] leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {activeTab === "features" && (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
            <ul className="space-y-3">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-[#eef2ff] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-[#4f46e5]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-[#334155]">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="text-xl font-bold text-[#0f172a] mb-6"
          >
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
