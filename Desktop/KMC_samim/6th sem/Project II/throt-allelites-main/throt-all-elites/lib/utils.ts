const BACKEND_BASE = 'http://localhost:8080';

export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) return '/images/placeholder-bike.jpg'; 

  if (imagePath.startsWith('http')) return imagePath;

  return `${BACKEND_BASE}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}