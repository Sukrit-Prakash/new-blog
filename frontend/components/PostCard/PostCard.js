import Link from 'next/link';
import styles from './PostCard.module.css';

const PostCard = ({ post }) => {
  // Generate a random image URL from Lorem Picsum
  const randomImageUrl = `https://picsum.photos/seed/${post.slug}/300/200`; // Use the post slug to ensure different images per post

  return (
    <div className={styles.card}>
      {/* Replace post.imageUrl with the randomImageUrl */}
      <img src={randomImageUrl} alt={post.title} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className={styles.cardCategory}>{post.category}</p>
        <p className={styles.cardExcerpt}>{post.excerpt}</p>
        <p className={styles.cardDate}>{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PostCard;
