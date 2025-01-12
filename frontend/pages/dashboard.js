// pages/dashboard.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { getToken, protectRoute } from '../utils/auth';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';
import Link from 'next/link';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  const fetchUser = async () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const fetchUserPosts = async () => {
    const token = getToken();
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming the API has an endpoint to fetch user's posts
      setPosts(res.data.posts.filter((post) => post.author._id === user._id));
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  return (
    <Layout>
      <div className={styles.dashboard}>
        <h2>Welcome, {user?.username}</h2>
        <p>Email: {user?.email}</p>
        {/* Add more user info as needed */}
        <Link href="/dashboard/create-post" className={styles.createPost}>
          Create New Post
        </Link>
        <h3>Your Posts</h3>
        <div className={styles.posts}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className={styles.post}>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                <span>{post.published ? 'Published' : 'Draft'}</span>
              </div>
            ))
          ) : (
            <p>You have not written any posts yet.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default protectRoute(Dashboard);
