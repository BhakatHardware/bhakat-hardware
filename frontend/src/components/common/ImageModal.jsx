import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

export default function ImageModal({ isOpen, onClose, src, title, subtitle }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              maxWidth: '92vw',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              zIndex: 1,
            }}
          >
            {/* Header bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 18px',
                borderBottom: '1px solid var(--color-border)',
                background: '#ffffff',
                gap: 16,
              }}
            >
              <div style={{ minWidth: 0 }}>
                {title ? (
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-dark)',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {title}
                  </h3>
                ) : (
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-ash)' }}>
                    Image Preview
                  </span>
                )}
                {subtitle && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 2 }}>
                    {subtitle}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  title="Open original image in new tab"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.75rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    borderRadius: 8,
                    color: 'var(--color-ash)',
                    textDecoration: 'none',
                  }}
                >
                  <ExternalLink size={14} />
                  <span className="hidden sm:inline">Open Full Size</span>
                </a>

                <button
                  onClick={onClose}
                  className="btn-ghost"
                  title="Close (Esc)"
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-dark)',
                    background: 'var(--color-surface)',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Image display */}
            <div
              style={{
                padding: 16,
                background: '#090d16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={src}
                alt={title || 'Enlarged view'}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(80vh - 80px)',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

