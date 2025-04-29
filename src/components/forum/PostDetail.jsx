import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiClock, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import ReplyForm from './ReplyForm';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/forum/posts/${id}`);
        setPost(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post');
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleNewReply = (newReply) => {
    setPost(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 60vh;
          }
          .spinner {
            width: 48px;
            height: 48px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-left-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <style jsx>{`
          .error-container {
            background: #fff0f0;
            border-left: 4px solid #ff4d4f;
            padding: 16px;
            margin: 24px auto;
            max-width: 800px;
            border-radius: 0 8px 8px 0;
            color: #ff4d4f;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="not-found">
        <p>Post not found</p>
        <style jsx>{`
          .not-found {
            text-align: center;
            padding: 48px 0;
            color: #666;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <style jsx>{`
        .post-detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px 16px;
        }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          margin-bottom: 24px;
          transition: color 0.2s;
        }
        .back-button:hover {
          color: #2563eb;
        }
        
        .post-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
          padding: 28px;
          margin-bottom: 32px;
        }
        
        .post-title {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 16px;
          line-height: 1.3;
        }
        
        .post-content {
          color: #374151;
          line-height: 1.7;
          margin-bottom: 24px;
          white-space: pre-line;
          font-size: 16px;
        }
        
        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .replies-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }
        
        .replies-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }
        
        .reply-card {
          background: #f9fafb;
          border-left: 4px solid #3b82f6;
          border-radius: 8px;
          padding: 16px 20px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .reply-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .reply-content {
          color: #374151;
          line-height: 1.6;
          white-space: pre-line;
          margin-bottom: 12px;
        }
        
        .reply-meta {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #6b7280;
        }
        
        .no-replies {
          text-align: center;
          padding: 32px 0;
          color: #6b7280;
          font-size: 15px;
        }
        
        @media (max-width: 768px) {
          .post-detail-container {
            padding: 16px 12px;
          }
          .post-card {
            padding: 20px;
          }
          .post-title {
            font-size: 24px;
          }
        }
      `}</style>

      <a href="/forum" className="back-button">
        <FiArrowLeft /> Back to Forum
      </a>

      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-content">{post.content}</p>
        <div className="post-meta">
          <div className="meta-item">
            <FiUser size={14} />
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>
          <div className="meta-item">
            <FiClock size={14} />
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="replies-header">
          <FiMessageSquare /> {post.replies?.length || 0} {post.replies?.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        <ReplyForm postId={post._id} onReplyAdded={handleNewReply} />

        {post.replies?.length > 0 ? (
          <div className="replies-list">
            {post.replies.map((reply) => (
              <div key={reply._id} className="reply-card">
                <p className="reply-content">{reply.content}</p>
                <div className="reply-meta">
                  <div className="meta-item">
                    <FiUser size={12} />
                    <span>{reply.author?.name || 'Anonymous'}</span>
                  </div>
                  <div className="meta-item">
                    <FiClock size={12} />
                    <span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-replies">
            No replies yet. Be the first to respond!
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;