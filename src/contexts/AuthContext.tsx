
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

type User = {
  username: string;
  name: string;
  role: "admin" | "user" | "auditor";
};

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username: string, password: string) => {
    // Simple authentication for demo purposes
    if (username === "miko" && password === "miko") {
      const user: User = {
        username: "miko",
        name: "Miko Admin",
        role: "admin",
      };
      
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}`,
      });
      return true;
    }
    toast({
      title: "Login failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
