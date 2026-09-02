import { ImagePlus, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createProduct,
  updateProduct,
} from "../../services/productService";

import { getCategories } from "../../services/categoryService";

const ProductModal = ({ isOpen, mode = "create", product = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    features: "",
    tags: "",
    colors: "",
    sizes: "",
    inStock: true,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");

  // Load Categories for selection
useEffect(() => {
  if (!isOpen) return;

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Failed to load categories");
    }
  };

  fetchCategories();
}, [isOpen]);

  // Populate data for Edit mode or Reset for Create mode
  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setNewImages([]);

    if (mode === "edit" && product) {
      setFormData({
        name: product.name || "",
        category: product.category?._id || product.category || "",
        price: product.price || "",
        quantity: product.quantity ?? product.stock ?? "",
        description: product.description || "",
        features: Array.isArray(product.features) ? product.features.join("\n") : "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
        sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
        inStock: product.inStock ?? product.status === "Active",
      });

      if (product.images?.length) {
        setExistingImages(product.images);
      } else if (product.image) {
        setExistingImages([product.image]);
      } else {
        setExistingImages([]);
      }
    } else {
      setFormData({
        name: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
        features: "",
        tags: "",
        colors: "",
        sizes: "",
        inStock: true,
      });
      setExistingImages([]);
    }
  }, [isOpen, mode, product]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [newImages]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    setError("Product name is required.");
    return;
  }

  if (!formData.category) {
    setError("Please select a category.");
    return;
  }

  if (!formData.price || Number(formData.price) < 0) {
    setError("Please enter a valid price.");
    return;
  }

  if (
    !formData.quantity ||
    Number(formData.quantity) < 0
  ) {
    setError("Please enter a valid stock quantity.");
    return;
  }

  if (mode === "create" && !newImages.length) {
    setError("Please upload at least one image.");
    return;
  }

  if (
    mode === "edit" &&
    !existingImages.length &&
    !newImages.length
  ) {
    setError("Please ensure at least one image remains.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const data = new FormData();

    data.append("name", formData.name.trim());
    data.append("category", formData.category);
    data.append("price", String(Number(formData.price)));
    data.append("quantity", String(Number(formData.quantity)));
    data.append("description", formData.description.trim());
    data.append("inStock", String(formData.inStock));

    const parseList = (value) =>
      value
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

    parseList(formData.features).forEach((item) => {
      data.append("features", item);
    });

    parseList(formData.tags).forEach((item) => {
      data.append("tags", item);
    });

    parseList(formData.colors).forEach((item) => {
      data.append("colors", item);
    });

    parseList(formData.sizes).forEach((item) => {
      data.append("sizes", item);
    });

    if (mode === "create") {
      newImages.forEach((img) => {
        data.append("images", img.file);
      });
    } else {
      existingImages.forEach((url) => {
        data.append("existingImages", url);
      });

      newImages.forEach((img) => {
        data.append("images", img.file);
      });
    }

    const result =
      mode === "create"
        ? await createProduct(data)
        : await updateProduct(
            product.id || product._id,
            data,
          );

    if (!result.success) {
      throw new Error(
        result.message ||
          `Failed to ${mode} product`,
      );
    }

    toast.success(
      mode === "create"
        ? "Product created successfully!"
        : "Product updated successfully!",
    );

    await onSuccess();

    onClose();
  } catch (err) {
    console.error(
      `${mode} product error:`,
      err,
    );

    setError(
      err.message ||
        `Failed to ${mode} product`,
    );

    toast.error(
      err.message ||
        `Failed to ${mode} product`,
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="AirPods Pro Max"
                required
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="249.99"
                required
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Stock Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                required
                className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a product description..."
              required
              className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="text-sm font-medium text-slate-700">Product Images</label>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-400 hover:bg-indigo-50">
                <ImagePlus size={20} className="text-slate-400" />
                <span className="mt-1 text-[11px] font-medium text-slate-500">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {existingImages.map((src, idx) => (
                <div key={`exist-${idx}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                  <img src={src} alt="Existing product" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 hover:text-red-500"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}

              {newImages.map((img, idx) => (
                <div key={`new-${idx}`} className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200">
                  <img src={img.url} alt="New product upload" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-slate-600 hover:text-red-500"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Variants & Tags */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-slate-700">Colors</label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="Black, Silver"
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Sizes</label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="S, M, L"
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="audio, apple"
                className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 pt-1">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">Product Available In Stock</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {loading ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default ProductModal;