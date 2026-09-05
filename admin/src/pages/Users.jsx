import {
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users as UsersIcon,
  UserStar,
  UserKey,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import UsersModal from "../components/users/UsersModal";

import { getUsers, deleteUser } from "../services/userService";

import { getRoles } from "../services/roleService";

const Users = () => {
  // =====================================================
  // STATE
  // =====================================================

  const [users, setUsers] = useState([]);

  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  // =====================================================
  // CREATE / EDIT MODAL
  // =====================================================

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState("create");

  const [selectedUser, setSelectedUser] = useState(null);

  // =====================================================
  // DELETE
  // =====================================================

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [userToDelete, setUserToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // GET ROLE NAME
  // =====================================================

  const getRoleName = (user) => {
    if (!user) return "No Role";

    // If role_id is populated
    if (user.role_id && typeof user.role_id === "object") {
      return user.role_id.name || "No Role";
    }

    // Fallback for old data
    if (user.role) {
      return user.role;
    }

    return "No Role";
  };

  // =====================================================
  // GET ROLE ID
  // =====================================================

  const getRoleId = (user) => {
    if (!user) return "";

    if (user.role_id && typeof user.role_id === "object") {
      return user.role_id._id || "";
    }

    return user.role_id || "";
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getUsers();

      const fetchedUsers = Array.isArray(data)
        ? data
        : data.users || data.data || [];

      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    } catch (err) {
      console.error("Get users error:", err);

      const message = err.message || "Failed to load users.";

      setError(message);

      toast.error(message);

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH ROLES
  // =====================================================

  const fetchRoles = async () => {
    try {
      const response = await getRoles();

      const fetchedRoles = Array.isArray(response)
        ? response
        : response.roles || response.data || [];

      setRoles(Array.isArray(fetchedRoles) ? fetchedRoles : []);
    } catch (err) {
      console.error("Failed to load roles:", err);

      setRoles([]);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchUsers();

    fetchRoles();
  }, []);

  // =====================================================
  // CREATE
  // =====================================================

  const handleCreate = () => {
    setSelectedUser(null);

    setModalMode("create");

    setIsModalOpen(true);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (user) => {
    setSelectedUser(user);

    setModalMode("edit");

    setIsModalOpen(true);
  };

  // =====================================================
  // DELETE MODAL
  // =====================================================

  const openDeleteModal = (user) => {
    setUserToDelete(user);

    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteModalOpen(false);

    setUserToDelete(null);
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async () => {
    if (!userToDelete) return;

    const id = userToDelete._id || userToDelete.id;

    if (!id) {
      toast.error("User ID is missing.");

      return;
    }

    try {
      setDeleting(true);

      await deleteUser(id);

      setUsers((prev) => prev.filter((user) => (user._id || user.id) !== id));

      toast.success("User deleted successfully.");

      setDeleteModalOpen(false);

      setUserToDelete(null);
    } catch (err) {
      console.error("Delete user error:", err);

      toast.error(err.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // MODAL SUCCESS
  // =====================================================

  const handleModalSuccess = async () => {
    await fetchUsers();

    await fetchRoles();
  };

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const name = user.name || "";

      const email = user.email || "";

      const roleName = getRoleName(user);

      const roleId = getRoleId(user);

      // SEARCH
      const matchesSearch =
        !searchValue ||
        name.toLowerCase().includes(searchValue) ||
        email.toLowerCase().includes(searchValue) ||
        roleName.toLowerCase().includes(searchValue);

      // ROLE FILTER
      const matchesRole = roleFilter === "All" || roleId === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) return "US";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================================
  // ADMIN COUNT
  // =====================================================

  const adminCount = users.filter((user) =>
    getRoleName(user).toLowerCase().includes("admin"),
  ).length;

  // =====================================================
  // CUSTOMER COUNT
  // =====================================================

  const customerCount = users.filter((user) =>
    getRoleName(user).toLowerCase().includes("customer"),
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage system users and roles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {/* TOTAL */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UsersIcon size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Total Users</p>

              <p className="text-xl font-bold text-slate-900">{users.length}</p>
            </div>
          </div>
        </div>

        {/* ADMINS */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <UserKey size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Admins</p>

              <p className="text-xl font-bold text-slate-900">{adminCount}</p>
            </div>
          </div>
        </div>

        {/* CUSTOMERS */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UserStar size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Customers</p>

              <p className="text-xl font-bold text-slate-900">
                {customerCount}
              </p>
            </div>
          </div>
        </div>

        {/* VERIFIED */}

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <UserCheck size={20} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Verified Users
              </p>

              <p className="text-xl font-bold text-slate-900">
                {users.filter((user) => user.isVerified === true).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          USERS CARD
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}

          <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search users by name, email or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          {/* ROLE FILTER */}

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value="All">All Roles</option>

            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 size={20} className="animate-spin" />
              Loading users...
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              {/* =================================================
                  HEADER
              ================================================= */}

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    User
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Email
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Role
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Verification
                  </th>

                  <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* =================================================
                  BODY
              ================================================= */}

              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <UsersIcon size={35} className="text-slate-300" />

                        <p className="mt-3 text-sm font-medium text-slate-600">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const userId = user._id || user.id;

                    const initials = getInitials(user.name);

                    const isVerified = user.isVerified === true;

                    const roleName = getRoleName(user);

                    const isAdmin = roleName.toLowerCase().includes("admin");

                    return (
                      <tr
                        key={userId}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                      >
                        {/* USER */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                              {initials}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {user.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                User
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* EMAIL */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {user.email}
                        </td>

                        {/* ROLE */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              isAdmin
                                ? "bg-purple-50 text-purple-600"
                                : "bg-indigo-50 text-indigo-600"
                            }`}
                          >
                            {roleName}
                          </span>
                        </td>

                        {/* VERIFICATION */}

                        <td className="px-5 py-4">
                          {isVerified ? (
                            <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-600">
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => handleEdit(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() => openDeleteModal(user)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

      <UsersModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {deleteModalOpen && userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            {/* ICON */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-500" />
            </div>

            {/* TITLE */}

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Delete user?
            </h2>

            {/* MESSAGE */}

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{userToDelete.name}"
              </span>
              ?
            </p>

            {/* BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}

                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
