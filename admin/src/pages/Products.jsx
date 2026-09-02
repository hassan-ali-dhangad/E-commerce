import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProductModal from "../components/products/ProductModal";

import { getProducts, deleteProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Handlers for Modal Operations
  const handleCreate = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);

      const id = productToDelete.id || productToDelete._id;

      const data = await deleteProduct(id);

      if (data.success) {
        setProducts((prev) =>
          prev.filter((product) => product.id !== id && product._id !== id),
        );

        toast.success("Product deleted successfully.");

        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    } catch (error) {
      console.error("Delete product error:", error);

      toast.error(error.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Load categories error:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Load products error:", error);
      setError(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const handleModalSuccess = async () => {
    await loadProducts();
  };

  const filteredProducts = products.filter((product) => {
    const productName = product.name || "";

    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const productCategoryId =
      typeof product.category === "object"
        ? product.category?._id
        : product.category;

    const matchesCategory =
      category === "All" || productCategoryId === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your store products and inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Main Card container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-indigo-500"
          >
            <option value="All">All Categories</option>

            {categories.map((item) => {
              const catId = item._id || item.id;
              return (
                <option key={catId} value={catId}>
                  {item.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Product
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Price
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Stock
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id || product.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {product.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {typeof product.category === "object"
                      ? product.category?.name
                      : product.category || "Uncategorized"}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-600">
                    {product.quantity ?? 0}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        product.inStock
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(product)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Delete"
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
      </div>

      {/* Product Modal Component */}
      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Delete product?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                "{productToDelete.name}"
              </span>
              ?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;