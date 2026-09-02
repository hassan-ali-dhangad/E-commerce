import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

const chartData = [
  { month: "Jan", revenue: 4200 },
  { month: "Feb", revenue: 5500 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6100 },
  { month: "Jun", revenue: 7800 },
  { month: "Jul", revenue: 6700 },
  { month: "Aug", revenue: 8800 },
  { month: "Sep", revenue: 7400 },
  { month: "Oct", revenue: 9200 },
  { month: "Nov", revenue: 8100 },
  { month: "Dec", revenue: 9700 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-900">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

const SalesOverview = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-900">
            Sales Overview
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            Revenue performance throughout the year
          </p>
        </div>

        <select
          defaultValue="year"
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none transition-colors hover:border-slate-300 focus:border-indigo-300"
        >
          <option value="year">This year</option>
          <option value="month">This month</option>
          <option value="week">This week</option>
        </select>
      </div>

      <div className="mt-4 flex items-end gap-2.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          $24,580.00
        </span>
        <span className="mb-0.5 flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-600">
          <TrendingUp size={12} strokeWidth={2.5} />
          +18.4%
        </span>
      </div>

      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#f1f5f9"
              strokeDasharray="0"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              interval={0}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={(value) => `$${value / 1000}k`}
              width={40}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              activeDot={{
                r: 5,
                fill: "#4f46e5",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesOverview;
