import React, { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'Official' | 'Admin' | null;

interface UserContextType {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: UserRole;
  login: (name: string, role: UserRole) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);

  const login = (name: string, role: UserRole) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, userName, userRole, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};