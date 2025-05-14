import React, { useState } from 'react';
import axios from 'axios';

const GenerateResume = () => {
  const [state, setState] = useState({
    loading: false,
    resumeLink: '',
    error: '',
    selectedFile: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setState(prev => ({
          ...prev,
          error: 'Please upload a PDF file',
          selectedFile: null
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setState(prev => ({
          ...prev,
          error: 'File size must be less than 5MB',
          selectedFile: null
        }));
        return;
      }
      
      setState(prev => ({
        ...prev,
        selectedFile: file,
        error: ''
      }));
    }
  };
  
  const handleDownload = async () => {
    try {
      const url = `https://edunova-back-rqxc.onrender.com${state.resumeLink}`; // Full URL to backend
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch PDF');
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = state.resumeLink.split('/').pop() || 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to download resume' 
      }));
    }
  };
  

  
  const generateResume = async () => {
    if (!state.selectedFile) {
      setState(prev => ({ ...prev, error: 'Please select a PDF file' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));
    
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('pdf', state.selectedFile);
      formData.append('userId', userId);

      // Correct endpoint for resume generation
      const response = await axios.post('https://edunova-back-rqxc.onrender.com/api/gemini/generate-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.data.file) {
        throw new Error('No file URL returned from server');
      }

      setState(prev => ({
        ...prev,
        loading: false,
        resumeLink: response.data.file
      }));

    } catch (error) {
      let errorMsg = 'Failed to generate resume';
      
      if (error.response) {
        errorMsg = error.response.data.error || error.response.statusText;
      } else if (error.request) {
        errorMsg = 'No response from server';
      } else {
        errorMsg = error.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMsg
      }));
    }
  };

  return (
    <div className="generate-resume p-3" style={{ maxWidth: '500px' }}>
      <h2 className="mb-3">Generate Enhanced Resume</h2>
      
      <div className="mb-3">
        <label className="form-label d-block">
          Upload your current resume (PDF, max 5MB):
          <input 
            type="file" 
            className="form-control mt-2"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={state.loading}
          />
        </label>
        {state.selectedFile && (
          <div className="mt-2 text-muted">
            Selected: {state.selectedFile.name} 
            ({(state.selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}
      </div>

      <button 
        onClick={generateResume} 
        disabled={state.loading || !state.selectedFile}
        className="btn btn-primary w-100"
      >
        {state.loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Generating...
          </>
        ) : 'Generate Enhanced Resume'}
      </button>

      {state.error && (
        <div className="alert alert-danger mt-3 mb-0">
          {state.error}
        </div>
      )}
      
      {state.resumeLink && (
  <div className="mt-3 text-center">
    <div className="alert alert-success">
      Your enhanced resume is ready!
    </div>
    <div className="d-flex gap-2 justify-content-center">
      <button
        onClick={() => window.open(state.resumeLink, '_blank')}
        className="btn btn-primary"
      >
        <i className="bi bi-eye me-2" />
        View Resume
      </button>
      <button
        onClick={handleDownload}
        className="btn btn-success"
      >
        <i className="bi bi-download me-2" />
        Download
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default GenerateResume;