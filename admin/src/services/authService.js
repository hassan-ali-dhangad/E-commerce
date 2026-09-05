const API_URL = "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

export const signup = (userData) => {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const verifyEmail = (email, otp) => {
  return request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
    }),
  });
};

export const resendOTP = (email) => {
  return request("/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};

export const login = (email, password) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const forgotPassword = (email) => {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};

export const resetPassword = (
  token,
  password,
  confirmPassword
) => {
  return request(`/auth/reset-password/${token}`, {
    method: "POST",
    body: JSON.stringify({
      password,
      confirmPassword,
    }),
  });
};

export const changePassword = (
  currentPassword,
  newPassword,
  confirmNewPassword
) => {
  return request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }),
  });
};

export const getMe = () => {
  return request("/auth/me", {
    method: "GET",
  });
};

export const logout = () => {
  return request("/auth/logout", {
    method: "POST",
  });
};

export const deleteAccount = () => {
  return request("/auth/delete-account", {
    method: "DELETE",
  });
};