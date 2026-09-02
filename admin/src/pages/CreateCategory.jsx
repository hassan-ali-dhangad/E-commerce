import { ArrowLeft, ImagePlus, Save, X } from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCategory } from "../services/categoryService";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      return;
    }

    setImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", description.trim());

    if (image) {
      formData.append("image", image);
    }

    const data = await createCategory(formData);

    console.log("Created:", data);

    if (data.success) {
      navigate("/admin/categories");
    }
  } catch (error) {
    console.error("Create category error:", error);
  }
};

  return (
    <div className="mx-auto ">
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
        <h1 className="text-2xl font-bold text-slate-900">Create Category</h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a new product category.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1  lg:grid-cols-1">
            {/* Category Information */}
            <section>
              <div className="  grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-2">
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Category description..."
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {/* Category Image */}
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-slate-700">
                Category Image
              </h2>

              <div className="mt-4">
                {!imagePreview ? (
                  <label className="flex h-90 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition hover:border-indigo-400 hover:bg-slate-50">
                    <ImagePlus size={32} className="text-slate-400" />
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
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />

              {loading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
