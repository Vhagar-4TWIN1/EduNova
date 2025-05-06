import { motion } from 'framer-motion';

const Card = ({ img, title, description = '', badge, footer }) => {
  const sentences = description
    .trim()
    .match(/[^\.!\?]+[\.!\?]+/g)    
    || [description];

  const useList = sentences.length > 3;
  const displayItems = useList ? sentences.slice(0, 3) : [description];

  return (
    <motion.div
      className="card h-auto w-100 shadow-sm border-0"
      whileHover={{ y: -5, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {img && (
        <div
          className="card-img-top-wrapper"
          style={{
            overflow: 'hidden',
            height: '50vh',
            borderTopLeftRadius: '.25rem',
            borderTopRightRadius: '.25rem',
          }}
        >
          <img
            src={img}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      <div className="card-body d-flex flex-column">
        {badge && <span className="badge bg-primary mb-2">{badge}</span>}
        <h5 className="fw-semibold mb-2">{title}</h5>

        {useList ? (
          <ul className="text-muted small" style={{ paddingLeft: '1rem' }}>
            {displayItems.map((sent, idx) => (
              <li key={idx}>{sent.trim()}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted small flex-grow-1">{description}</p>
        )}
      </div>

      {footer && (
        <div className="card-footer bg-white d-flex justify-content-between small text-muted">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default Card;
