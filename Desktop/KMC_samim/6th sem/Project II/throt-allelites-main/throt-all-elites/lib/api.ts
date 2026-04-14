const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

export const api = {
  products:        `${BACKEND_URL}/api/products`,
  testRides:       `${BACKEND_URL}/api/test-rides`,
  deliveries:      `${BACKEND_URL}/api/deliveries`,
  recommendations: `${BACKEND_URL}/api/recommendations`,
};