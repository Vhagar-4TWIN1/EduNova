import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaArrowLeft, FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";

const AddSupplementaryLesson = () => {
  const { id: moduleId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    resourceUrl: "",
    type: "video",
    duration: 0,
    platform: "", // Ajouté pour les vidéos
    difficulty: "", // Ajouté pour les exercices
    file: null // Ajouté pour les fichiers PDF
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const getPlaceholderByType = (type) => {
    switch(type) {
      case 'video': return 'https://youtube.com/...';
      case 'article': return 'https://medium.com/...';
      case 'exercise': return 'https://exercism.org/...';
      case 'pdf': return 'Nom du fichier PDF';
      default: return 'https://example.com/...';
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation côté client
  if (formData.type !== 'pdf' && !formData.resourceUrl) {
    alert("Resource URL is required for this type");
    return;
  }
  if (formData.type === 'pdf' && !formData.file) {
    alert("Please upload a PDF file");
    return;
  }

  setLoading(true);
  
  try {
    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('content', formData.content);
    formPayload.append('type', formData.type);
    formPayload.append('duration', formData.duration);

    // Ajoutez les champs conditionnels
    if (formData.platform) formPayload.append('platform', formData.platform);
    if (formData.difficulty) formPayload.append('difficulty', formData.difficulty);
    
    // Gestion des fichiers vs URLs
    if (formData.type === 'pdf') {
      formPayload.append('file', formData.file);
    } else {
      formPayload.append('resourceUrl', formData.resourceUrl);
    }

    const response = await axios.post(
      `https://edunova-back-rqxc.onrender.com/api/study/supplementary/${moduleId}`,
      formPayload,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.status === 201) {
      navigate(`/moduleDetails/${moduleId}`);
    }
  } catch (err) {
    console.error("Full error details:", {
      request: err.config,
      response: err.response?.data,
      status: err.response?.status
    });
    alert(`Error: ${err.response?.data?.message || err.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6 overflow-y-auto max-h-[80vh]">
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(`/moduleDetails/${moduleId}`)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="text-blue-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            Add Supplementary Lesson
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Content Description</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="exercise">Exercise</option>
              <option value="pdf">PDF Document</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formData.type === 'video' && (
            <div>
              <label className="block text-gray-700 mb-1">Video Platform</label>
              <select 
                name="platform"
                className="w-full p-2 border rounded"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="">Select platform</option>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          {formData.type === 'exercise' && (
            <div>
              <label className="block text-gray-700 mb-1">Difficulty Level</label>
              <select 
                name="difficulty"
                className="w-full p-2 border rounded"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="">Select difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          )}

          {formData.type === 'pdf' ? (
            <div>
              <label className="block text-gray-700 mb-1">PDF File</label>
              <div className="flex items-center">
                <FaFilePdf className="mr-2 text-red-500" />
                <input
                  type="file"
                  name="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload a PDF document (max 10MB)
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 mb-1">Resource URL</label>
              <div className="flex items-center">
                <FaExternalLinkAlt className="mr-2 text-gray-500" />
                <input
                  type="url"
                  name="resourceUrl"
                  value={formData.resourceUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder={getPlaceholderByType(formData.type)}
                  required={formData.type !== 'pdf'}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.type === 'video' && 'Link to YouTube or other video platform'}
                {formData.type === 'article' && 'Link to article or document'}
                {formData.type === 'exercise' && 'Link to exercise platform'}
                {formData.type === 'other' && 'Link to resource'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/moduleDetails/${moduleId}`)}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <FaPlus className="mr-2" />
                  Add Lesson
                </>
              )}
            </button>
          </div>
        </form>
      </div>
        </div>
    </div>
  </div>
    </div>
  );
};

export default AddSupplementaryLesson;