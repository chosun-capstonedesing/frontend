import { createContext, useContext, useState } from 'react';
import { isLoggedIn as checkLoginStatus } from '../utils/isLoggedIn';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isDev = import.meta.env.DEV;
  const [isLoggedIn, setIsLoggedIn] = useState(isDev ? true : checkLoginStatus());

  const login = () => {
    localStorage.setItem('access_token', 'mock_token_value');
    sessionStorage.removeItem('uploadedFiles');
    sessionStorage.removeItem('uploadedCount');
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);