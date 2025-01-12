import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import PostCard from '../components/PostCard/PostCard';
import styles from '../styles/Home.module.css';
import { FaLaptopCode, FaHeartbeat, FaBook, FaBriefcase, FaGlobe } from 'react-icons/fa';
import { LiaStarOfLifeSolid } from "react-icons/lia";

const categoryIcons = {
  Tech: <FaLaptopCode />,
  Health: <FaHeartbeat />,
  Education: <FaBook />,
  Business: <FaBriefcase />,
  Travel: <FaGlobe />,
  Lifestyle: <LiaStarOfLifeSolid />,
  All: null,
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categoryContainerRef = useRef(null);
  const fetchPosts = async (category = 'All') => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        params: { category: category !== 'All' ? category : undefined },
      });
      setPosts(res.data.posts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      setCategories(['All', ...res.data.categories]); // Include "All" category
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);
  //for contiuos sliding effect
  // useEffect(()=>{
  //   const container = categoryContainerRef.current;
  //   let scrollAmount = 0;
  //   if(container){
  //     scrollAmount += 1;
  //     container.scrollLeft = scrollAmount;
  //     if(scrollAmount >= container.scrollWidth - container.clientWidth){
  //       scrollAmount = 0;
  //     }
  //   }
  //   const interval = setInterval(scrollCategories, 30); // Adjust speed of animation
  //   return () => clearInterval(interval); // Cleanup interval on component unmount
  // },[])

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchPosts(category);
  };

  return (
    <Layout>
      <div className={styles.banner}>
        <h1>Welcome to MyBlog</h1>
        <p>Your daily dose of insightful articles.</p>
      </div>

      <div className={styles.categories} >
        <div className={styles.categorySlider}>
          {categories.map((category, index) => (
            <button
              key={index}
              className={`${styles.categoryButton} ${
                selectedCategory === category ? styles.active : ''
              }`}
              onClick={() => handleCategorySelect(category)}
            >
              {categoryIcons[category] && <span className={styles.icon}>{categoryIcons[category]}</span>}
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.posts}>
        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </Layout>
  );
};

export default Home;
