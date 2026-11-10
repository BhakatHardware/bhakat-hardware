import { createContext, useContext, useState, useCallback } from 'react';
import ImageModal from '../components/common/ImageModal';

const ImageModalContext = createContext({
  openImage: () => {},
  closeImage: () => {},
});

export const ImageModalProvider = ({ children }) => {
  const [modalData, setModalData] = useState({
    isOpen: false,
    src: '',
    title: '',
    subtitle: '',
  });

  const openImage = useCallback((src, title = '', subtitle = '') => {
    if (!src) return;
    setModalData({
      isOpen: true,
      src,
      title,
      subtitle,
    });
  }, []);

  const closeImage = useCallback(() => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ImageModalContext.Provider value={{ openImage, closeImage }}>
      {children}
      <ImageModal
        isOpen={modalData.isOpen}
        src={modalData.src}
        title={modalData.title}
        subtitle={modalData.subtitle}
        onClose={closeImage}
      />
    </ImageModalContext.Provider>
  );
};

export const useImageModal = () => useContext(ImageModalContext);

