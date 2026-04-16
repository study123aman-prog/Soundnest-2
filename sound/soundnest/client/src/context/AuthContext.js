import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/me', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };
  const upgradeUser = async () => {
    const res = await axios.patch('/api/users/upgrade-to-premium', {}, { withCredentials: true });
    setUser(res.data.user);
    return res.data;
  };

  // return (
  //   <AuthContext.Provider value={{ user, login, logout, loading }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
  return (
  <AuthContext.Provider value={{ user, login, logout, loading, upgradeUser }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
