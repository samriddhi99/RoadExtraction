import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'user' | 'Admin' | null;

interface UserContextType {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: UserRole;
  login: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

// ✅ Export the context directly
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const login = (name: string, email: string, role: UserRole) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
    setUserEmail(null);
  };

  const isAdmin = () => {
    return userEmail?.endsWith('@admin.roadmonitor.in') || false;
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userName, userRole, login, logout, isAdmin }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Optional hook to access context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
