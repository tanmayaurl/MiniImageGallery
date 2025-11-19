import React, { useEffect, useState, useRef } from 'react';
import ImageGallery from './ImageGallery';
import { fetchImages, uploadImage, deleteImage, BASE } from './api';

export default function App() {
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    loadImages();
    // ESC to close preview
    const onKey = (e) => { if (e.key === 'Escape') setPreviewId(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const list = await fetchImages();
      setImages(list);
    } catch (err) {
      showToast(err.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await handleUpload(file);
  };

  const handleUpload = async (file) => {
    // Frontend validation: type and size
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      showToast('Only JPEG or PNG files are allowed');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('File too large (max 3MB)');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);
      await uploadImage(file, (pct) => setProgress(pct));
      await loadImages();
      if (fileRef.current) fileRef.current.value = '';
      setTimeout(() => setProgress(0), 600);
      showToast('Image uploaded');
    } catch (err) {
      showToast(err.message || 'Upload failed');
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await deleteImage(id);
    setImages((prev) => prev.filter((p) => p.id !== id));
    showToast('Image deleted');
  };

  const onDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) await handleUpload(file);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Mini Image Gallery</h1>
        <p className="sub">Upload one image (JPEG/PNG ≤ 3MB). Drag & drop or browse.</p>
      </header>

      <div
        className={`upload-box ${isUploading ? 'disabled' : ''}`}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={onDrop}
        onClick={() => !isUploading && fileRef.current && fileRef.current.click()}
        role="button"
        aria-disabled={isUploading}
      >
        <div className="upload-inner">
          <div className="upload-icon">📷</div>
          <div>
            <div className="upload-title">Drag & drop an image here</div>
            <div className="upload-sub">or click to browse</div>
          </div>
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleFileChange}
          ref={fileRef}
          aria-label="Upload image"
          style={{ display: 'none' }}
        />
        {progress > 0 && (
          <div className="progress">
            <div className="bar" style={{ width: `${progress}%` }} />
            <div className="label">{Math.round(progress)}%</div>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}

      <section className="gallery-section">
        {loading ? (
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton-card" key={i} />
            ))}
          </div>
        ) : (
          <ImageGallery
            images={images}
            onDelete={handleDelete}
            onOpen={(id) => setPreviewId(id)}
          />
        )}
      </section>

      {previewId && (
        <div className="modal" onClick={() => setPreviewId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={`${BASE}/images/${previewId}/data`} alt="preview" />
            <div className="modal-actions">
              <button className="btn" onClick={() => setPreviewId(null)}>Close</button>
              <button className="btn danger" onClick={() => { handleDelete(previewId); setPreviewId(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
