import React from 'react';
import { BASE } from './api';

export default function ImageGallery({ images = [], onDelete, onOpen }) {
  return (
    <div>
      {images.length === 0 ? (
        <div className="empty">No images yet — upload one!</div>
      ) : (
        <div className="gallery-grid">
          {images.map((img) => (
            <div className="card" key={img.id} onClick={() => onOpen && onOpen(img.id)}>
              <img
                src={`${BASE}/images/${img.id}/data`}
                alt={img.filename}
              />
              <div className="card-footer">
                <div className="filename" title={img.filename}>{img.filename}</div>
                <button className="btn danger" onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}>Delete</button>
              </div>
              <div className="overlay">
                <span className="overlay-text">View</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
