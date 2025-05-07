import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiPlus, FiTrendingUp } from 'react-icons/fi';
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
        .forum-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .forum-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .forum-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .new-post-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(79, 70, 229, 0.3);
        }

        .new-post-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }

        .fab-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3);
          transition: all 0.2s ease;
          z-index: 10;
        }

        .fab-btn:hover {
          background: #4338ca;
          transform: scale(1.1);
        }

        .posts-container {
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .top-posts-container {
          background: #ffffff;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1.5rem;
        }

        .top-posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .top-post-card {
          padding: 1.5rem;
          border-radius: 12px;
          background: #f9fafb;
          border-left: 4px solid #4f46e5;
          transition: transform 0.2s ease;
        }

        .top-post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .top-post-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .top-post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 1rem;
        }

        .top-post-replies {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #4f46e5;
          font-weight: 600;
        }

        .loading-state {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 60vh;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 5px solid rgba(79, 70, 229, 0.1);
          border-top-color: #4f46e5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .error-state {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
          text-align: center;
        }

        .error-card {
          background: #ffffff;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          max-width: 500px;
          border-left: 4px solid #ef4444;
        }

        .error-title {
          color: #ef4444;
          margin-bottom: 1rem;
        }

        .retry-btn {
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .retry-btn:hover {
          background: #dc2626;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .forum-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .forum-title {
            font-size: 1.5rem;
          }
          
          .posts-container, .top-posts-container {
            padding: 1.5rem;
          }
          
          .top-posts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-state">
          <div className="error-card">
            <h2 className="error-title">Something went wrong</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
        
      ) : (
          <div className="forum-container">
            <br/><br/><br/><br/><br/><br/>
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
              <FiTrendingUp size={20} /> Most Active Discussions
            </h2>
            
            {topPostsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <div className="spinner"></div>
              </div>
            ) : topPostsError ? (
              <div style={{ color: '#ef4444', textAlign: 'center', padding: '1rem' }}>
                {topPostsError}
              </div>
            ) : (
              <div className="top-posts-grid">
                {topPosts.map(post => (
                  <div key={post._id} className="top-post-card">
                    <h3 className="top-post-title">{post.title}</h3>
                    <p style={{ color: '#4b5563', fontSize: '0.9375rem' }}>
                      {post.content.length > 100 
                        ? `${post.content.substring(0, 100)}...` 
                        : post.content}
                    </p>
                    <div className="top-post-meta">
                      
                      <span className="top-post-replies">
                        <FiMessageSquare size={14} /> {post.replyCount} replies
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