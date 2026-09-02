import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

const PRICE_MAX = 700;
const sortOptions = [
{ value: "featured", label: "Featured" },
{ value: "price-asc", label: "Price: Low to High" },
{ value: "price-desc", label: "Price: High to Low" },
{ value: "rating", label: "Top Rated" },
{ value: "newest", label: "Newest" }];


export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [priceRange, setPriceRange] = useState(PRICE_MAX);
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : []
  );
  const [selectedBadges, setSelectedBadges] = useState(
    searchParams.get("filter") === "sale" ? ["sale"] : []
  );
  const [minRating, setMinRating] = useState(0);

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "featured";

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
    prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleBadge = (b) => {
    setSelectedBadges((prev) =>
    prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.brand.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedBadges.length && (!p.badge || !selectedBadges.includes(p.badge))) return false;
      if (p.price > priceRange) return false;
      if (p.rating < minRating) return false;
      return true;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);else
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);else
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [query, selectedCategories, selectedBadges, priceRange, minRating, sort]);

  const setSort = (v) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", v);
    setSearchParams(next);
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#94a3b8] mb-6">
        <a href="/" className="hover:text-[#4f46e5]">Home</a>
        <span>/</span>
        <span className="text-[#334155] font-medium">Shop</span>
        {query && <><span>/</span><span className="text-[#334155]">"{query}"</span></>}
      </div>

      <div className="flex gap-8">
     

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-sm font-medium text-[#334155] hover:border-[#4f46e5]">
                
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Filters
              </button>
              <p className="text-sm text-[#64748b]">
                <span className="font-semibold text-[#0f172a]">{filtered.length}</span> products
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-xl bg-white text-[#334155] focus:outline-none focus:border-[#4f46e5]">
                
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
                {["grid", "list"].map((v) =>
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-2 transition-colors ${view === v ? "bg-[#4f46e5] text-white" : "text-[#64748b] hover:bg-[#f8fafc]"}`}>
                  
                    {v === "grid" ?
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg> :

                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                  }
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Products grid/list */}
          {filtered.length === 0 ?
          <div className="text-center py-20">
              <span className="text-5xl block mb-4">🔍</span>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-xl font-bold text-[#0f172a] mb-2">No products found</h3>
              <p className="text-[#64748b]">Try adjusting your filters or search query.</p>
            </div> :
          view === "grid" ?
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div> :

          <div className="space-y-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} view="list" />)}
            </div>
          }
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen &&
      <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white overflow-y-auto p-5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="font-bold text-[#0f172a]">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-lg hover:bg-[#f1f5f9] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Filters />
          </div>
        </div>
      }
    </div>);

}