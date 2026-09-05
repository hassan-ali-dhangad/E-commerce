import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Trash2, AlertTriangle, X } from "lucide-react";

import { changePassword, deleteAccount } from "../services/authService";

const Settings = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const data = await changePassword(
        currentPassword,
        newPassword,
        confirmNewPassword,
      );

      setMessage(data.message || "Password changed successfully.");

      // Clear inputs

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // DELETE ACCOUNT
  // ========================================

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);

      await deleteAccount();

      // Redirect after account deletion

      navigate("/admin/login");
    } catch (error) {
      setError(error.message);

      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-full">
      {/* ================================ */}
      {/* HEADER */}
      {/* ================================ */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* ================================ */}
        {/* SUCCESS MESSAGE */}
        {/* ================================ */}

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ================================ */}
        {/* ERROR MESSAGE */}
        {/* ================================ */}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================================ */}
        {/* ADMIN SECURITY */}
        {/* ================================ */}

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <SectionHeader
            icon={<Lock size={18} />}
            title="Admin Security"
            description="Manage your account security."
          />

          <form onSubmit={handleChangePassword} className="mt-6">
            <div className="space-y-5">
              {/* CURRENT PASSWORD */}

              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              {/* NEW PASSWORD */}

              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* CONFIRM PASSWORD */}

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            {/* UPDATE BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        {/* ================================ */}
        {/* DANGER ZONE */}
        {/* ================================ */}

        <section className="rounded-xl border border-red-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
              <Trash2 size={18} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-red-600">
                Danger Zone
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                This action can permanently affect your account.
              </p>
            </div>
          </div>

          {/* DELETE ACCOUNT */}

          <div className="mt-5 flex flex-col justify-between gap-4 rounded-lg border border-red-100 p-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Delete admin account
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Permanently remove this account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* ================================ */}
      {/* DELETE MODAL */}
      {/* ================================ */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* CLOSE BUTTON */}

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Delete Account?
                  </h2>

                  <p className="text-sm text-slate-500">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* WARNING */}

            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
              <p className="text-sm text-red-700">
                Your account will be permanently deleted. You will no longer be
                able to access the ShopSphere admin dashboard.
              </p>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ======================================== */
/* SECTION HEADER */
/* ======================================== */

const SectionHeader = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>

        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
    </div>
  );
};

/* ======================================== */
/* INPUT */
/* ======================================== */

const Input = ({ label, type = "text", placeholder, value, onChange }) => {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export default Settings;
