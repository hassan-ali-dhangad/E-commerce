const config = {
  new: { label: "New", bg: "#e0e7ff", text: "#3730a3" },
  sale: { label: "Sale", bg: "#fce7f3", text: "#be185d" },
  popular: { label: "Popular", bg: "#fef3c7", text: "#92400e" },
  limited: { label: "Limited", bg: "#fee2e2", text: "#991b1b" },
  processing: { label: "Processing", bg: "#e0e7ff", text: "#3730a3" },
  shipped: { label: "Shipped", bg: "#dbeafe", text: "#1e40af" },
  delivered: { label: "Delivered", bg: "#d1fae5", text: "#065f46" },
  cancelled: { label: "Cancelled", bg: "#fee2e2", text: "#991b1b" },
};

export default function Badge({ type, size = "sm" }) {
  const { label, bg, text } = config[type] || config.new;
  const padding =
    size === "md" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${padding}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  );
}
