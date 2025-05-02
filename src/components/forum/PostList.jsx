import { Link } from 'react-router-dom';
import { FiMessageSquare, FiUser, FiClock } from 'react-icons/fi';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const PostList = ({ posts }) => {
  const safePosts = Array.isArray(posts) ? posts : [];

  return (
    <>
      <style>{`
        .post-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .post-card {
          background: #fff;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: transform 0.2s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(0, 0, 0, 0.08);
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
          transition: color 0.2s ease;
        }

        .post-title:hover {
          color: #3b82f6;
        }

        .post-content {
          color: #6b7280;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #6b7280;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .empty-message {
          text-align: center;
          color: #9ca3af;
          padding: 4rem 0;
          font-size: 1.1rem;
        }
      `}</style>

      <div className="post-list">
        {safePosts.length === 0 ? (
          <div className="empty-message">
            No posts yet. Be the first to start a discussion!
          </div>
        ) : (
          safePosts.map((post) => (
            <Link to={`/forum/posts/${post._id}`} key={post._id} className="post-card">
              <h2 className="post-title">{post.title}</h2>
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
                  <span>{post.replies?.length || 0} replies</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default PostList;
