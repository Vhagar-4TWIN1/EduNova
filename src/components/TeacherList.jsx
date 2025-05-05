import React, { useEffect, useState } from "react";
import axios from "axios";
import TeacherModal from "./TeacherModal";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/api/users").then((res) => {
      const filtered = res.data.users.filter((u) => u.role === "Teacher");
      setTeachers(filtered);
    });
  }, []);

  const styles = `
  .teacher-grid {
    padding-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 90px;
    justify-items: center;
  }

  .teacher-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 140px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
    cursor: pointer;
  }

  .teacher-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .teacher-img-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid #4f46e5;
    margin-bottom: 8px;
  }

  .teacher-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .teacher-name {
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }
`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <h2 className="text-3xl font-bold text-center mb-8">Our Teachers</h2>
      <div
        className="teacher-grid"
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "8rem",
        }}
      >
        {teachers.map((teacher) =>
          teacher.photo ? (
            <div
              key={teacher._id}
              className="teacher-card"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="teacher-img-wrapper">
                <img
                  src={`http://localhost:3000/${teacher.photo}`}
                  alt={teacher.firstName}
                  className="teacher-img"
                />
              </div>
              <p className="teacher-name">{teacher.firstName}</p>
            </div>
          ) : null
        )}
      </div>

      {selectedTeacher && (
        <TeacherModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
    </div>
  );
};

export default TeacherList;
