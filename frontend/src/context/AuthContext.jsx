import React, { useState, createContext } from "react";

export const UserData = createContext(null);

const AuthContext = ({ children }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <UserData.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </UserData.Provider>
  );
};

export default AuthContext;
