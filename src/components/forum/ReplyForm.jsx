import { useState } from 'react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';

const ReplyForm = ({ postId, onReplyAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(`http://localhost:3000/api/forum/posts/${postId}/reply`, {
        content
      });

      onReplyAdded(response.data);
      setContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .reply-form {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 24px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }

        .reply-form:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .reply-form-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
        }

        .title-indicator {
          display: inline-block;
          width: 6px;
          height: 6px;
          background-color: #3b82f6;
          border-radius: 50%;
          margin-right: 8px;
        }

        .reply-error {
          background-color: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 0 6px 6px 0;
        }

        .reply-error p {
          font-size: 0.875rem;
          color: #dc2626;
          margin: 0;
        }

        .textarea-container {
          position: relative;
          margin-bottom: 16px;
        }

        .reply-textarea {
          width: 100%;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9375rem;
          color: #1f2937;
          background-color: #ffffff;
          resize: none;
          min-height: 120px;
          transition: all 0.2s ease;
        }

        .reply-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .char-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .format-info {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .submit-button {
          display: flex;
          align-items: center;
          padding: 10px 20px;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-button.submitting {
          background-color: #60a5fa;
        }

        .icon {
          margin-right: 8px;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 8px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .reply-form {
            background-color: #1e293b;
            border-color: #334155;
          }
          
          .reply-form-title {
            color: #f8fafc;
          }
          
          .reply-error {
            background-color: rgba(220, 38, 38, 0.1);
            border-left-color: #f87171;
          }
          
          .reply-error p {
            color: #fca5a5;
          }
          
          .reply-textarea {
            background-color: #1e293b;
            border-color: #334155;
            color: #f8fafc;
          }
          
          .char-counter,
          .format-info {
            color: #94a3b8;
          }
        }
      `}</style>

      <div className="reply-form">
        <h3 className="reply-form-title">
          <span className="title-indicator"></span>
          Add Your Reply
        </h3>
        
        {error && (
          <div className="reply-error">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="textarea-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="reply-textarea"
              rows="4"
              placeholder="Share your thoughts..."
              required
            />
            <div className="char-counter">{content.length}/500</div>
          </div>

          <div className="form-footer">
            <div className="format-info">Markdown supported</div>
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting || !content.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Posting...
                </>
              ) : (
                <>
                  <FiSend className="icon" />
                  Post Reply
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReplyForm;