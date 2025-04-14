"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import LoginForm from "@/components/login";
import CustomLoader from "@/components/customloader";
import { useRouter } from "next/navigation";
import { toastInfo } from "@/utils/toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  loading: boolean;
  setUser: (value: User | null) => void;
  setToken: (value: string | null) => void;
}

const url = process.env.BACKEND_URL;
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    toastInfo("Logout successfully");
    setTimeout(() => {
      router.push("/");
      localStorage.removeItem("Token");
      setToken(null);
      setUser(null);
    }, 500);
  };

  const initializeAuth = async () => {
    const storedToken = localStorage.getItem("Token");
    if (storedToken) {
      try {
        const response = await axios.get(`${url}/api/users/auth`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data.data);
        setToken(storedToken);
      } catch (error) {
        localStorage.removeItem("Token");
        setUser(null);
        setToken(null);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    initializeAuth();
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    logout,
    loading,
    setUser,
    setToken,
  };
  if (loading) return <CustomLoader />;
  return (
    <AuthContext.Provider value={value}>
      {token ? children : <LoginForm />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
