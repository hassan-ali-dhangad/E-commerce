import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "alex.johnson@email.com",
    password: "password123",
    confirmPassword: "",
    agree: false,
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#eef2ff] via-white to-[#f0f9ff] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#4f46e5] rounded-lg overflow-hidden flex items-center justify-center">
              {/* <div className="w-8 h-8 bg-[#4f46e5] rounded-lg flex items-center justify-center"> */}
              <img
                src="/logo1.png"
                alt="ShopSphere Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              className="text-2xl font-bold text-[#0f172a]"
            >
              Shop<span className="text-[#4f46e5]">Sphere</span>
            </span>
          </Link>
          <h1
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            className="text-2xl font-bold text-[#0f172a]"
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-[#64748b] text-sm mt-1">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Join thousands of happy shoppers"}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sm:p-8 shadow-sm">
          {/* Tab toggle */}
          <div className="flex bg-[#f8fafc] rounded-xl p-1 mb-6 border border-[#e2e8f0]">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 cursor-pointer py-2 text-sm font-medium rounded-lg transition-colors capitalize ${
                  mode === m
                    ? "bg-white text-[#4f46e5] shadow-sm"
                    : "text-[#64748b] hover:text-[#334155]"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Johnson"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#334155] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-[#334155]">
                  Password
                </label>
              
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                  required
                  minLength={8}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#334155]"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Repeat your password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#4f46e5] transition-colors"
                    required
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 cursor-pointer bg-[#4f46e5] text-white font-semibold rounded-xl hover:bg-[#4338ca] transition-colors shadow-md shadow-[#4f46e5]/25"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#64748b] mt-5">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="text-[#4f46e5] font-medium hover:text-[#4338ca] cursor-pointer "
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
