import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },

    // { label: "Deals", to: "/shop?filter=sale" },
    //   { label: "About", to: "#" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0]"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            {/* Added overflow-hidden to clip the image inside */}
            <div className="w-8 h-8 bg-[#4f46e5] rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src="/logo1.png"
                alt="ShopSphere Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-xl font-bold text-[#0f172a] tracking-tight"
            >
              Shop<span className="text-[#4f46e5]">Sphere</span>
            </span>
          </Link>

          {/* Search bar — desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#e2e8f0] bg-[#f8fafc] focus:bg-white focus:border-[#4f46e5] focus:outline-none transition-all"
              />

              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Nav links — desktop */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-[#4f46e5]"
                    : "text-[#334155] hover:text-[#4f46e5]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
         

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex w-9 h-9 items-center justify-center rounded-xl hover:bg-[#f1f5f9] transition-colors text-[#334155] hover:text-[#4f46e5]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#4f46e5] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
                  style={{ width: 18, height: 18 }}
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to="/dashboard"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-[#f1f5f9] transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&auto=format"
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover"
              />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#f1f5f9] transition-colors text-[#334155]"
            >
              {mobileOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-[#f1f5f9] mt-0 pt-3 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-[#e2e8f0] bg-[#f8fafc] focus:outline-none focus:border-[#4f46e5]"
                />

                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-lg text-[#334155] hover:bg-[#f1f5f9] hover:text-[#4f46e5] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-[#334155] hover:bg-[#f1f5f9]"
            >
              My Account
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-lg text-[#334155] hover:bg-[#f1f5f9]"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
