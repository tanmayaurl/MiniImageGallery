export const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export async function fetchImages() {
  const res = await fetch(`${BASE}/images`);
  if (!res.ok) throw new Error('Failed to load images');
  return res.json();
}

// uploadImage(file, onProgress(percent))
export function uploadImage(file, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE}/upload`);

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const pct = (e.loaded / e.total) * 100;
        onProgress(pct);
      }
    };

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          const parsed = JSON.parse(xhr.responseText);
          reject(new Error(parsed.error || 'Upload failed'));
        } catch {
          reject(new Error('Upload failed'));
        }
      }
    };

    xhr.onerror = function () {
      reject(new Error('Network error'));
    };

    const form = new FormData();
    form.append('image', file);
    xhr.send(form);
  });
}

export async function deleteImage(id) {
  const res = await fetch(`${BASE}/images/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    throw new Error('Delete failed');
  }
}
