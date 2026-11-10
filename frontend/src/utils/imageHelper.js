/**
 * Resolves an image URL to a full loadable URL.
 * - Cloudinary URLs (https://res.cloudinary.com/...) are returned as-is.
 * - Relative local URLs (/uploads/...) are prepended with the backend host.
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${apiBase}${cleanPath}`;
};

/**
 * Handles image load errors gracefully (e.g. hides broken image or replaces with placeholder)
 */
export const handleImageError = (e, fallbackSrc = null) => {
  if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
    e.currentTarget.src = fallbackSrc;
  } else {
    e.currentTarget.style.display = 'none';
  }
};

