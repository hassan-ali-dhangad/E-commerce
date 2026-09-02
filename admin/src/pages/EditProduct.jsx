import { ArrowLeft, ImagePlus, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state aligned with backend schema
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
    isFeatured: false,
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch initial product data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch(`/api/products/${id}`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setFormData({
            name: prodData.name || "",
            category: prodData.category?._id || prodData.category || "",
            price: prodData.price || "",
            quantity: prodData.quantity || prodData.stock || "",
            description: prodData.description || "",
            features: Array.isArray(prodData.features)
              ? prodData.features.join("\n")
              : "",
            tags: Array.isArray(prodData.tags) ? prodData.tags.join(", ") : "",
            colors: Array.isArray(prodData.colors)
              ? prodData.colors.join(", ")
              : "",
            sizes: Array.isArray(prodData.sizes)
              ? prodData.sizes.join(", ")
              : "",
            inStock: prodData.inStock ?? true,
            isFeatured: prodData.isFeatured ?? false,
          });

          // Fixed image state population (replacing undefined setImages)
          if (prodData.images?.length) {
            setExistingImages(prodData.images);
          } else if (prodData.image) {
            setExistingImages([prodData.image]);
          }
        } else {
          throw new Error(`Server returned status ${prodRes.status}. Verify endpoint path.`);
        }
      } catch (err) {
        setError(err.message || "Failed to load product data.");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Clean up blob object URLs to prevent browser memory leaks
  useEffect(() => {
    return () => {
      newImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [newImages]);

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

    if (!existingImages.length && !newImages.length) {
      setError("Please ensure at least one image remains.");
      return;
    }

    setLoading(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("description", formData.description);
    data.append("inStock", formData.inStock);
    data.append("isFeatured", formData.isFeatured);

    const parseList = (str) =>
      str
        .split(/[\n,]/)
        .map((item) => item.trim())
        .filter(Boolean);

    parseList(formData.features).forEach((item) =>
      data.append("features", item)
    );
    parseList(formData.tags).forEach((item) => data.append("tags", item));
    parseList(formData.colors).forEach((item) => data.append("colors", item));
    parseList(formData.sizes).forEach((item) => data.append("sizes", item));

    // Append retained existing image URLs
    existingImages.forEach((url) => data.append("existingImages", url));

    // Append newly selected files
    newImages.forEach((img) => data.append("images", img.file));

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update product");
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to="/admin/products"
              className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>

            <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>

            <p className="mt-1 text-sm text-slate-500">
              Update product information and inventory settings.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save size={17} />
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form Body */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Information */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Basic Information
              </h2>

              <div className="mt-5 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormInput
                    label="Product Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. AirPods Pro Max Wireless"
                    required
                  />

                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormInput
                    label="Price ($)"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="249.99"
                    required
                  />

                  <FormInput
                    label="Stock Quantity"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="2"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    required
                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            </section>

            {/* Images Upload */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Product Images
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Upload multiple images. The first image will be set as the main display image.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-indigo-400 hover:bg-indigo-50">
                  <ImagePlus size={25} className="text-slate-400" />
                  <span className="mt-2 text-xs font-medium text-slate-500">
                    Add Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Existing Images */}
                {existingImages.map((src, index) => (
                  <div
                    key={`exist-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                  >
                    <img
                      src={src}
                      alt={`Product preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow hover:bg-white hover:text-red-500"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}

                {/* Newly Added Local Files */}
                {newImages.map((image, index) => (
                  <div
                    key={`new-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200"
                  >
                    <img
                      src={image.url}
                      alt={`New upload ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {existingImages.length === 0 && index === 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Main
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-600 shadow hover:bg-white hover:text-red-500"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Variants & Metadata
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Product Features
                  </label>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Separate features with new lines or commas.
                  </p>
                  <textarea
                    name="features"
                    rows="3"
                    value={formData.features}
                    onChange={handleChange}
                    placeholder={"Vibram outsole\nGORE-TEX waterproofing"}
                    className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <FormInput
                  label="Colors (Comma separated)"
                  name="colors"
                  value={formData.colors}
                  onChange={handleChange}
                  placeholder="Black, Silver, Space Gray"
                />

                <FormInput
                  label="Sizes (Comma separated)"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L, XL"
                />

                <FormInput
                  label="Tags (Comma separated)"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="wireless, audio, apple"
                />

                <div className="space-y-3 pt-2">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      In Stock
                    </span>
                  </label>

                </div>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
};

const FormInput = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  step,
}) => {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        step={step}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />
    </div>
  );
};

export default EditProduct;