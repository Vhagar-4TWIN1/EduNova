import React from 'react';
import { motion } from 'framer-motion';
import './Card.css';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  hover: { boxShadow: '0 12px 24px rgba(0,0,0,0.15)', y: -6 },
};

const Card = ({ img, title, description = '', badge, footer, mediaPoster }) => {
  const url = img || '';
  const ext = url.split('.').pop().split('?')[0].toLowerCase();
  let type = 'image';
  if (['mp4','webm','ogg'].includes(ext)) type = 'video';
  else if (['mp3','wav','aac','m4a','flac'].includes(ext)) type = 'audio';
  else if (ext === 'pdf') type = 'pdf';

  const sentences = description
    .trim()
    .match(/[^\.!\?]+[\.!\?]+/g) || [description];
  const useList = sentences.length > 3;
  const displayItems = useList ? sentences.slice(0, 3) : [description];

  return (
    <motion.div
      className="edn-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {url && (
        <div className="edn-card-media-wrap">
          {type === 'video' && (
            <video
              className="edn-card-video"
              src={url}
              poster={mediaPoster}
              controls
            />
          )}
          {type === 'audio' && (
            <audio className="edn-card-audio" src={url} controls />
          )}
          {type === 'pdf' && (
            <object
              className="edn-card-pdf"
              data={url}
              type="application/pdf"
            >
              <a href={url} target="_blank" rel="noopener">
                View PDF
              </a>
            </object>
          )}
          {type === 'image' && (
            <>
              <motion.img
                src={url}
                alt={title}
                className="edn-card-img"
                variants={{ hover: { scale: 1.1 } }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                className="edn-card-img-overlay"
                variants={{ hover: { opacity: 1 } }}
                transition={{ duration: 0.3 }}
              >
                <i className="bi bi-play-circle-fill overlay-icon" />
              </motion.div>
            </>
          )}
        </div>
      )}

      <div className="edn-card-body">
        {badge && <span className="edn-card-badge">{badge}</span>}
        <h5 className="edn-card-title">{title}</h5>
        {useList ? (
          <ul className="edn-card-list">
            {displayItems.map((s, i) => (
              <li key={i}>{s.trim()}</li>
            ))}
          </ul>
        ) : (
          <p className="edn-card-text">{description}</p>
        )}
      </div>

      {footer && <div className="edn-card-footer">{footer}</div>}
    </motion.div>
  );
};

export default Card;
