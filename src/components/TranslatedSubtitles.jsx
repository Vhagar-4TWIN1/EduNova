import React, { useState, useEffect } from "react";

const TranslatedSubtitles = ({
  lessonId,
  selectedLang,
  speakText,
  stopSpeech,
  fileUrl,
}) => {
  const [lines, setLines] = useState([]);
  const [isTranslating, setIsTranslating] = useState(true);

  useEffect(() => {
    const fetchTranscript = async () => {
      if (!lessonId || !fileUrl) return;

      try {
        setIsTranslating(true);
        setLines([]);

        const endpoint = `/api/subtitles/${lessonId}/${selectedLang}?url=${encodeURIComponent(
          fileUrl
        )}`;
        const response = await fetch(endpoint);

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Unexpected response format");
        }

        const data = await response.json();
        const text = selectedLang === "en" ? data.transcript : data.translated;

        setLines(text.split(/\r?\n/).filter(Boolean));
        setIsTranslating(false);
      } catch (err) {
        console.error("❌ Failed to fetch subtitles:", err);
        setLines(["⚠️ Error fetching subtitles."]);
        setIsTranslating(false);
      }
    };

    fetchTranscript();
  }, [lessonId, selectedLang, fileUrl]);

  return (
    <div style={{ marginTop: "1rem" }}>
      <strong>🎬 Translated Subtitles:</strong>
      <div
        style={{
          background: "#eef2ff",
          padding: "1rem",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          color: "#1e40af",
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {isTranslating ? (
          <p>⏳ Translating...</p>
        ) : (
          lines.map((line, i) => <p key={i}>{line}</p>)
        )}
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <button
          onClick={() => speakText(lines.join(" "))}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
            marginRight: "1rem",
          }}
        >
          🔊 Read Aloud
        </button>
        <button
          onClick={stopSpeech}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "0.6rem 1.2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          🛑 Stop
        </button>
      </div>
    </div>
  );
};

export default TranslatedSubtitles;
