// pages/posts/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import styles from '../../styles/PostDetail.module.css';
import Comment from '../../components/Comment/Comment';
import { getToken } from '../../utils/auth';

const PostDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
      setPost(res.data);
    } catch (err) {
      console.error('Error fetching post:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comments/${post._id}`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchComments();
    }
  }, [post]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError('You must be logged in to comment.');
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          content: newComment,
          postId: post._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error submitting comment.');
    }
  };

  const handleDeleteComment = async (id) => {
    const token = getToken();
    if (!token) {
      alert('You must be logged in to delete comments.');
      return;
    }
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment.');
    }
  };

  return (
    <Layout>
      {post ? (
        <div className={styles.postDetail}>
          {post.coverImage && (
            <img src={post.coverImage} alt={post.title} className={styles.coverImage} />
          )}
          <h1>{post.title}</h1>
          <p className={styles.meta}>
            By {post.author.username} • {new Date(post.publishedAt).toLocaleDateString()}
          </p>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
          <div className={styles.commentsSection}>
            <h3>Comments ({post.commentsCount})</h3>
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              {error && <p className={styles.error}>{error}</p>}
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment here..."
                required
                rows={4}
              ></textarea>
              <button type="submit" className={styles.submitBtn}>
                Submit Comment
              </button>
            </form>
            <div className={styles.commentsList}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    onDelete={handleDeleteComment}
                  />
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading post...</p>
      )}
    </Layout>
  );
};

export default PostDetail;
