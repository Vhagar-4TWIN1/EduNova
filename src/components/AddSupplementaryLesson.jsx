// AddSupplementaryLesson.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AddSupplementaryLesson = ({ moduleId, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    resourceUrl: '',
    type: 'video',
    duration: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/study/recommendations/${moduleId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      onAdd(res.data);
      setFormData({
        title: '',
        content: '',
        resourceUrl: '',
        type: 'video',
        duration: ''
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add supplementary lesson');
    }
  };

  return (
    <div className="add-supplementary-form">
      <h4>Add New Supplementary Resource</h4>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Resource URL:</label>
          <input
            type="url"
            name="resourceUrl"
            value={formData.resourceUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="exercise">Exercise</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Duration (minutes):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Resource
        </button>
      </form>
    </div>
  );
};

export default AddSupplementaryLesson;