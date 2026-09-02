const products = [
  {
    name: "AirPods Pro Max Wireless",
    category: "Electronics",
    price: "$249.99",
    sold: 84,
  },
  {
    name: "Minimalist Leather Watch",
    category: "Fashion",
    price: "$189.00",
    sold: 67,
  },
  {
    name: "4K Ultra HD Smart Monitor",
    category: "Electronics",
    price: "$599.00",
    sold: 45,
  },
  {
    name: "Merino Wool Turtleneck",
    category: "Fashion",
    price: "$89.00",
    sold: 38,
  },
];

const maxSold = Math.max(...products.map((p) => p.sold));

const TopProducts = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-[15px] font-semibold text-slate-900">
          Top Products
        </h2>
        <p className="mt-1 text-[11px] text-slate-400">
          Best performing products
        </p>
      </div>

      <div className="mt-4 divide-y divide-slate-100">
        {products.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500">
              {index + 1}
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-semibold text-indigo-600">
              {product.name.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-800">
                {product.name}
              </p>
              <p className="text-[11px] text-slate-400">
                {product.category}
              </p>
              <div className="mt-1.5 h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(product.sold / maxSold) * 100}%` }}
                />
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[13px] font-bold text-slate-900">
                {product.price}
              </p>
              <p className="text-[11px] text-slate-400">
                {product.sold} sold
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;
