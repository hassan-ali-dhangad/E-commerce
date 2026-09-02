import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, RefreshCw, ShoppingBag } from "lucide-react";
import { verifyEmail, resendOTP } from "../services/authService";
import { useAuth } from "../context/AuthContext";
const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { setUser } = useAuth();

  const email = location.state?.email || "your email address";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      setError("");
      document.getElementById("otp-5")?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (!email || email === "your email address") {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await verifyEmail(email, code);

   if (data.success) {
    setUser(data.user);

    const redirectTo =
      location.state?.from?.pathname ||
      "/admin/dashboard";

    navigate(redirectTo, {
      replace: true,
    });
  }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || email === "your email address") {
      setError("Email address is missing. Please sign up again.");
      return;
    }

    try {
      setResending(true);
      setError("");
      setMessage("");

      const data = await resendOTP(email);

      if (data.success) {
        setMessage(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShoppingBag size={21} />
          </div>

          <span className="text-xl font-bold text-slate-900">ShopSphere</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <Mail size={25} />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Verify your email
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We sent a 6-digit verification code to
            </p>

            <p className="mt-1 break-all text-sm font-semibold text-slate-700">
              {email}
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7">
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  maxLength={1}
                  value={digit}
                  onPaste={handlePaste}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="h-12 w-11 rounded-lg border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:h-14 sm:w-12"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">Didn't receive the code?</p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={resending ? "animate-spin" : ""}
              />

              {resending ? "Sending..." : "Resend code"}
            </button>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-5 text-center">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={15} />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
