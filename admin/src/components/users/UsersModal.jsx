import { Loader2, Save, UserPlus, X, Eye, EyeOff } from "lucide-react";

import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { signup, updateUser } from "../../services/userService";

import { getRoles } from "../../services/roleService";

const UsersModal = ({
  isOpen,
  mode = "create",
  user = null,
  onClose,
  onSuccess,
}) => {
  // =====================================================
  // MODE
  // =====================================================

  const isEdit = mode === "edit";

  // =====================================================
  // FORM STATE
  // =====================================================

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  // =====================================================
  // ROLE STATE
  // =====================================================

  const [roles, setRoles] = useState([]);

  const [roleId, setRoleId] = useState("");

  const [loadingRoles, setLoadingRoles] = useState(false);

  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =====================================================
  // REQUEST STATE
  // =====================================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD ROLES
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    const loadRoles = async () => {
      try {
        setLoadingRoles(true);

        const response = await getRoles();

        const roleData = Array.isArray(response)
          ? response
          : response.roles || response.data || [];

        // Only active roles
        const activeRoles = Array.isArray(roleData)
          ? roleData.filter(
              (role) => !role.status || role.status.toLowerCase() === "active",
            )
          : [];

        setRoles(activeRoles);
      } catch (err) {
        console.error("Failed to load roles:", err);

        setRoles([]);

        toast.error(err.message || "Failed to load roles.");
      } finally {
        setLoadingRoles(false);
      }
    };

    loadRoles();
  }, [isOpen]);

  // =====================================================
  // LOAD USER DATA
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    // EDIT MODE
    if (isEdit && user) {
      setName(user.name || "");

      setEmail(user.email || "");

      // Supports populated role_id:
      //
      // role_id: {
      //   _id: "...",
      //   name: "Admin"
      // }
      //
      // Or plain ObjectId:
      //
      // role_id: "..."

      const selectedRoleId =
        user.role_id && typeof user.role_id === "object"
          ? user.role_id._id || ""
          : user.role_id || "";

      setRoleId(selectedRoleId);

      setPassword("");

      setConfirmPassword("");
    }

    // CREATE MODE
    else {
      setName("");

      setEmail("");

      setPassword("");

      setConfirmPassword("");

      setRoleId("");
    }

    setShowPassword(false);

    setShowConfirmPassword(false);

    setError("");

    setLoading(false);
  }, [isOpen, isEdit, user]);

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (loading) return;

    setName("");

    setEmail("");

    setPassword("");

    setConfirmPassword("");

    setRoleId("");

    setShowPassword(false);

    setShowConfirmPassword(false);

    setError("");

    onClose();
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ===============================================
    // NAME VALIDATION
    // ===============================================

    if (!name.trim()) {
      toast.error("User name is required.");

      return;
    }

    // ===============================================
    // EMAIL VALIDATION
    // ===============================================

    if (!email.trim()) {
      toast.error("User email is required.");

      return;
    }

    // ===============================================
    // ROLE VALIDATION
    // ===============================================

    if (!roleId) {
      toast.error("Please select a role.");

      return;
    }

    // ===============================================
    // PASSWORD VALIDATION
    // CREATE ONLY
    // ===============================================

    if (!isEdit) {
      if (!password) {
        toast.error("Password is required.");

        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.");

        return;
      }

      if (!confirmPassword) {
        toast.error("Please confirm the password.");

        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");

        return;
      }
    }

    try {
      setLoading(true);

      // =============================================
      // CREATE USER
      // =============================================

      if (!isEdit) {
        const result = await signup({
          name: name.trim(),

          email: email.trim().toLowerCase(),

          password,

          confirmPassword,

          // IMPORTANT
          role_id: roleId,
        });

        toast.success(result.message || "User created successfully.");

        await onSuccess?.(result);

        handleClose();

        return;
      }

      // =============================================
      // UPDATE USER
      // =============================================

      const userId = user?._id || user?.id;

      if (!userId) {
        throw new Error("User ID is missing.");
      }

      const result = await updateUser(userId, {
        name: name.trim(),

        email: email.trim().toLowerCase(),

        // IMPORTANT
        role_id: roleId,
      });

      toast.success(result.message || "User updated successfully.");

      await onSuccess?.(result);

      handleClose();
    } catch (err) {
      console.error("User form error:", err);

      const message = err?.message || "Failed to save user.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DON'T RENDER
  // =====================================================

  if (!isOpen) return null;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UserPlus size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEdit ? "Edit User" : "Create User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isEdit
                  ? "Update user information and role."
                  : "Create a new system user account."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-6">
            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* =================================================
                  NAME
              ================================================= */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hassan Ali"
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                />
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Email Address *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                />
              </div>

              {/* =================================================
                  PASSWORD
                  CREATE ONLY
              ================================================= */}

              {!isEdit && (
                <>
                  {/* PASSWORD */}

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Password *
                    </label>

                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        disabled={loading}
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Confirm Password *
                    </label>

                    <div className="relative mt-2">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        disabled={loading}
                        className="h-11 w-full rounded-lg border border-slate-200 px-3 pr-10 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* =================================================
                  ROLE
              ================================================= */}

              <div className={isEdit ? "" : "md:col-span-2"}>
                <label className="text-sm font-medium text-slate-700">
                  Role *
                </label>

                <select
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  disabled={loading || loadingRoles}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                >
                  <option value="">
                    {loadingRoles ? "Loading roles..." : "Select a role"}
                  </option>

                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                {!loadingRoles && roles.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">
                    No active roles available. Please create a role first.
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                VERIFICATION INFORMATION
            ================================================= */}

            {!isEdit && (
              <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
                <p className="text-sm font-medium text-indigo-800">
                  Email verification required
                </p>

                <p className="mt-1 text-xs leading-5 text-indigo-600">
                  After creating this user, a verification OTP will be sent to
                  their email address. They must verify their email before they
                  can log in.
                </p>
              </div>
            )}
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            {/* CANCEL */}

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading || loadingRoles}
              className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />

                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : isEdit ? (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersModal;
