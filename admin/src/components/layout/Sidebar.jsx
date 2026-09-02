import {
  BarChart3,
  Folder,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Users,
  UserCog,
  X,
  Shield
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { getPages } from "../../services/pageService";
import toast from "react-hot-toast";

// =====================================================
// ICON MAP
// =====================================================

const iconMap = {
  LayoutDashboard,
  ShoppingBag,
  Folder,
  ShoppingCart,
  Users,
  UserCog,
  BarChart3,
  Shield,
  Settings,
};

// =====================================================
// SIDEBAR
// =====================================================

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================================================
  // LOAD PAGES
  // ===================================================

 useEffect(() => {
  const loadPages = async () => {
    try {
      setLoading(true);

      const response = await getPages();

      const pageData = Array.isArray(response)
        ? response
        : response.pages || [];

      setPages(pageData);
    } catch (error) {
      console.error("Failed to load pages:", error);

      setPages([]);

      toast.error(error.message || "Failed to load navigation.");
    } finally {
      setLoading(false);
    }
  };

  loadPages();
}, []);

  // ===================================================
  // GROUP PAGES BY SECTION
  // ===================================================

  const groupedNavigation = pages.reduce((groups, page) => {
    const section = page.section || "OTHER";

    if (!groups[section]) {
      groups[section] = [];
    }

    groups[section].push(page);

    return groups;
  }, {});

  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[250px] flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/admin/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              S
            </div>

            <div>
              <div className="text-[17px] font-bold text-slate-900">
                Shop
                <span className="text-indigo-600">Sphere</span>
              </div>

              <div className="text-[8px] font-bold tracking-[1.2px] text-slate-400">
                ADMIN PORTAL
              </div>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* =================================================
            DYNAMIC NAVIGATION
        ================================================= */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {loading ? (
            <div className="px-3 py-4 text-sm text-slate-400">
              Loading navigation...
            </div>
          ) : pages.length === 0 ? (
            <div className="px-3 py-4 text-sm text-slate-400">
              No pages available.
            </div>
          ) : (
            Object.entries(groupedNavigation).map(
              ([section, sectionPages]) => (
                <div
                  key={section}
                  className="mb-6"
                >
                  {/* Section title */}

                  <p className="mb-2 px-3 text-[10px] font-bold tracking-[1px] text-slate-400">
                    {section}
                  </p>

                  {/* Pages */}

                  <div className="space-y-1">
                    {sectionPages.map((page) => {
                      const Icon = iconMap[page.icon];

                      return (
                        <NavLink
                          key={page._id || page.path}
                          to={page.path}
                          onClick={onClose}
                          className={({ isActive }) =>
                            `
                            flex h-[42px] items-center gap-3
                            rounded-lg px-3
                            text-sm font-medium
                            transition
                            ${
                              isActive
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }
                            `
                          }
                        >
                          {Icon && <Icon size={19} />}

                          <span>{page.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ),
            )
          )}
        </nav>

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="border-t border-slate-100 p-3">
          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>

          {/* User */}

          <div className="mt-2 flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {user?.name?.[0]?.toUpperCase() || "H"}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-800">
                {user?.name || "Hassan"}
              </p>

              <p className="text-[10px] text-slate-400">
                {user?.role?.name || user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;