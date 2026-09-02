import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getCategoryById,
  updateCategory,
} from "../services/categoryService";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // LOAD CATEGORY
  // ========================================

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCategoryById(id);

        if (data.success) {
          const category = data.category;

          setName(category.name || "");
          setDescription(category.description || "");
          setImagePreview(category.image || "");
        }
      } catch (error) {
        console.error("Load category error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCategory();
    }
  }, [id]);

  // ========================================
  // IMAGE CHANGE
  // ========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    // Remove old blob URL
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setError("");
  };

  // ========================================
  // REMOVE IMAGE
  // ========================================

  const removeImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!name.trim()) {
        setError("Category name is required.");
        return;
      }

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());

      // Only send image if user selected a NEW image
      if (image) {
        formData.append("image", image);
      }

      const data = await updateCategory(id, formData);

      if (data.success) {
        setSuccess("Category updated successfully.");

        // Small delay so user sees success
        setTimeout(() => {
          navigate("/admin/categories");
        }, 800);
      }
    } catch (error) {
      console.error("Update category error:", error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 size={20} className="animate-spin" />
          Loading category...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Back */}
      <Link
        to="/admin/categories"
        className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft size={16} />
        Back to Categories
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Edit Category
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update category information and details.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Category Information */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Category Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics"
                required
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description..."
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Category Image */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-700">
              Category Image
            </h2>

            <div className="mt-4">
              {!imagePreview ? (
                <label className="flex h-90 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition hover:border-indigo-400 hover:bg-slate-50">
                  <ImagePlus
                    size={32}
                    className="text-slate-400"
                  />

                  <span className="mt-3 text-sm font-medium text-slate-600">
                    Upload Image
                  </span>

                  <span className="mt-1 text-xs text-slate-400">
                    PNG, JPG, WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative h-90 w-full overflow-hidden rounded-xl border border-slate-200">
                  <img
                    src={imagePreview}
                    alt={name || "Category preview"}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 shadow-md transition hover:bg-white hover:text-red-600"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Link
              to="/admin/categories"
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;