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
// GET ALL PAGES
// GET /api/pages
// =====================================================

export const getPages = () => {
  return request("/pages", {
    method: "GET",
  });
};

// =====================================================
// GET PAGE BY ID
// GET /api/pages/:id
// =====================================================

export const getPageById = (id) => {
  return request(`/pages/${id}`, {
    method: "GET",
  });
};

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default {
  getPages,
  getPageById,
};