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
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// =====================================================
// CREATE USER
// =====================================================

export const signup = (userData) => {
  return request("/auth/signup", {
    method: "POST",

    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      role_id: userData.role_id,
    }),
  });
};

// =====================================================
// GET USERS
// =====================================================

export const getUsers = () => {
  return request("/auth/users", {
    method: "GET",
  });
};

// =====================================================
// GET USER
// =====================================================

export const getUserById = (id) => {
  return request(`/auth/users/${id}`, {
    method: "GET",
  });
};

// =====================================================
// UPDATE USER
// =====================================================

export const updateUser = (id, userData) => {
  return request(`/auth/users/${id}`, {
    method: "PUT",

    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      role_id: userData.role_id,
    }),
  });
};

// =====================================================
// DELETE USER
// =====================================================

export const deleteUser = (id) => {
  return request(`/auth/users/${id}`, {
    method: "DELETE",
  });
};

export default {
  signup,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};