// components/Comment/Comment.js
import { useState } from 'react';
import styles from './Comment.module.css';

const Comment = ({ comment, onDelete, onReply }) => {
  const [showReply, setShowReply] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLike = () => {
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setLiked(!liked);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onReply(comment._id, replyText);
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.author}>
        <strong>{comment.author.username}</strong> •{' '}
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <p className={styles.content}>{comment.content}</p>
      <div className={styles.actions}>
        <button onClick={handleLike} className={liked ? styles.liked : ''}>
          👍 {likeCount}
        </button>
        <button onClick={() => setShowReply(!showReply)}>Reply</button>
        <button onClick={() => onDelete(comment._id)} className={styles.delete}>
          Delete
        </button>
      </div>
      {showReply && (
        <form onSubmit={handleReplySubmit} className={styles.replyForm}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={3}
          />
          <button type="submit" className={styles.submitReply}>
            Submit
          </button>
        </form>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
