import { Calendar, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import SalesOverview from "../components/dashboard/SalesOverview";
import RecentOrders from "../components/dashboard/RecentOrders";
import TopProducts from "../components/dashboard/TopProducts";

const Dashboard = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1.5 text-sm text-slate-500">
            Welcome back, Hassan. Here's what's happening with your store
            today.
          </p>
        </div>

        <div className="flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
          <Calendar size={13} className="text-slate-400" />
          August 24, 2026
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value="13"
          change="+12.5%"
          description="vs. last month"
          icon={Package}
        />

        <StatCard
          title="Total Orders"
          value="25"
          change="+8.2%"
          description="vs. last month"
          icon={ShoppingCart}
        />

        <StatCard
          title="Customers"
          value="120"
          change="+15.4%"
          description="vs. last month"
          icon={Users}
        />

        <StatCard
          title="Total Revenue"
          value="$8,420"
          change="+9.8%"
          description="vs. last month"
          icon={DollarSign}
        />
      </div>

      {/* Charts */}
      <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <SalesOverview />

        <RecentOrders />
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <TopProducts />

        <QuickActions />
      </div>
    </div>
  );
};

const actions = [
  { label: "Add product", icon: Package },
  { label: "View orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: DollarSign },
];

const QuickActions = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-[15px] font-semibold text-slate-900">
        Quick Actions
      </h2>

      <p className="mt-1 text-[11px] text-slate-400">
        Manage your store quickly
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="group rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-indigo-600 shadow-sm transition-colors group-hover:bg-indigo-100">
              <Icon size={17} strokeWidth={2} />
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-700">
              {label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
