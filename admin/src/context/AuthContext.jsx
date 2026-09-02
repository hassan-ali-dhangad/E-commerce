import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getMe,
  logout as logoutApi,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

const checkAuth = async () => {
  try {
    const data = await getMe();

    if (data.success) {
      setUser(data.user);
    }
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    checkAuth();
  }, []);


  const logout = async () => {
  try {
    await logoutApi();
  } finally {
    setUser(null);
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};