import { ArrowLeft, Check, Shield, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPages } from "../services/pageService";
import { createRole } from "../services/roleService";

const CreateRole = () => {
  const navigate = useNavigate();

  const [pages, setPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {},
  });

  // =====================================================
  // LOAD REAL PAGES FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadPages = async () => {
      try {
        setLoadingPages(true);

        const response = await getPages();

        const pageList = response.pages || response.data || response;

        setPages(Array.isArray(pageList) ? pageList : []);
      } catch (error) {
        console.error("Failed to load pages:", error);
        setError(error.message || "Failed to load pages");
      } finally {
        setLoadingPages(false);
      }
    };

    loadPages();
  }, []);

  // =====================================================
  // FORM
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
      current.create &&
      current.read &&
      current.update &&
      current.delete;

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

      await createRole({
        name: formData.name.trim(),
        description: formData.description.trim(),
        permissions,
        status: "active",
      });

      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to create role:", error);
      setError(error.message || "Failed to create role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/users")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create Role
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a system role and assign page permissions.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Role Information */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Shield size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Role Information
                </h2>

                <p className="text-xs text-slate-500">
                  Define the role details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
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

        {/* Permissions */}
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Page Permissions
              </h2>

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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Page
                    </th>

                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Read
                    </th>

                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Create
                    </th>

                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Update
                    </th>

                    <th className="px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      Delete
                    </th>

                    <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      All
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pages.map((page) => {
                    const permissions =
                      formData.permissions[page._id] || {};

                    return (
                      <tr
                        key={page._id}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {page.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {page.description}
                            </p>
                          </div>
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
                                  togglePermission(
                                    page._id,
                                    action,
                                  )
                                }
                              />
                            </td>
                          ),
                        )}

                        <td className="px-6 py-4 text-center">
                          <PermissionCheckbox
                            checked={
                              permissions.create &&
                              permissions.read &&
                              permissions.update &&
                              permissions.delete
                            }
                            onChange={() =>
                              toggleAllForPage(page._id)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingPages}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={17} />

              {saving ? "Creating..." : "Create Role"}
            </button>
          </div>
        </div>
      </form>
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

export default CreateRole;