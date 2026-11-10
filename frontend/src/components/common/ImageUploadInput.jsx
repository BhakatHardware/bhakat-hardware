import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Camera, Image as ImageIcon, Trash2, Loader2, Video, X } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import { useImageModal } from '../../context/ImageModalContext';

export function ImageUploadInput({
  value,
  onChange,
  label = 'Product Image',
  disabled = false,
  helperText = 'Upload via Cloudinary (Camera or Gallery)',
}) {
  const { openImage } = useImageModal();
  const [uploading, setUploading] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoRef = useRef(null);

  // Upload file to backend /api/upload (which uploads to Cloudinary)
  const uploadFile = async (file) => {
    if (!file) return;

    // Validate size (max 12MB)
    if (file.size > 12 * 1024 * 1024) {
      toast.error('Image is too large. Max allowed size is 12MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    const toastId = toast.loading('Uploading image to Cloudinary...');

    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data.imageUrl;
      onChange(url);

      if (res.data.provider === 'cloudinary') {
        toast.success('Photo uploaded to Cloudinary!', { id: toastId });
      } else {
        toast.success('Photo saved locally (offline mode).', { id: toastId });
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload photo.', { id: toastId });
    } finally {
      setUploading(false);
      // Reset inputs so selecting the same photo again fires onChange
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  // Trigger Native Camera on Mobile (or file capture)
  const handleCameraClick = () => {
    if (disabled || uploading) return;
    cameraInputRef.current?.click();
  };

  // Trigger Gallery / Files Picker
  const handleGalleryClick = () => {
    if (disabled || uploading) return;
    galleryInputRef.current?.click();
  };

  // Optional Live Webcam for PC/Laptop
  const startWebcam = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error('Webcam is not supported in this browser.');
      return;
    }
    try {
      setWebcamOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      toast.error('Unable to access camera: ' + (err.message || 'Permission denied'));
      stopWebcam();
    }
  };

  const stopWebcam = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setWebcamOpen(false);
  };

  const captureWebcamSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
        stopWebcam();
        uploadFile(file);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div>
      {/* Hidden Native File Inputs */}
      {/* 1. Camera Input (has capture="environment" so phone opens camera immediately) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {/* 2. Gallery Input (opens standard phone gallery / file picker) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {label && <label className="input-label" style={{ marginBottom: 6 }}>{label}</label>}

      {/* If Image Already Exists */}
      {value ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: 12,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 12,
            flexWrap: 'wrap',
          }}
        >
          {/* Clickable Preview */}
          <div
            style={{ position: 'relative', cursor: 'zoom-in' }}
            onClick={() => openImage(getImageUrl(value), label || 'Product Image')}
            title="Click to view full size"
          >
            <img
              src={getImageUrl(value)}
              alt="Uploaded Preview"
              onError={handleImageError}
              style={{
                width: 72,
                height: 72,
                borderRadius: 10,
                objectFit: 'cover',
                border: '1px solid var(--color-border)',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.15s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                background: 'rgba(15, 23, 42, 0.75)',
                color: '#fff',
                fontSize: '0.6rem',
                padding: '1px 4px',
                borderRadius: 4,
              }}
            >
              Zoom
            </span>
          </div>

          {/* Details & Actions */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-dark)', marginBottom: 2 }}>
              Photo Attached
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 8 }}>
              Click thumbnail to enlarge.
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleCameraClick}
                disabled={uploading || disabled}
                className="btn-outline"
                style={{ padding: '5px 10px', fontSize: '0.75rem', gap: 5 }}
              >
                <Camera size={14} color="var(--color-lime-dark)" />
                Retake
              </button>

              <button
                type="button"
                onClick={handleGalleryClick}
                disabled={uploading || disabled}
                className="btn-ghost"
                style={{ padding: '5px 10px', fontSize: '0.75rem', gap: 5 }}
              >
                <ImageIcon size={14} />
                Gallery
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                disabled={uploading || disabled}
                className="btn-ghost"
                style={{ padding: '5px 10px', fontSize: '0.75rem', gap: 5, color: '#ef4444' }}
                title="Remove photo"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: Two distinct options (Camera & Gallery) */
        <div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {/* Button 1: Take Photo (Camera) */}
            <button
              type="button"
              onClick={handleCameraClick}
              disabled={uploading || disabled}
              className="btn-primary"
              style={{
                padding: '9px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(101,163,13,0.2)',
              }}
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
              <span>Take Photo</span>
            </button>

            {/* Button 2: Choose from Gallery / Files */}
            <button
              type="button"
              onClick={handleGalleryClick}
              disabled={uploading || disabled}
              className="btn-outline"
              style={{
                padding: '9px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                borderRadius: 10,
              }}
            >
              <ImageIcon size={16} />
              <span>Choose from Gallery</span>
            </button>

            {/* Optional Button 3: Webcam for PC */}
            {typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia && (
              <button
                type="button"
                onClick={startWebcam}
                disabled={uploading || disabled}
                className="btn-ghost"
                title="Use laptop / PC webcam viewfinder"
                style={{
                  padding: '9px 12px',
                  fontSize: '0.8rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  color: 'var(--color-ash)',
                }}
              >
                <Video size={15} />
                <span className="hidden sm:inline">PC Webcam</span>
              </button>
            )}

            {uploading && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-lime-dark)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </span>
            )}
          </div>

          {helperText && (
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 6 }}>
              {helperText}
            </div>
          )}
        </div>
      )}

      {/* PC Webcam Live Viewfinder Modal */}
      {webcamOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '0.95rem' }}>
                <Camera size={18} color="var(--color-lime-dark)" />
                Live Camera Snapshot
              </div>
              <button onClick={stopWebcam} className="btn-ghost" style={{ padding: 6 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#000', position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', maxHeight: 380, objectFit: 'contain' }}
              />
            </div>

            <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={stopWebcam} className="btn-ghost">
                Cancel
              </button>
              <button
                type="button"
                onClick={captureWebcamSnapshot}
                className="btn-primary"
                style={{ gap: 8, padding: '10px 20px' }}
              >
                <Camera size={18} />
                Snap & Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUploadInput;

