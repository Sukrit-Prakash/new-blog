// pages/login.js
import { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { setToken } from '../utils/auth';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password,
      });
      setToken(res.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <Layout>
      <div className={styles.authContainer}>
        <h2>Login</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
