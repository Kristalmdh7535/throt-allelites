'use client';

import dynamic from 'next/dynamic';

const AdminBikesClient = dynamic(() => import('./AdminBikesClient'), {
  ssr: false,
  loading: () => <p className="text-center py-12 text-gray-600 text-lg">Loading admin panel...</p>,
});

export default function AdminBikesWrapper() {
  return <AdminBikesClient />;
}