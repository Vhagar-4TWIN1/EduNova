import { useState } from 'react';
import axios from 'axios';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
  'http://localhost:3000/api/forum/posts',
  { title, content },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }
);

      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setTags('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }
        
        .modal-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          margin: 0 20px;
          transform: translateY(0);
          animation: slideUp 0.3s ease;
        }
        
        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .error-alert {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 0 8px 8px 0;
        }
        
        .error-message {
          color: #dc2626;
          font-size: 0.875rem;
          margin: 0;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }
        
        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9375rem;
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .form-textarea {
          min-height: 150px;
          resize: vertical;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid #f0f0f0;
        }
        
        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-secondary {
          background: white;
          border: 1px solid #e5e7eb;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #f9fafb;
        }
        
        .btn-primary {
          background: #4f46e5;
          color: white;
          border: none;
        }
        
        .btn-primary:hover {
          background: #4338ca;
        }
        
        .btn-primary:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }
        
        .input-description {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 4px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0.8; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="modal-title">Create New Post</h2>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="error-alert">
                <p className="error-message">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  required
                  maxLength={100}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-input form-textarea"
                  required
                  maxLength={2000}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="tags" className="form-label">Tags</label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="form-input"
                  placeholder="e.g., javascript,react,mern"
                  maxLength={100}
                />
                <p className="input-description">Enter tags separated by commas (e.g., javascript, react, mern)</p>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Posting...
                    </>
                  ) : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePostModal;