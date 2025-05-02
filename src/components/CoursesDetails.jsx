import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TranslatedSubtitles from "./TranslatedSubtitles";
import axios from "axios";

const translations = {
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  ar: "ar-SA",
  en: "en-US",
};

const LessonDetailsFront = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");
  const [showStickyNotes, setShowStickyNotes] = useState(false);
  const [stickyNotes, setStickyNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 520, y: 350 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { lesson, moduleId } = location.state || {};

  const userId = localStorage.getItem("userId");

  const openStickyNoteModal = () => setShowStickyNotes(true);

  const closeStickyNoteModal = () => {
    console.log("🛑 Close button clicked");
    setShowStickyNotes(false);
    setNoteInput("");
    setEditIndex(null);
  };

  const handleTranslation = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setModalPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = translations[selectedLang] || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => window.speechSynthesis.cancel();

  useEffect(() => {
    const handleMouseMoveWrapper = (e) => handleMouseMove(e);
    const handleMouseUpWrapper = () => handleMouseUp();

    window.addEventListener("mousemove", handleMouseMoveWrapper);
    window.addEventListener("mouseup", handleMouseUpWrapper);

    return () => {
      window.removeEventListener("mousemove", handleMouseMoveWrapper);
      window.removeEventListener("mouseup", handleMouseUpWrapper);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    const fetchStickyNotes = async () => {
      if (!lesson?._id || !userId || !showStickyNotes) return;

      try {
        const res = await axios.get(
          `/api/stickynotes/${lesson._id}?userId=${userId}`
        );
        setStickyNotes(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch sticky notes:", err);
      }
    };

    fetchStickyNotes();
  }, [showStickyNotes]);

  const saveNote = async () => {
    if (!noteInput.trim()) return;

    if (!userId || userId === "undefined") {
      console.error("❌ userId is missing or invalid.");
      return alert("Login is required to add sticky notes.");
    }

    const payload = {
      userId,
      content: noteInput,
      position: { x: 0, y: 0 },
      color: "#FFEB3B",
    };

    try {
      if (editIndex !== null) {
        await axios.put(`/api/stickynotes/${lesson._id}/${editIndex}`, payload);
      } else {
        await axios.post(`/api/stickynotes/${lesson._id}`, payload);
      }

      const res = await axios.get(
        `/api/stickynotes/${lesson._id}?userId=${userId}`
      );
      setStickyNotes(res.data);
      setNoteInput("");
      setEditIndex(null);
    } catch (err) {
      console.error("❌ Save note failed", err.response?.data || err.message);
    }
  };

  const deleteNote = async (index) => {
    try {
      await axios.delete(
        `/api/stickynotes/${lesson._id}/${index}?userId=${userId}`
      );
      const res = await axios.get(
        `/api/stickynotes/${lesson._id}?userId=${userId}`
      );
      setStickyNotes(res.data);
    } catch (err) {
      console.error("Delete note failed", err);
    }
  };

  const editNote = (index) => {
    setNoteInput(stickyNotes[index].content);
    setEditIndex(index);
  };

  if (!lesson) {
    return (
      <div style={{ padding: "6rem 2rem" }}>
        <h2 style={{ color: "#ef4444" }}>{t("noLesson")}</h2>
        <button
          onClick={() =>
            navigate(
              `/moduleDetails/course/${
                moduleId || lesson.moduleId || lesson._id
              }`
            )
          }
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          {t("buttons.back")}
        </button>
      </div>
    );
  }

  const isVideo = lesson.typeLesson === "video";

  return (
    <div
      style={{
        paddingTop: "10rem",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "1rem",
          padding: "2.5rem",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937" }}>
          📘 {lesson.title}
        </h1>
        <div style={{ marginTop: "1rem", marginBottom: "1.5rem" }}>
          <button
            onClick={openStickyNoteModal}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            📝 Open Sticky Notes
          </button>
        </div>
        <p style={{ margin: "1rem 0", color: "#4b5563", fontSize: "1rem" }}>
          <strong>{t("type")}:</strong> {lesson.typeLesson.toUpperCase()}
        </p>

        {showStickyNotes && (
          <div
            style={{
              position: "fixed",
              top: `${modalPosition.y}px`,
              left: `${modalPosition.x}px`,
              backgroundColor: "#ffffff",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
              borderRadius: "1rem",
              zIndex: 1000,
              minWidth: "420px",
              maxWidth: "90vw",
              maxHeight: "80vh",
              overflowY: "auto",
              cursor: isDragging ? "grabbing" : "default",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              onMouseDown={handleMouseDown}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                fontWeight: 700,
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
              }}
            >
              📝 Drag me to move
              <button
                onClick={closeStickyNoteModal}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "0.375rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
                title="Close"
              >
                ✖
              </button>
            </div>

            {/* Content */}
            <h2
              style={{
                marginBottom: "1rem",
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1f2937",
              }}
            >
              🗒️ Your Sticky Notes
            </h2>

            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Write something here..."
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: "1px solid #d1d5db",
                fontSize: "1rem",
                resize: "vertical",
                backgroundColor: "#f9fafb",
              }}
            />

            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <button
                onClick={saveNote}
                style={{
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  border: "none",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
              >
                {editIndex !== null ? "✅ Update" : "➕ Add Note"}
              </button>
            </div>

            <ul style={{ marginTop: "2rem", padding: 0 }}>
              {stickyNotes.map((note, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: "#fef3c7",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "0.75rem",
                    listStyle: "none",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      marginBottom: "0.5rem",
                      fontSize: "1rem",
                      color: "#374151",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {note.content}
                  </p>
                  <small style={{ color: "#6b7280" }}>
                    🕒 Updated: {new Date(note.updatedAt).toLocaleString()}
                  </small>
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      display: "flex",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => editNote(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#3b82f6",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      title="Edit note"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteNote(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        fontSize: "1rem",
                        cursor: "pointer",
                      }}
                      title="Delete note"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: "2rem" }}>
          {isVideo ? (
            <>
              <video
                controls
                width="100%"
                crossOrigin="anonymous"
                style={{ borderRadius: "0.5rem" }}
              >
                <source src={lesson.fileUrl} type="video/mp4" />
              </video>
              <TranslatedSubtitles
                lessonId={lesson._id || lesson.id}
                selectedLang={selectedLang}
                speakText={speakText}
                stopSpeech={stopSpeech}
                fileUrl={lesson.fileUrl}
              />
            </>
          ) : (
            <iframe
              src={lesson.fileUrl}
              title="Lesson Preview"
              width="100%"
              height="400px"
              style={{ border: "1px solid #ccc", borderRadius: "0.5rem" }}
            />
          )}
        </div>

        <button
          onClick={() => {
            const modId =
              moduleId || lesson.moduleId || lesson.module || lesson._id;
            console.log("Going back to module:", modId); // DEBUG
            navigate(`/moduleDetails/course/${modId}`);
          }}
          style={{
            backgroundColor: "#4ade80",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          {t("buttons.back")}
        </button>
      </div>
    </div>
  );
};

export default LessonDetailsFront;
