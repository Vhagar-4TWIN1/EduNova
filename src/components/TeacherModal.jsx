import React from "react";

const TeacherModal = ({ teacher, onClose }) => {
  const styles = `
    .modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }

    .modal-content {
      background-color: #fff;
      border-radius: 16px;
      padding: 24px 32px;
      max-width: 400px;
      width: 90%;
      position: relative;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      font-family: sans-serif;
    }

    .close-button {
      position: absolute;
      top: 12px;
      right: 16px;
      background: none;
      border: none;
      font-size: 20px;
      color: #555;
      cursor: pointer;
    }

    .close-button:hover {
      color: #000;
    }

    .teacher-img1 {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 16px auto;
      border: 3px solid #4f46e5;
    }

    .teacher-name {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 4px;
    }

    .teacher-email {
      text-align: center;
      color: #666;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .teacher-detail {
      font-size: 14px;
      color: #333;
      margin-bottom: 6px;
    }

    .teacher-more {
      font-style: italic;
      font-size: 13px;
      color: #999;
      margin-top: 12px;
      text-align: center;
    }
  `;

  return (
    <div className="modal-overlay">
      <style>{styles}</style>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <img
          src={`https://edunova-back-rqxc.onrender.com/${teacher.photo}`}
          alt={teacher.firstName}
          className="teacher-img1"
        />
        <div className="teacher-name">
          {teacher.firstName} {teacher.lastName}
        </div>
        <div className="teacher-email">{teacher.email}</div>
        <div className="teacher-detail">Country: {teacher.country}</div>
        <div className="teacher-detail">Age: {teacher.age}</div>
        <div className="teacher-more">More info will appear here...</div>
      </div>
    </div>
  );
};

export default TeacherModal;
