import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiPlus, FiTrendingUp, FiHeart, FiUser, FiClock } from 'react-icons/fi';
import CreatePostModal from './CreatePostModal';
import PostList from './PostList';

const ForumMain = () => {
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topPostsLoading, setTopPostsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topPostsError, setTopPostsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regular posts
        const postsResponse = await axios.get('http://localhost:3000/api/forum/posts');
        setPosts(postsResponse.data);
        
        // Fetch top posts
        const topPostsResponse = await axios.get('http://localhost:3000/api/forum/topPosts');
        setTopPosts(topPostsResponse.data);
        
        setIsLoading(false);
        setTopPostsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
        setTopPostsError(err.response?.data?.message || 'Failed to fetch top posts');
        setIsLoading(false);
        setTopPostsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <>
      <style jsx>{`
        :root {
          --primary: #6366f1;
          --primary-hover: #4f46e5;
          --secondary: #f9fafb;
          --text: #1f2937;
          --text-light: #6b7280;
          --background: #f3f4f6;
          --card-bg: #ffffff;
          --error: #ef4444;
          --success: #10b981;
          --border-radius: 12px;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          background-color: var(--background);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: var(--text);
          line-height: 1.6;
        }

        .forum-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .forum-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: var(--card-bg);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          position: relative;
          overflow: hidden;
        }

        .forum-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, var(--primary), #8b5cf6);
        }

        .forum-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          color: var(--text);
        }

        .forum-title svg {
          color: var(--primary);
        }

        .new-post-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
        }

        .new-post-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .fab-btn {
          position: fixed;
          bottom: 2.5rem;
          right: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          transition: var(--transition);
          z-index: 100;
        }

        .fab-btn:hover {
          background: var(--primary-hover);
          transform: scale(1.1) translateY(-5px);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
        }

        .posts-container {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 3rem;
        }

        .top-posts-container {
          background: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
          margin-bottom: 3rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 2rem;
          position: relative;
          padding-bottom: 0.75rem;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 4px;
          background: linear-gradient(to right, var(--primary), #8b5cf6);
          border-radius: 2px;
        }

        .section-title svg {
          color: var(--primary);
        }

        .top-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        .top-post-card {
          padding: 1.75rem;
          border-radius: var(--border-radius);
          background: var(--card-bg);
          border-left: 4px solid var(--primary);
          transition: var(--transition);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .top-post-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .top-post-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(99, 102, 241, 0) 100%);
          z-index: 0;
        }

        .top-post-title {
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text);
          font-size: 1.1rem;
          position: relative;
          z-index: 1;
        }

        .top-post-content {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          position: relative;
          z-index: 1;
        }

        .top-post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--text-light);
          margin-top: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .top-post-author, .top-post-replies, .top-post-time {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .top-post-replies {
          color: var(--primary);
          font-weight: 600;
        }

        .top-post-author svg, .top-post-time svg {
          color: var(--text-light);
        }

        .loading-state {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 70vh;
        }

        .spinner {
          width: 56px;
          height: 56px;
          border: 5px solid rgba(99, 102, 241, 0.1);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          position: relative;
        }

        .spinner::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 5px solid transparent;
          border-radius: 50%;
          border-top-color: rgba(99, 102, 241, 0.3);
          animation: spin 1.5s linear infinite reverse;
        }

        .error-state {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 70vh;
          text-align: center;
          padding: 2rem;
        }

        .error-card {
          background: var(--card-bg);
          padding: 3rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          max-width: 500px;
          border-left: 4px solid var(--error);
          position: relative;
          overflow: hidden;
        }

        .error-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.03) 0%, rgba(239, 68, 68, 0) 100%);
          z-index: 0;
        }

        .error-title {
          color: var(--error);
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .error-message {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .retry-btn {
          margin-top: 1.5rem;
          padding: 0.75rem 1.75rem;
          background: var(--error);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
        }

        .retry-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .forum-header {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
            padding: 1.5rem;
          }
          
          .forum-title {
            font-size: 1.5rem;
          }
          
          .posts-container, .top-posts-container {
            padding: 1.75rem;
          }
          
          .top-posts-grid {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .fab-btn {
            width: 56px;
            height: 56px;
            bottom: 1.5rem;
            right: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .forum-container {
            padding: 1rem;
          }

          .top-post-card {
            padding: 1.5rem;
          }

          .new-post-btn {
            padding: 0.65rem 1.5rem;
            font-size: 0.9rem;
          }
        }

        /* Animation for cards when they load */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .top-post-card {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .top-post-card:nth-child(1) { animation-delay: 0.1s; }
        .top-post-card:nth-child(2) { animation-delay: 0.2s; }
        .top-post-card:nth-child(3) { animation-delay: 0.3s; }
        .top-post-card:nth-child(4) { animation-delay: 0.4s; }
        .top-post-card:nth-child(5) { animation-delay: 0.5s; }
        .top-post-card:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
      <br/><br/>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-card">
            <h2 className="error-title">Something went wrong</h2>
            <p className="error-message">{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="forum-container">
          <header className="forum-header">
            <h1 className="forum-title">
              <FiMessageSquare size={28} /> Community Forum
            </h1>
            <button className="new-post-btn" onClick={() => setIsModalOpen(true)}>
              <FiPlus size={18} /> New Post
            </button>
          </header>

          {/* Top Posts Section */}
          <div className="top-posts-container">
            <h2 className="section-title">
              <FiTrendingUp size={22} /> Trending Discussions
            </h2>
            
            {topPostsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <div className="spinner"></div>
              </div>
            ) : topPostsError ? (
              <div style={{ 
                color: 'var(--error)', 
                textAlign: 'center', 
                padding: '1.5rem',
                background: 'var(--card-bg)',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {topPostsError}
              </div>
            ) : (
              <div className="top-posts-grid">
                {topPosts.map(post => (
                  <div key={post._id} className="top-post-card">
                    <h3 className="top-post-title">{post.title}</h3>
                    <p className="top-post-content">
                      {post.content.length > 120 
                        ? `${post.content.substring(0, 120)}...` 
                        : post.content}
                    </p> 
                    <div className="top-post-meta">
                      <span className="top-post-author">
                        <FiUser size={14} /> {post.author?.name || 'Anonymous'}
                      </span>
                      &nbsp;&nbsp;&nbsp;
                      <span className="top-post-replies">
                        <FiMessageSquare size={14} /> {post.replyCount} replies
                      </span>&nbsp;&nbsp;&nbsp;
                      <span className="top-post-time">
                        <FiClock size={14} /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Posts Section */}
          <div className="posts-container">
            <PostList posts={posts} />
          </div>

          <button className="fab-btn" onClick={() => setIsModalOpen(true)} aria-label="Create new post">
            <FiPlus size={24} />
          </button>

          <CreatePostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onPostCreated={handleNewPost}
          />
        </div>
      )}
    </>
  );
};

export default ForumMain;