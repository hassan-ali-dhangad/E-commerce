const API_URL = "http://localhost:5000/api";

// =====================================================
// REQUEST HELPER
// =====================================================

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong",
    );
  }

  return data;
};

// =====================================================
// GET ROLES
// =====================================================

export const getRoles = () => {
  return request("/roles", {
    method: "GET",
  });
};

// =====================================================
// GET ROLE
// =====================================================

export const getRoleById = (id) => {
  return request(`/roles/${id}`, {
    method: "GET",
  });
};

// =====================================================
// CREATE ROLE
// =====================================================

export const createRole = (roleData) => {
  return request("/roles", {
    method: "POST",

    body: JSON.stringify(roleData),
  });
};

// =====================================================
// UPDATE ROLE
// =====================================================

export const updateRole = (id, roleData) => {
  return request(`/roles/${id}`, {
    method: "PUT",

    body: JSON.stringify(roleData),
  });
};

// =====================================================
// DELETE ROLE
// =====================================================

export const deleteRole = (id) => {
  return request(`/roles/${id}`, {
    method: "DELETE",
  });
};

export default {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};