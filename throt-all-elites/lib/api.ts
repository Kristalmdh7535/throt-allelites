const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const api = {
  products: `${BACKEND_URL}/api/products`,
};