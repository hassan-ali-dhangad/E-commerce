import {
  Edit,
  Folder,
  Plus,
  Search,
  Trash2,
  Loader2,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  getCategories,
  deleteCategory,
} from "../services/categoryService";

import CategoryModal from "../components/categories/CategoryModal";
import toast from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCategory, setSelectedCategory] =
    useState(null);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  // ========================================
  // LOAD CATEGORIES
  // ========================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCategories();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Load categories error:", error);

      setError(
        error.message || "Failed to load categories",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ========================================
  // CREATE
  // ========================================

  const handleCreate = () => {
    setSelectedCategory(null);
    setModalMode("create");
    setIsModalOpen(true);
    setError("");
  };

  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalMode("edit");
    setIsModalOpen(true);
    setError("");
  };

  // ========================================
  // MODAL SUCCESS
  // ========================================

  const handleModalSuccess = async () => {
    await loadCategories();
  };

  // ========================================
  // DELETE MODAL
  // ========================================

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
    setError("");
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // ========================================
  // DELETE
  // ========================================

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      setError("");

      const data = await deleteCategory(
        categoryToDelete.id,
      );

      if (data.success) {
        setCategories((prev) =>
          prev.filter(
            (category) =>
              category.id !== categoryToDelete.id,
          ),
        );
      toast.success("Category deleted successfully.");

        closeDeleteModal();
      }
    } catch (error) {
      console.error("Delete category error:", error);

      setError(
        error.message || "Failed to delete category",
      );

      closeDeleteModal();
    } finally {
      setDeleting(false);
    }
  };

  // ========================================
  // SEARCH
  // ========================================

  const filtered = categories.filter((category) =>
    category.name
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize your products into categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {error && (
        <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-4 text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ========================================
          SEARCH
      ======================================== */}

      <div className="mb-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search
          size={18}
          className="text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="flex-1 text-sm outline-none"
        />
      </div>

      {/* ========================================
          LOADING
      ======================================== */}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="h-40 animate-pulse bg-slate-200" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

                <div className="h-8 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* ========================================
            EMPTY
        ======================================== */

        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
          <Folder
            size={40}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No categories found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {search
              ? "Try a different search term."
              : "Create your first category."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={handleCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={17} />
              Add Category
            </button>
          )}
        </div>
      ) : (
        /* ========================================
            CATEGORIES
        ======================================== */

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((category) => (
            <div
              key={category.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative h-40 bg-slate-100">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Folder
                      size={45}
                      className="text-slate-300"
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="font-semibold text-slate-900">
                  {category.name}
                </h2>

                {category.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {category.description}
                  </p>
                )}

                {/* Product count */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Folder size={15} />

                    {category.count ?? 0} products
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(category)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <Edit size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openDeleteModal(category)
                    }
                    className="flex h-10 w-9 items-center justify-center rounded-lg border border-slate-200 text-red-500 transition hover:bg-red-50"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================
          CATEGORY CREATE / EDIT MODAL
      ======================================== */}

      <CategoryModal
        isOpen={isModalOpen}
        mode={modalMode}
        category={selectedCategory}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* ========================================
          DELETE CONFIRMATION MODAL
      ======================================== */}

      {deleteModalOpen && categoryToDelete && (
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
              <Trash2
                size={22}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Delete category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{categoryToDelete.name}"
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
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;