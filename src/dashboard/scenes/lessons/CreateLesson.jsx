import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateLesson = () => {
  const { id: moduleId } = useParams(); // get module ID from URL
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    typeLesson: "pdf",
    fileUrl: "",
    public_id: "",
    LMScontent: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("🔍 Submitting lesson data:", {
        ...lessonData,
        module: moduleId,
      });

      await axios.post("http://localhost:3000/lesson", {
        ...lessonData,
        module: moduleId,
      });
      alert("Lesson added successfully!");
      navigate(`/moduleDetails/${moduleId}`);
    } catch (err) {
      console.error("Error adding lesson:", err);
      setError("Failed to add lesson. Please check your input.");
    }
  };

  return (
    <div
      className="container"
      style={{ paddingTop: "100px", maxWidth: "700px" }}
    >
      <h2>Add Lesson to Module</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            name="title"
            value={lessonData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            name="content"
            rows={3}
            value={lessonData.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            className="form-control"
            name="typeLesson"
            value={lessonData.typeLesson}
            onChange={handleChange}
            required
          >
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="photo">Photo</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">File URL</label>
          <input
            className="form-control"
            name="fileUrl"
            value={lessonData.fileUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Public ID (optional)</label>
          <input
            className="form-control"
            name="public_id"
            value={lessonData.public_id}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">LMS Content (optional)</label>
          <textarea
            className="form-control"
            name="LMScontent"
            rows={2}
            value={lessonData.LMScontent}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success" type="submit">
          Save Lesson
        </button>
        <button
          className="btn btn-secondary ms-2"
          type="button"
          onClick={() => navigate(`/moduleDetails/${moduleId}`)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateLesson;
