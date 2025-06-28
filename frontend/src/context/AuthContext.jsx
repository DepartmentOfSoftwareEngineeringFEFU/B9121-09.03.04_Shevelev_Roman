import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  userData: null,
  login: () => {},
  logout: () => {},
  fetchUserData: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsLoggedIn(true);
      } else {
        console.error("Failed to fetch user data");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.error("Network error while fetching user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    }
  };

  const login = (token, userId, nickname) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    fetchUserData(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userData, login, logout, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
