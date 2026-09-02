import {
  Bell,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

const Topbar = ({ onMenuClick }) => {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Mobile */}
      <button
        onClick={onMenuClick}
        className="text-slate-600 lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Search */}
      <div className="hidden h-10 w-full max-w-[430px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 sm:flex">
        <Search
          size={18}
          className="text-slate-400"
        />

        <input
          type="text"
          placeholder="Search products, orders, customers..."
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        />

        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
          ⌘ K
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative text-slate-500">
          <Bell size={20} />

          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

        <button className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            H
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold text-slate-900">
              Hassan Ali
            </p>

            <p className="text-[10px] text-slate-400">
              Admin
            </p>
          </div>

          <ChevronDown
            size={16}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
};

export default Topbar;