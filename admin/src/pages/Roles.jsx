import { Edit, Plus, Search, Shield, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getRoles, deleteRole } from "../services/roleService";

import RoleModal from "../components/roles/RoleModal";

const Roles = () => {
  const [roles, setRoles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All Status");

  // =====================================================
  // ROLE MODAL
  // =====================================================

  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);

  // =====================================================
  // DELETE MODAL
  // =====================================================

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================================
  // LOAD ROLES
  // =====================================================

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRoles();

      const roleData = Array.isArray(response)
        ? response
        : response?.roles || response?.data || [];

      setRoles(Array.isArray(roleData) ? roleData : []);
    } catch (error) {
      console.error("Failed to load roles:", error);

      setError(error.message || "Failed to load roles.");

      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        role.name?.toLowerCase().includes(searchValue) ||
        role.description?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        role.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [roles, search, statusFilter]);

  // =====================================================
  // PERMISSION COUNT
  // =====================================================

  const getPermissionCount = (role) => {
    if (!Array.isArray(role.permissions)) {
      return 0;
    }

    return role.permissions.length;
  };

  // =====================================================
  // CREATE ROLE
  // =====================================================

  const handleCreateRole = () => {
    setSelectedRole(null);
    setRoleModalOpen(true);
  };

  // =====================================================
  // EDIT ROLE
  // =====================================================

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setRoleModalOpen(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleCloseModal = () => {
    if (deleting) return;

    setRoleModalOpen(false);
    setSelectedRole(null);
  };

  // =====================================================
  // ROLE CREATED / UPDATED
  // =====================================================

  const handleRoleSuccess = async () => {
    await loadRoles();
  };

  // =====================================================
  // DELETE MODAL HANDLERS
  // =====================================================

  const openDeleteModal = (role) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
    setError("");
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      setDeleting(true);
      setError("");

      await deleteRole(roleToDelete._id);
      toast.success(`Role "${roleToDelete.name}" deleted successfully.`);

      closeDeleteModal();
      await loadRoles();
    } catch (error) {
      console.error("Failed to delete role:", error);

      setError(error.message || "Failed to delete role.");

      closeDeleteModal();
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <div className="min-h-full bg-slate-50 p-6">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Roles</h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage system roles and page permissions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateRole}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            Add Role
          </button>
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* SEARCH */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-[450px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search roles by name or description..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          {/* ERROR */}
          {error && (
            <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* LOADING */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Shield size={22} />
              </div>

              <h3 className="text-sm font-semibold text-slate-800">
                No roles found
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {search
                  ? "Try changing your search."
                  : "Create your first system role."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Role
                    </th>
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Description
                    </th>
                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Permissions
                    </th>
                    <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRoles.map((role) => (
                    <tr
                      key={role._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                    >
                      {/* ROLE */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Shield size={18} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {role.name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              System Role
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="px-5 py-4">
                        <p className="max-w-[350px] truncate text-sm text-slate-500">
                          {role.description || "No description"}
                        </p>
                      </td>

                      {/* PERMISSIONS */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                          {getPermissionCount(role)} Pages
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            role.status?.toLowerCase() === "active"
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {role.status || "Unknown"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditRole(role)}
                            disabled={deleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Edit role"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => openDeleteModal(role)}
                            disabled={deleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Delete role"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ROLE MODAL */}
      <RoleModal
        isOpen={roleModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleRoleSuccess}
        role={selectedRole}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && roleToDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-500" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Delete role?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{roleToDelete.name}"
              </span>
              ? 
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteRole}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}

                {deleting ? "Deleting..." : "Delete Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Roles;
