import { Check, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getPages } from "../../services/pageService";
import { createRole, updateRole } from "../../services/roleService";

const RoleModal = ({ isOpen, onClose, onSuccess, role = null }) => {
  const isEditMode = Boolean(role);

  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {},
  });

  // =====================================================
  // LOAD ROLE DATA WHEN EDITING
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    if (role) {
      const permissionMap = {};

      if (Array.isArray(role.permissions)) {
        role.permissions.forEach((permission) => {
          const pageId = permission.page_id?._id || permission.page_id;

          if (!pageId) return;

          permissionMap[pageId] = {
            create: Boolean(permission.actions?.create),
            read: Boolean(permission.actions?.read),
            update: Boolean(permission.actions?.update),
            delete: Boolean(permission.actions?.delete),
          };
        });
      }

      setFormData({
        name: role.name || "",
        description: role.description || "",
        permissions: permissionMap,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: {},
      });
    }

    setError("");
  }, [isOpen, role]);

  // =====================================================
  // LOAD PAGES
  // =====================================================

  useEffect(() => {
    if (!isOpen) return;

    const loadPages = async () => {
      try {
        setLoadingPages(true);
        setError("");

        const response = await getPages();

        const pageList = response?.pages || response?.data || response;

        setPages(Array.isArray(pageList) ? pageList : []);
      } catch (error) {
        console.error("Failed to load pages:", error);

        setError(error.message || "Failed to load pages.");
      } finally {
        setLoadingPages(false);
      }
    };

    loadPages();
  }, [isOpen]);

  // =====================================================
  // CLOSE
  // =====================================================

  const handleClose = () => {
    if (saving) return;

    setError("");

    setFormData({
      name: "",
      description: "",
      permissions: {},
    });

    onClose();
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // PERMISSION CHANGE
  // =====================================================

  const togglePermission = (pageId, action) => {
    setFormData((previous) => ({
      ...previous,

      permissions: {
        ...previous.permissions,

        [pageId]: {
          ...(previous.permissions[pageId] || {}),

          [action]: !previous.permissions[pageId]?.[action],
        },
      },
    }));
  };

  // =====================================================
  // SELECT ALL FOR PAGE
  // =====================================================

  const toggleAllForPage = (pageId) => {
    const current = formData.permissions[pageId] || {};

    const allSelected =
      current.create && current.read && current.update && current.delete;

    setFormData((previous) => ({
      ...previous,

      permissions: {
        ...previous.permissions,

        [pageId]: {
          create: !allSelected,
          read: !allSelected,
          update: !allSelected,
          delete: !allSelected,
        },
      },
    }));
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const selectAllPermissions = () => {
    const permissions = {};

    pages.forEach((page) => {
      permissions[page._id] = {
        create: true,
        read: true,
        update: true,
        delete: true,
      };
    });

    setFormData((previous) => ({
      ...previous,
      permissions,
    }));
  };

  // =====================================================
  // CLEAR ALL
  // =====================================================

  const clearAllPermissions = () => {
    setFormData((previous) => ({
      ...previous,
      permissions: {},
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Role name is required.");
      return;
    }

    try {
      setSaving(true);

      const permissions = Object.entries(formData.permissions).map(
        ([pageId, actions]) => ({
          page_id: pageId,

          actions: {
            create: Boolean(actions.create),
            read: Boolean(actions.read),
            update: Boolean(actions.update),
            delete: Boolean(actions.delete),
          },
        }),
      );

      const roleData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions,
        status: "active",
      };

      // =================================================
      // CREATE
      // =================================================

      if (!isEditMode) {
        await createRole(roleData);
        toast.success("Role created successfully.");
      }

      // =================================================
      // UPDATE
      // =================================================
      else {
        await updateRole(role._id, roleData);
        toast.success("Role updated successfully.");
      }

      onSuccess?.();

      handleClose();
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} role:`,
        error,
      );

      setError(
        error.message || `Failed to ${isEditMode ? "update" : "create"} role.`,
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DON'T RENDER WHEN CLOSED
  // =====================================================

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          handleClose();
        }
      }}
    >
      {/* MODAL */}

      <div
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Shield size={20} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditMode ? "Edit Role" : "Create Role"}
              </h2>

              <p className="text-xs text-slate-500">
                {isEditMode
                  ? "Update role details and permissions."
                  : "Create a role and assign page permissions."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            BODY
        ================================================= */}

        <div className="flex-1 overflow-y-auto p-6">
          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* =================================================
              ROLE INFORMATION
          ================================================= */}

          <div className="mb-6 rounded-xl border border-slate-200">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-slate-900">
                Role Information
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Define the role details.
              </p>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Role Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Manager"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this role"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              PERMISSIONS
          ================================================= */}

          <div className="rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Page Permissions
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Choose what this role can do on each page.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllPermissions}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={clearAllPermissions}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Clear All
                </button>
              </div>
            </div>

            {loadingPages ? (
              <div className="flex items-center justify-center px-6 py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
              </div>
            ) : pages.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                No pages found.
              </div>
            ) : (
              <div className="max-h-[350px] overflow-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Page
                      </th>

                      {["Read", "Create", "Update", "Delete", "All"].map(
                        (action) => (
                          <th
                            key={action}
                            className="px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400"
                          >
                            {action}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {pages.map((page) => {
                      const permissions = formData.permissions[page._id] || {};

                      const allSelected =
                        permissions.create &&
                        permissions.read &&
                        permissions.update &&
                        permissions.delete;

                      return (
                        <tr
                          key={page._id}
                          className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-800">
                              {page.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {page.description}
                            </p>
                          </td>

                          {["read", "create", "update", "delete"].map(
                            (action) => (
                              <td
                                key={action}
                                className="px-4 py-4 text-center"
                              >
                                <PermissionCheckbox
                                  checked={Boolean(permissions[action])}
                                  onChange={() =>
                                    togglePermission(page._id, action)
                                  }
                                />
                              </td>
                            ),
                          )}

                          <td className="px-4 py-4 text-center">
                            <PermissionCheckbox
                              checked={Boolean(allSelected)}
                              onChange={() => toggleAllForPage(page._id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving || loadingPages}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check size={17} />

            {saving
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Role"
                : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// PERMISSION CHECKBOX
// =====================================================

const PermissionCheckbox = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`mx-auto flex h-5 w-5 items-center justify-center rounded border transition ${
        checked
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-slate-300 bg-white hover:border-indigo-400"
      }`}
    >
      {checked && <Check size={13} strokeWidth={3} />}
    </button>
  );
};

export default RoleModal;
