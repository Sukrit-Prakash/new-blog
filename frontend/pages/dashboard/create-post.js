// pages/dashboard/create-post.js
import { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import { getToken, protectRoute } from '../../utils/auth';
import { useRouter } from 'next/router';
import styles from '../../styles/CreatePost.module.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        {
          title,
          slug,
          content,
          categories: categories.split(',').map((cat) => cat.trim()),
          tags: tags.split(',').map((tag) => tag.trim()),
          coverImage,
          published,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push(`/posts/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    }
  };

  return (
    <Layout>
      <div className={styles.createPostContainer}>
        <h2>Create New Post</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.postForm}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Slug:</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          ></textarea>

          <label>Categories (comma separated):</label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />

          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <label>Cover Image URL:</label>
          <input
            type="text"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish
          </label>

          <button type="submit" className={styles.submitBtn}>
            Create Post
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default protectRoute(CreatePost);
