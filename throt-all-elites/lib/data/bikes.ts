// lib/data/bikes.ts
import { Product } from '@/interfaces/Product';

type FilterOptions = {
  brands: string[];
  types: string[];
};

type PaginatedBikes = {
  content: Product[];
  totalPages: number;
  totalElements: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function getInitialBikes(): Promise<PaginatedBikes> {
  const res = await fetch(`${API_BASE}/products?page=0&size=12&sortBy=createdAt&sortDir=desc`, {
    next: { revalidate: 300 }, // 5 min client-side cache
    cache: 'no-store',        // or 'force-cache' if very stable
  });

  if (!res.ok) {
    throw new Error('Failed to fetch initial bikes');
  }

  return res.json();
}

export async function getBikeFilterOptions(): Promise<FilterOptions> {

  const res = await fetch(`${API_BASE}/products?page=0&size=50&sortBy=id&sortDir=asc`, {
    next: { revalidate: 3600 }, // 1 hour
  });

  if (!res.ok) {
    return { brands: [], types: [] };
  }

  const data = await res.json();
  const products: Product[] = data.content || [];

  return {
    brands: Array.from(new Set(products.map(p => p.brand).filter(Boolean))),
    types: Array.from(new Set(products.map(p => p.type).filter(Boolean))),
  };
}