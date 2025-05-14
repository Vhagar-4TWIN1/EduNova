import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiClock, FiMessageSquare, FiArrowLeft, FiMic, FiThumbsUp } from 'react-icons/fi';
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
        const response = await axios.get(`https://edunova-back-rqxc.onrender.com/api/forum/posts/${id}`);
        setPost(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post');
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);
  const handleUpvote = async (replyId) => {
    try {
      await axios.post(`https://edunova-back-rqxc.onrender.com/api/forum/replies/${replyId}/upvote`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const updatedPost = await axios.get(`https://edunova-back-rqxc.onrender.com/api/forum/posts/${id}`);
      setPost(updatedPost.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upvote');
    }
  };
  const getAudioUrl = (path) => {
    return `https://edunova-back-rqxc.onrender.com${path}`;

  }

  const handleNewReply = (newReply) => {
    setPost(prev => ({
      ...prev,
      replies: [...prev.replies, newReply]
    }));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70vh;
          }
          .spinner {
            width: 56px;
            height: 56px;
            border: 4px solid rgba(99, 102, 241, 0.1);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            position: relative;
          }
          .spinner::after {
            content: '';
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 4px solid transparent;
            border-radius: 50%;
            border-top-color: rgba(99, 102, 241, 0.3);
            animation: spin 1.5s linear infinite reverse;
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
        <div className="error-card">
          <h3 className="error-title">Error Loading Post</h3>
          <p className="error-message">{error}</p>
          <a href="/forum" className="back-btn">
            <FiArrowLeft /> Return to Forum
          </a>
        </div>
        <style jsx>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70vh;
            padding: 2rem;
          }
          .error-card {
            background: white;
            border-radius: 12px;
            padding: 2.5rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #ef4444;
          }
          .error-title {
            color: #ef4444;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          .error-message {
            color: #6b7280;
            margin-bottom: 1.5rem;
          }
          .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #6366f1;
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .back-btn:hover {
            background: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
        `}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="not-found-container">
        <div className="not-found-card">
          <h3>Post Not Found</h3>
          <p>The post you're looking for doesn't exist or may have been removed.</p>
          <a href="/forum" className="back-btn">
            <FiArrowLeft /> Browse All Posts
          </a>
        </div>
        <style jsx>{`
          .not-found-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 70vh;
            padding: 2rem;
          }
          .not-found-card {
            background: white;
            border-radius: 12px;
            padding: 2.5rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
          }
          .not-found-card h3 {
            font-size: 1.5rem;
            color: #111827;
            margin-bottom: 1rem;
          }
          .not-found-card p {
            color: #6b7280;
            margin-bottom: 1.5rem;
          }
          .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1.5rem;
            background: #6366f1;
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          .back-btn:hover {
            background: #4f46e5;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <style jsx>{`
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --text: #1f2937;
          --text-light: #6b7280;
          --bg-card: #ffffff;
          --bg-hover: #f9fafb;
          --border-radius: 12px;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .post-detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: white;
          color: var(--primary);
          border-radius: var(--border-radius);
          text-decoration: none;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
          margin-bottom: 2rem;
          transition: var(--transition);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .back-button:hover {
          background: var(--bg-hover);
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          color: var(--primary-light);
        }

        .post-card {
          background: var(--bg-card);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          padding: 2.5rem;
          margin-bottom: 3rem;
          position: relative;
          overflow: hidden;
        }

        .post-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary), var(--primary-light));
        }

        .post-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 1.5rem;
          line-height: 1.3;
        }

        .post-content {
          color: var(--text);
          line-height: 1.8;
          margin-bottom: 2rem;
          white-space: pre-line;
          font-size: 1.1rem;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .replies-section {
          background: var(--bg-card);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          padding: 2.5rem;
        }

        .replies-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 2rem;
          position: relative;
        }

        .replies-header::after {
          content: '';
          position: absolute;
          bottom: -0.75rem;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(to right, var(--primary), var(--primary-light));
          border-radius: 2px;
        }

        .replies-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .reply-card {
          background: var(--bg-card);
          border-radius: var(--border-radius);
          padding: 1.75rem;
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }

        .reply-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .reply-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary), var(--primary-light));
          opacity: 0;
          transition: var(--transition);
        }

        .reply-card:hover::before {
          opacity: 1;
        }

        .voice-reply-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .voice-reply-icon {
          color: var(--primary);
          flex-shrink: 0;
        }

        .audio-player {
          width: 100%;
          max-width: 300px;
          height: 40px;
          border-radius: 20px;
        }

        .reply-content {
          color: var(--text);
          line-height: 1.7;
          white-space: pre-line;
          margin-bottom: 1.5rem;
        }

        .reply-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-light);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .reply-meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .upvote-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary);
          border: none;
          border-radius: 20px;
          padding: 0.5rem 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .upvote-btn:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: translateY(-1px);
        }

        .no-replies {
          text-align: center;
          padding: 3rem 0;
          color: var(--text-light);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .post-detail-container {
            padding: 1.5rem 1rem;
          }
          
          .post-card, .replies-section {
            padding: 1.75rem;
          }
          
          .post-title {
            font-size: 1.75rem;
          }
          
          .replies-header {
            font-size: 1.3rem;
          }
        }

        /* Animation for replies */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .reply-card {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .reply-card:nth-child(1) { animation-delay: 0.1s; }
        .reply-card:nth-child(2) { animation-delay: 0.2s; }
        .reply-card:nth-child(3) { animation-delay: 0.3s; }
        .reply-card:nth-child(4) { animation-delay: 0.4s; }
        .reply-card:nth-child(5) { animation-delay: 0.5s; }
        .reply-card:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
      <br /><br />


      <div className="post-card">
        <h1 className="post-title">{post.title}</h1>
        <p className="post-content">{post.content}</p>
        <div className="post-meta">
          <div className="meta-item">
            <FiUser size={16} />
            <span>{post.author?.name || 'Anonymous'}</span>
          </div>
          <div className="meta-item">
            <FiClock size={16} />
            <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      <div className="replies-section">
        <h2 className="replies-header">
          <FiMessageSquare size={24} /> {post.replies?.length || 0} {post.replies?.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        <ReplyForm postId={post._id} onReplyAdded={handleNewReply} />

        {post.replies?.length > 0 ? (
          <div className="replies-list">
            {post.replies.map((reply) => (
              <div key={reply._id} className="reply-card">
                {reply.voiceUrl ? (
                  <div className="voice-reply-container">
                    <FiMic className="voice-reply-icon" size={20} />
                    <audio
                      controls
                      src={`https://edunova-back-rqxc.onrender.com${reply.voiceUrl}`}
                      className="audio-player"
                    />
                  </div>
                ) : (
                  <div className="reply-content">{reply.content}</div>
                )}
                <div className="reply-meta">
                  <div className="reply-meta-item">
                    <FiUser size={14} /> {reply.author?.username || 'Anonymous'}
                  </div>
                  <div className="reply-meta-item">
                    <FiClock size={14} /> {formatDistanceToNow(new Date(reply.createdAt))} ago
                  </div>
                  <button
                    className="upvote-btn"
                    onClick={() => handleUpvote(reply._id)}
                  >
                    <FiThumbsUp size={14} /> {reply.upvotedBy?.length || 0} Upvotes
                  </button>
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