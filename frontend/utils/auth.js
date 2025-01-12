// utils/auth.js
import Router from 'next/router';

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// export const getToken = () => {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('token');
//   }
//   return null;
// };
export const getToken = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      console.log('Retrieved token:', token); // Debugging
      return token;
    }
    return null;
  };

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Redirect to login if not authenticated
export const protectRoute = (WrappedComponent) => {
  return (props) => {
    if (typeof window !== 'undefined') {
      const token = getToken();
      if (!token) {
        Router.replace('/login');
        return null;
      }
    }
    return <WrappedComponent {...props} />;
  };
};
