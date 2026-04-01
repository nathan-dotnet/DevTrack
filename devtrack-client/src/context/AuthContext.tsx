import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/authApi";

interface AuthUser {
  email: string;
  role: string;
  accessToken: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, try to restore session via refresh token cookie
  useEffect(() => {
    authApi
      .refresh()
      .then(({ data }) => {
        localStorage.setItem("accessToken", data.accessToken);
        setUser({
          email: data.email,
          role: data.role,
          accessToken: data.accessToken,
        });
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    setUser({
      email: data.email,
      role: data.role,
      accessToken: data.accessToken,
    });
  };

  const register = async (email: string, password: string) => {
    const { data } = await authApi.register(email, password);
    localStorage.setItem("accesToken", data.accessToken);
    setUser({
      email: data.email,
      role: data.role,
      accessToken: data.accessToken,
    });
  };

  const logout = async () => {
    await authApi.revoke();
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
