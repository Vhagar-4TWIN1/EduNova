import { Link } from 'react-router-dom';
import { FiMessageSquare, FiUser, FiClock, FiArrowRight, FiPlus, FiStar } from 'react-icons/fi';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PostList = ({ posts }) => {
  const safePosts = Array.isArray(posts) ? posts : [];
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/forum/recommended',
           {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
        );
        setRecommendedPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch recommended posts', error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommendedPosts();
  }, []);

  return (
    <>
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

        .post-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .post-card {
          background: var(--bg-card);
          padding: 1.75rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-md);
          transition: var(--transition);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.03);
        }

        .post-card::before {
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

        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          background: var(--bg-hover);
        }

        .post-card:hover::before {
          opacity: 1;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 0.75rem;
          transition: var(--transition);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .post-title:hover {
          color: var(--primary);
        }

        .post-title-text {
          flex: 1;
        }

        .post-arrow {
          opacity: 0;
          transform: translateX(-5px);
          transition: var(--transition);
          color: var(--primary);
        }

        .post-card:hover .post-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .post-content {
          color: var(--text-light);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-light);
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition);
        }

        .meta-item:hover {
          color: var(--primary);
        }

        .meta-item svg {
          flex-shrink: 0;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--bg-card);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          margin: 2rem 0;
        }

        .empty-icon {
          font-size: 3rem;
          color: var(--primary-light);
          margin-bottom: 1.5rem;
          opacity: 0.7;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .empty-message {
          color: var(--text-light);
          font-size: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-action {
          margin-top: 1.5rem;
        }

        .empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
        }

        .empty-btn:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        @media (max-width: 768px) {
          .post-card {
            padding: 1.5rem;
          }
          
          .post-title {
            font-size: 1.15rem;
          }
          
          .post-meta {
            gap: 1rem;
          }
        }

        /* Animation for post cards */
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

        .post-card {
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .post-card:nth-child(1) { animation-delay: 0.1s; }
        .post-card:nth-child(2) { animation-delay: 0.2s; }
        .post-card:nth-child(3) { animation-delay: 0.3s; }
        .post-card:nth-child(4) { animation-delay: 0.4s; }
        .post-card:nth-child(5) { animation-delay: 0.5s; }
        .post-card:nth-child(6) { animation-delay: 0.6s; }

        /* New styles for recommended section */
        .recommended-section {
          margin-bottom: 3rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .section-icon {
          color: var(--primary);
        }

        .loading-spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(99, 102, 241, 0.3);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div>
        {/* Recommended Posts Section */}
        <div className="recommended-section">
          <div className="section-header">
            <FiStar className="section-icon" />
            <h2 className="section-title">Recommended For You</h2>
          </div>
          
          {loadingRecommended ? (
            <div className="post-card" style={{ textAlign: 'center', padding: '2rem' }}>
              <span className="loading-spinner"></span>
              Loading recommendations...
            </div>
          ) : recommendedPosts.length > 0 ? (
            <div className="post-list">
              {recommendedPosts.map((post) => (
                <Link to={`/forum/posts/${post._id}`} key={post._id} className="post-card">
                  <div>
                    <h2 className="post-title">
                      <span className="post-title-text">{post.title}</span>
                      <FiArrowRight className="post-arrow" />
                    </h2>
                    <p className="post-content">{post.content}</p>
                    <div className="post-meta">
                      <div className="meta-item">
                        <FiUser />
                        <span>{post.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="meta-item">
                        <FiClock />
                        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="meta-item">
                        <FiMessageSquare />
                        <span>{post.replies?.length || 0} {post.replies?.length === 1 ? 'reply' : 'replies'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="post-card" style={{ textAlign: 'center', padding: '2rem' }}>
              No recommendations available. please enroll in modules to get recommendations.
            </div>
          )}
        </div>

        {/* All Posts Section */}
        <div>
          <div className="section-header">
            <FiMessageSquare className="section-icon" />
            <h2 className="section-title">All Discussions</h2>
          </div>
          
          <div className="post-list">
            {safePosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FiMessageSquare />
                </div>
                <h3 className="empty-title">No discussions yet</h3>
                <p className="empty-message">
                  Be the first to start a conversation in our community forum.
                </p>
                <div className="empty-action">
                  <Link to="/forum/new" className="empty-btn">
                    <FiPlus /> Create Post
                  </Link>
                </div>
              </div>
            ) : (
              safePosts.map((post) => (
                <Link to={`/forum/posts/${post._id}`} key={post._id} className="post-card">
                  <div>
                    <h2 className="post-title">
                      <span className="post-title-text">{post.title}</span>
                      <FiArrowRight className="post-arrow" />
                    </h2>
                    <p className="post-content">{post.content}</p>
                    <div className="post-meta">
                      <div className="meta-item">
                        <FiUser />
                        <span>{post.author?.name || 'Anonymous'}</span>
                      </div>
                      <div className="meta-item">
                        <FiClock />
                        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="meta-item">
                        <FiMessageSquare />
                        <span>{post.replies?.length || 0} {post.replies?.length === 1 ? 'reply' : 'replies'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostList;