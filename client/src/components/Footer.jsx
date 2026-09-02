import { Link } from "react-router-dom";

export default function Footer() {
  const fullYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-[#94a3b8]">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-[#4f46e5] rounded-lg overflow-hidden flex items-center justify-center ring-1 ring-white/10">
                <img
                  src="/logo1.png"
                  alt="ShopSphere Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                className="text-xl font-bold text-white"
              >
                Shop<span className="text-[#818cf8]">Sphere</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs text-[#94a3b8]">
              Your trusted destination for curated electronics, fashion, and
              home essentials. Quality guaranteed, delivered with care.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2.5">
              {[
                {
                  label: "Twitter",
                  href: "https://twitter.com",
                  path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  path: "M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2zm0 2A3.5 3.5 0 004 7.5v9A3.5 3.5 0 007.5 20h9a3.5 3.5 0 003.5-3.5v-9A3.5 3.5 0 0016.5 4h-9zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.25-3.25a1 1 0 110 2 1 1 0 010-2z",
                },
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  path: "M13.5 22v-8h2.7l.4-3.3h-3.1V8.6c0-.96.27-1.6 1.63-1.6h1.74V4.14C15.98 4.1 15.06 4 14 4c-2.35 0-3.96 1.44-3.96 4.08v2.62H7.3v3.3h2.74V22h3.46z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#4f46e5] hover:border-[#4f46e5] hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4 text-[#cbd5e1]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
            
          </div>

          {/* Quick Links */}
          <div>
            <div
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-xs font-semibold text-white mb-5 tracking-[0.12em] uppercase"
            >
              Quick Links
            </div>
            <ul className="space-y-3 text-sm">
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["My Account", "/dashboard"],
                ["Order History", "/orders"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="inline-block text-[#94a3b8] hover:text-white hover:translate-x-0.5 transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <div
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-xs font-semibold text-white mb-5 tracking-[0.12em] uppercase"
            >
              Customer Service
            </div>
            <ul className="space-y-3 text-sm">
              {[
                ["Contact Us", "/contact"],
                ["Shipping Info", "/shipping"],
                ["Returns & Exchanges", "/returns"],
                ["FAQs", "/faq"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="inline-block text-[#94a3b8] hover:text-white hover:translate-x-0.5 transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex justify-center">
          <p className="text-xs text-[#64748b]">
            © {fullYear} ShopSphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}