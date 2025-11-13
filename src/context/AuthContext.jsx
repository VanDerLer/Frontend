import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

/**
 * AuthContext minimal
 * - isAuthenticated: boolean
 * - login(): function (fake)
 * - logout(): function (fake)
 *
 * No futuro, trocar por verificação via token / api.
 */

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Em produção, inicializar a partir de localStorage / cookie / token validado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (userData = { name: "Usuário", avatar: null }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
