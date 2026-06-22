import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(false);
}, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
   localStorage.setItem("token", res.data.token);

const userData = {
  _id: res.data._id,
  name: res.data.name,
  email: res.data.email,
};

localStorage.setItem("user", JSON.stringify(userData));
setUser(userData);
    return res.data.user;
  };

  const register = async (name, email, password) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return res.data;
};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
