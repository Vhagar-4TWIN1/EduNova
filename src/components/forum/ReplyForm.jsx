import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiMic, FiStopCircle, FiTrash2, FiEdit2 } from 'react-icons/fi';

const ReplyForm = ({ postId, onReplyAdded }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [replyMode, setReplyMode] = useState(null); // 'text' or 'voice'
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setContent(''); // Clear any text content
      setReplyMode('voice');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setReplyMode(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  const switchToTextMode = () => {
    deleteRecording();
    setReplyMode('text');
  };

  const switchToVoiceMode = () => {
    setContent('');
    setReplyMode('voice');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((replyMode === 'text' && !content.trim()) || 
        (replyMode === 'voice' && !audioBlob)) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      let response;
      
      if (replyMode === 'voice') {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        formData.append('author', localStorage.getItem('userId'));
        console.log(postId);
        
        response = await axios.post(
          `http://localhost:3000/api/forum/posts/${postId}/reply/audio`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        response = await axios.post(
          `http://localhost:3000/api/forum/posts/${postId}/reply`,
          { content }
        );
      }

      onReplyAdded(response.data);
      setContent('');
      deleteRecording();
      setReplyMode(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Your message is Toxic ');
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

        .audio-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
          align-items: center;
        }

        .audio-preview {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .audio-preview audio {
          flex-grow: 1;
        }

        .recording-indicator {
          display: flex;
          align-items: center;
          color: #ef4444;
          font-size: 0.875rem;
        }

        .recording-dot {
          width: 8px;
          height: 8px;
          background-color: #ef4444;
          border-radius: 50%;
          margin-right: 6px;
          animation: pulse 1.5s infinite;
        }

        .mode-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .mode-button {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #f3f4f6;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-button.active {
          background-color: #3b82f6;
          color: white;
        }

        .mode-button:not(.active):hover {
          background-color: #e5e7eb;
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .record-button {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          background-color: ${isRecording ? '#ef4444' : '#f3f4f6'};
          color: ${isRecording ? 'white' : '#1f2937'};
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .record-button:hover:not(:disabled) {
          background-color: ${isRecording ? '#dc2626' : '#e5e7eb'};
        }

        .delete-button {
          display: flex;
          align-items: center;
          padding: 8px;
          background-color: #f3f4f6;
          color: #ef4444;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-button:hover {
          background-color: #fee2e2;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
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
          
          .char-counter {
            color: #94a3b8;
          }

          .mode-button {
            background-color: #374151;
            color: #f3f4f6;
          }

          .mode-button.active {
            background-color: #3b82f6;
          }

          .mode-button:not(.active):hover {
            background-color: #4b5563;
          }

          .record-button {
            background-color: ${isRecording ? '#ef4444' : '#374151'};
            color: ${isRecording ? 'white' : '#f3f4f6'};
          }

          .record-button:hover:not(:disabled) {
            background-color: ${isRecording ? '#dc2626' : '#4b5563'};
          }

          .delete-button {
            background-color: #374151;
            color: #fca5a5;
          }

          .delete-button:hover {
            background-color: rgba(220, 38, 38, 0.2);
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
          <div className="mode-selector">
            <button
              type="button"
              className={`mode-button ${replyMode === 'text' ? 'active' : ''}`}
              onClick={() => setReplyMode('text')}
            >
              <FiEdit2 className="icon" />
              
            </button>
            <button
              type="button"
              className={`mode-button ${replyMode === 'voice' ? 'active' : ''}`}
              onClick={switchToVoiceMode}
            >
              <FiMic className="icon" />
              
            </button>
          </div>

          {replyMode === 'text' && (
            <div className="textarea-container">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="reply-textarea"
                rows="4"
                placeholder="Share your thoughts..."
              />
              <div className="char-counter">{content.length}/500</div>
            </div>
          )}

          {replyMode === 'voice' && (
            <div className="audio-controls">
              {!isRecording && !audioUrl ? (
                <button
                  type="button"
                  className="record-button"
                  onClick={startRecording}
                  disabled={isSubmitting}
                >
                  <FiMic className="icon" />
                  Start Recording
                </button>
              ) : isRecording ? (
                <>
                  <div className="recording-indicator">
                    <span className="recording-dot"></span>
                    Recording...
                  </div>
                  <button
                    type="button"
                    className="record-button"
                    onClick={stopRecording}
                  >
                    <FiStopCircle className="icon" />
                    Stop Recording
                  </button>
                </>
              ) : (
                <div className="audio-preview">
                  <audio controls src={audioUrl} />
                  <button
                    type="button"
                    className="delete-button"
                    onClick={deleteRecording}
                    disabled={isSubmitting}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="form-footer">
            <div className="format-info">
              {replyMode === 'text' && "Type your reply"}
              {replyMode === 'voice' && (audioUrl ? "Voice message ready" : "Record a voice message")}
              {!replyMode && "Select reply type"}
            </div>
            <button
              type="submit"
              className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting || 
                (replyMode === 'text' && !content.trim()) || 
                (replyMode === 'voice' && !audioUrl) ||
                !replyMode}
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