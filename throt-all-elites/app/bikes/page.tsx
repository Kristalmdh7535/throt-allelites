// app/bikes/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import ClientBikes from './ClientBikes';
import BikesLoadingSkeleton from './BikesLoadingSkeleton';
import { Product } from '@/interfaces/Product';  // ← import your real type

export const metadata: Metadata = {
  title: 'Bike Collection | Throt All Elites',
  description: 'Explore premium superbikes, naked bikes, adventure and cruiser motorcycles.',
};

export const revalidate = 1800; // 30 minutes

interface ApiPageResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
}

interface FilterOptions {
  brands: string[];
  types: string[];
}

export interface InitialData {
  bikes: Product[];
  totalPages: number;
  filterOptions: FilterOptions;
}

async function getInitialData(): Promise<InitialData> {
  try {
    const params = new URLSearchParams({
      page: '0',
      size: '12',
      sortBy: 'id',           // safe default (assuming id is your PK)
      sortDir: 'desc',
    });

    const url = `http://localhost:8080/api/products?${params.toString()}`;

    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch initial bikes: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as ApiPageResponse;

    const brands = Array.from(
      new Set(data.content.map(p => p.brand?.trim() ?? '').filter(Boolean))
    );

    const types = Array.from(
      new Set(data.content.map(p => p.type?.trim() ?? '').filter(Boolean))
    );

    return {
      bikes: data.content,
      totalPages: data.totalPages,
      filterOptions: { brands, types },
    };
  } catch (error) {
    console.error('Initial bikes fetch failed:', error);
    return {
      bikes: [],
      totalPages: 1,
      filterOptions: { brands: [], types: [] },
    };
  }
}

export default async function BikesPage() {
  const initialData = await getInitialData();

  return (
    <Suspense fallback={<BikesLoadingSkeleton />}>
      <ClientBikes initialData={initialData} />
    </Suspense>
  );
}