import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Auth
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

// Admin
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import CreateProduct from "../pages/CreateProduct";
import EditProduct from "../pages/EditProduct";

import Categories from "../pages/Categories";

// import CreateCategory from "../pages/CreateCategory";
// import EditCategory from "../pages/EditCategory";

import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import CreateRole from "../pages/CreateRole";
import Roles from "../pages/Roles";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================================= */}
      {/* ROOT */}
      {/* ================================= */}

      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      {/* ================================= */}
      {/* PUBLIC AUTH ROUTES */}
      {/* ================================= */}

      <Route path="/admin/login" element={<Login />} />

      <Route path="/admin/signup" element={<Signup />} />

      <Route path="/admin/verify-email" element={<VerifyEmail />} />

      <Route path="/admin/forgot-password" element={<ForgotPassword />} />

      {/* IMPORTANT:
          This MUST be outside ProtectedRoute
      */}

      <Route path="/admin/reset-password/:token" element={<ResetPassword />} />

      {/* ================================= */}
      {/* PROTECTED ADMIN ROUTES */}
      {/* ================================= */}

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Products */}
          <Route path="products" element={<Products />} />

          <Route path="products/create" element={<CreateProduct />} />

          <Route path="products/:id/edit" element={<EditProduct />} />

          {/* Categories */}
          <Route path="categories" element={<Categories />} />

          {/* <Route path="categories/create" element={<CreateCategory />} />

          <Route path="categories/:id/edit" element={<EditCategory />} /> */}

          {/* Orders */}
          <Route path="orders" element={<Orders />} />

          {/* Customers */}
          <Route path="customers" element={<Customers />} />

          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />
          {/* Users */}
          <Route path="users" element={<Users />} />
          {/* Create Role */}

          {/* Roles */}
          <Route path="roles" element={<Roles />} />

          {/* Create Role */}
          <Route path="roles/create" element={<CreateRole />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* ================================= */}
      {/* FALLBACK */}
      {/* ================================= */}

      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
