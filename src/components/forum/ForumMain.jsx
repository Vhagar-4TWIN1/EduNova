import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';
import CreatePostModal from './CreatePostModal';
import PostList from './PostList';

const ForumMain = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/forum/posts');
        setPosts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch posts');
        setIsLoading(false);
      }
    };

    fetchPosts();
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
          
          .posts-container {
            padding: 1.5rem;
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
          <header className="forum-header">
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
            <h1 className="forum-title">
              <FiMessageSquare size={28} /> Community Forum
            </h1>
            <button className="new-post-btn" onClick={() => setIsModalOpen(true)}>
              <FiPlus size={18} /> New Post
            </button>
          </header>

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
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
    </>
  );
};

export default ForumMain;