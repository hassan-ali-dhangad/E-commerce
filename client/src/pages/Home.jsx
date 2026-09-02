import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  categories,
  featuredProducts,
  deals,
  products,
} from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-white to-[#f0f9ff] pt-12 pb-16 sm:pt-16 sm:pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#4f46e5]/8 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0ea5e9]/8 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-sm font-medium text-[#4f46e5] border border-[#c7d2fe] mb-6 shadow-sm">
                <span className="w-2 h-2 bg-[#4f46e5] rounded-full animate-pulse" />
                New arrivals are here
              </div>
              <h1
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] leading-[1.1] mb-5"
              >
                Discover{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4f46e5] to-[#0ea5e9]">
                  Premium
                </span>{" "}
                Products You'll Love
              </h1>
              <p className="text-lg text-[#64748b] mb-8 leading-relaxed max-w-lg">
                Curated collections across electronics, fashion, home, and more.
                Quality guaranteed, delivered to your door.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors shadow-md shadow-[#4f46e5]/25"
                >
                  Shop Now
                </Link>
              </div>

              {/* <div className="flex items-center gap-6 mt-8 text-sm text-[#64748b]">
                {[["50K+", "Happy Customers"], ["4.9★", "Average Rating"], ["Free", "Shipping Over $50"]].map(([v, l]) =>
                <div key={l} className="flex flex-col">
                    <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a] text-base">{v}</span>
                    <span className="text-xs">{l}</span>
                  </div>
                )}
              </div> */}
            </div>
            <div className="relative lg:flex justify-end hidden">
              <div className="relative w-full max-w-md">
                <div className="grid grid-cols-2 gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=280&h=320&fit=crop&auto=format"
                    alt="Watch"
                    className="rounded-2xl object-cover w-full h-48 shadow-xl mt-8"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=280&h=320&fit=crop&auto=format"
                    alt="Headphones"
                    className="rounded-2xl object-cover w-full h-48 shadow-xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=280&h=200&fit=crop&auto=format"
                    alt="Shoes"
                    className="rounded-2xl object-cover w-full h-36 shadow-xl"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=280&h=200&fit=crop&auto=format"
                    alt="Fashion"
                    className="rounded-2xl object-cover w-full h-36 shadow-xl mt-4"
                  />
                </div>
                {/* Floating badge */}
                {/*                 
                <div className="absolute -left-6 bottom-16 bg-white rounded-2xl shadow-xl p-3 border border-[#e2e8f0]">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#d1fae5] rounded-xl flex items-center justify-center">
                      <span className="text-lg">🎁</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#64748b]">Flash Deal</p>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-sm font-bold text-[#0f172a]">Up to 40% off</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#0f172a]"
            >
              Shop by Category
            </h2>
            <p className="text-[#64748b] mt-1 text-sm">
              Explore our curated collections
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group block"
              >
                <div className="relative rounded-2xl overflow-hidden bg-[#f8fafc] border border-[#e2e8f0] aspect-square group-hover:border-[#c7d2fe] group-hover:shadow-md transition-all">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-lg">{cat.icon}</p>
                    <p
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      className="text-xs font-semibold text-white"
                    >
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-white/70">{count} items</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#0f172a]"
            >
              Featured Products
            </h2>
            <p className="text-[#64748b] mt-1 text-sm">
              Handpicked by our team
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-[#4f46e5] hover:text-[#4338ca] transition-colors hidden sm:block"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Deals Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] p-8 sm:p-12">
          <div className="absolute right-0 top-0 bottom-0 w-64 hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=400&fit=crop&auto=format"
              alt="Deals"
              className="h-full w-full object-cover opacity-30"
            />
          </div>
          <div className="relative max-w-lg">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Limited Time
            </span>
            <h2
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-3xl sm:text-4xl font-extrabold text-white mb-3"
            >
              Up to 40% off
              <br />
              Today's Deals
            </h2>
            <p className="text-white/80 mb-6">
              Don't miss out on our biggest sale of the season. Exclusive
              discounts on top brands.
            </p>
            <Link
              to="/shop?filter=sale"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4f46e5] font-semibold rounded-xl hover:bg-[#f8fafc] transition-colors shadow-lg"
            >
              Shop Deals <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-2xl sm:text-3xl font-bold text-[#0f172a]"
              >
                Trending Now
              </h2>
              <p className="text-[#64748b] mt-1 text-sm">
                What everyone's buying
              </p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-medium text-[#4f46e5] hover:text-[#4338ca] transition-colors hidden sm:block"
            >
              See more →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(5, 9).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-3xl mb-4 block">📬</span>
          <h2
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-3"
          >
            Get Exclusive Offers
          </h2>
          <p className="text-[#64748b] mb-6">
            Subscribe to our newsletter and be the first to know about new
            arrivals, deals, and more.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert(`Thanks! We'll be in touch at ${email}`);
              setEmail("");
            }}
            className="flex gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#4f46e5] transition-colors"
              required
            />

            <button
              type="submit"
              className="px-5 py-3 cursor-pointer bg-[#4f46e5] text-white text-sm font-semibold rounded-xl hover:bg-[#4338ca] transition-colors flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-[#94a3b8] mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
