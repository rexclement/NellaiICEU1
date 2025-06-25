import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    axios
      .get('/check-auth', { withCredentials: true })
      .then((res) => setAuthenticated(res.data.loggedIn)) // ✅ FIXED
      .catch(() => setAuthenticated(false));
  }, [location.pathname]);

  if (authenticated === null) return <div>Loading...</div>;
  if (!authenticated) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;

