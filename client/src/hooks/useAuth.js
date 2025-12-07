import { useState, useEffect } from 'react';

/**
 * Custom hook for authentication state management
 * 
 * Manages user authentication state using localStorage for persistence.
 * Provides login/logout functionality with token management.
 * 
 * Note: This is a basic implementation. Consider using Clerk hooks directly
 * for production authentication (useUser, useAuth from @clerk/clerk-react)
 * 
 * @returns {Object} Authentication object with:
 *   - user: Current user object or null
 *   - token: Auth token string or null
 *   - loading: Boolean indicating if auth state is loading
 *   - isAuthenticated: Boolean indicating if user is logged in
 *   - signIn(token, user): Function to login user
 *   - signOut(): Function to logout user
 * 
 * @example
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signIn = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
  };
}
