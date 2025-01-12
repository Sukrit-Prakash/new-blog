// // utils/axiosInstance.js

// import axios from 'axios';
// import { getToken, removeToken } from './auth';
// import Router from 'next/router';

// // Create an Axios instance
// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// // Request interceptor to add the Authorization header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor to handle 401 errors globally
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.warn('Unauthorized. Redirecting to login.');
//       removeToken();
//       Router.replace('/login');
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
