import {
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  createCategory,
  updateCategory,
} from "../../services/categoryService";

import toast from "react-hot-toast";

const CategoryModal = ({
  isOpen,
  mode = "create",
  category = null,
  onClose,
  onSuccess,
}) => {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [removeExistingImage, setRemoveExistingImage] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // LOAD CATEGORY DATA
  // ========================================

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setImage(null);
      setImagePreview(category.image || "");
      setRemoveExistingImage(false);
    } else {
      setName("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setRemoveExistingImage(false);
    }

    setError("");
    setLoading(false);
  }, [isOpen, isEdit, category]);

  // ========================================
  // CLOSE MODAL
  // ========================================

  const handleClose = () => {
    if (loading) return;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setName("");
    setDescription("");
    setImage(null);
    setImagePreview("");
    setRemoveExistingImage(false);
    setError("");

    onClose();
  };

  // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Optional size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    // Remove previous blob URL
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImage(file);
    setImagePreview(previewUrl);

    // User selected a new image, so don't remove it
    setRemoveExistingImage(false);

    setError("");
  };

  // ========================================
  // REMOVE IMAGE
  // ========================================

  const handleRemoveImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");

    if (isEdit && category?.image) {
      setRemoveExistingImage(true);
    }

    setError("");
  };

  // ========================================
  // SUBMIT
  // ========================================

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    toast.error("Category name is required.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());

    if (image) {
      formData.append("image", image);
    }

    if (isEdit && removeExistingImage) {
      formData.append("removeImage", "true");
    }

    let data;
    if (isEdit) {
      data = await updateCategory(category.id, formData);
    } else {
      data = await createCategory(formData);
    }

    if (data.success) {
      toast.success(
        isEdit ? "Category updated successfully." : "Category created successfully."
      );
      handleClose();
      onSuccess?.(); // Calls loadCategories in parent
    }
  } catch (err) {
    console.error("Category form error:", err);
    toast.error(err.message || "Failed to save category.");
  } finally {
    setLoading(false);
  }
};

  // ========================================
  // DON'T RENDER
  // ========================================

  if (!isOpen) return null;

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
        className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEdit ? "Edit Category" : "Create Category"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Update category information and details."
                : "Create a new product category."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================
            BODY
        ======================================== */}

        <form onSubmit={handleSubmit}>
          <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Name + Description */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label
                  htmlFor="category-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electronics"
                  disabled={loading}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="category-description"
                  className="text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <input
                  id="category-description"
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Category description..."
                  disabled={loading}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* ========================================
                IMAGE
            ======================================== */}

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Category Image
                </label>

                <span className="text-xs text-slate-400">
                  PNG, JPG, WEBP • Max 5MB
                </span>
              </div>

              {!imagePreview ? (
                <label
                  className={`flex h-88 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-400 hover:bg-indigo-50/30 ${
                    loading
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <ImagePlus
                      size={24}
                      className="text-slate-400"
                    />
                  </div>

                  <span className="mt-3 text-sm font-medium text-slate-700">
                    Upload category image
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    Click to browse your files
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <img
                    src={imagePreview}
                    alt={name || "Category preview"}
                    className="h-88 w-full object-cover"
                  />

                  {/* Remove image */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-lg transition hover:bg-white hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    <X size={17} />
                  </button>

                  {/* Change image */}
                  <label className="absolute bottom-3 left-3 cursor-pointer rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow-lg transition hover:bg-white">
                    Change image

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* ========================================
              FOOTER
          ======================================== */}

          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />

                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save size={16} />

                  {isEdit
                    ? "Save Changes"
                    : "Create Category"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;