import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const StatCard = ({ title, value, change, description, icon: Icon }) => {
  const isPositive = !change.startsWith("-");

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
          <Icon size={20} strokeWidth={2} />
        </div>

        <span
          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isPositive
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={13} strokeWidth={2.5} />
          ) : (
            <ArrowDownRight size={13} strokeWidth={2.5} />
          )}
          {change}
        </span>
      </div>

      <p className="mt-5 text-[26px] font-bold leading-none tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-700">{title}</p>

      <p className="mt-0.5 text-[11px] text-slate-400">{description}</p>
    </div>
  );
};

export default StatCard;
