'use client';

import { useState, useEffect, useTransition } from 'react';
import BikeCard from '@/components/BikeCard';
import BikeDetailModal from '@/components/BikeDetailModal';
import styles from '@/components/Bikes.module.css';
import { Product } from '@/interfaces/Product';
import { InitialData } from './page';

const BACKEND_URL = 'http://localhost:8080';

interface Props {
  initialData: InitialData;
}

type SortValue = 'newest' | 'price-asc' | 'price-desc' | 'recommended';

export default function ClientBikes({ initialData }: Props) {
  const [products, setProducts]     = useState<Product[]>(initialData.bikes);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBike, setSelectedBike] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes]   = useState<string[]>([]);
  const [sortValue, setSortValue]           = useState<SortValue>('newest');

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isRecommended = sortValue === 'recommended';

  const { brands, types } = initialData.filterOptions;

  const getSortParams = () => {
    switch (sortValue) {
      case 'price-asc':  return { sortBy: 'price', sortDir: 'asc'  };
      case 'price-desc': return { sortBy: 'price', sortDir: 'desc' };
      default:           return { sortBy: 'id',    sortDir: 'desc' };
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      if (sortValue === 'recommended') {
        const res = await fetch(
          `${BACKEND_URL}/api/recommendations/most-requested?limit=50`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error('Failed to load recommendations');

        const recs: {
          id: number; name: string; brand: string; type: string;
          price: number; engineCapacityCc: number;
          primaryImageUrl: string | null; score: number;
        }[] = await res.json();

        if (recs.length === 0) {
          startTransition(() => {
            setProducts(initialData.bikes);
            setTotalPages(initialData.totalPages);
          });
          setLoading(false);
          return;
        }

        const recIds = recs.map(r => r.id);

        const allRes = await fetch(
          `${BACKEND_URL}/api/products?page=0&size=1000&sortBy=id&sortDir=asc`,
          { cache: 'no-store' }
        );
        if (!allRes.ok) throw new Error('Failed to load bikes');
        const allData = await allRes.json();
        const allProducts: Product[] = allData.content || [];

        const productMap = new Map<number, Product>(
          allProducts.map((p: Product) => [p.id as number, p])
        );

        const ordered = recIds
          .map(id => productMap.get(id))
          .filter((p): p is Product => p !== undefined);

        const recIdSet = new Set(recIds);
        const remaining = allProducts.filter((p: Product) => !recIdSet.has(p.id as number));
        const combined = [...ordered, ...remaining];

        startTransition(() => {
          setProducts(combined);
          setTotalPages(1); 
        });

        setLoading(false);
        return;
      }      const { sortBy, sortDir } = getSortParams();
      const params = new URLSearchParams({
        name:   searchQuery.trim(),
        brand:  selectedBrands.join(','),
        type:   selectedTypes.join(','),
        page:   currentPage.toString(),
        size:   '12',
        sortBy,
        sortDir,
      });

      const res = await fetch(
        `${BACKEND_URL}/api/products?${params.toString()}`,
        { next: { revalidate: 0 }, cache: 'no-store' }
      );
      if (!res.ok) throw new Error(`Failed to load bikes: ${res.status}`);

      const data = await res.json();
      startTransition(() => {
        setProducts(data.content || []);
        setTotalPages(data.totalPages || 1);
      });

    } catch (err) {
      console.error(err);
      setError('Failed to load bikes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, selectedBrands, selectedTypes, sortValue]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, selectedBrands, selectedTypes, sortValue]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortValue(e.target.value as SortValue);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSortValue('newest');
    setCurrentPage(0);
  };

  return (
    <div className={`${styles.pageContainer} min-h-screen`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Our Bike Collection
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Discover premium motorcycles from the world's leading manufacturers
          </p>
        </header>

        {/* Controls */}
        <div className="mb-10 p-6 bg-white rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="search"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isRecommended}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            />

            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              disabled={isRecommended}
              className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isFilterVisible ? 'Hide' : 'Show'} Filters
            </button>

            <select
              value={sortValue}
              onChange={handleSortChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="recommended">Most Requested</option>
            </select>
          </div>

          {/* Recommended mode banner */}
          {isRecommended && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <span className="text-xl">🏍️</span>
              <p className="text-sm text-red-700 font-medium">
                Showing bikes ranked by test ride demand — the most requested bikes appear first.
                Filters and search are disabled in this mode.
              </p>
            </div>
          )}

          {/* Filters panel — hidden in recommended mode */}
          {isFilterVisible && !isRecommended && (
            <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Brands</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => setSelectedBrands(prev =>
                            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
                          )}
                          className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4 text-gray-800">Types</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
                    {types.map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => setSelectedTypes(prev =>
                            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                          )}
                          className="h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 text-right">
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading || isPending ? (
          <div className="text-center py-24 text-gray-600 text-xl font-medium">
            Loading bikes...
          </div>
        ) : error ? (
          <div className="text-center py-24 text-red-600 text-xl font-medium">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No bikes found</h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Try different search terms or adjust your filters
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <p className="text-sm text-gray-500">
                {isRecommended
                  ? `${products.length} bikes — ranked by test ride demand`
                  : `${products.length} bikes found`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="transform transition-all duration-300 hover:-translate-y-2 cursor-pointer relative"
                  onClick={() => setSelectedBike(product)}
                >
                  {isRecommended && index < 3 && (
                    <div
                      className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-md"
                      style={{
                        background: index === 0 ? '#dc2626' : index === 1 ? '#ea580c' : '#d97706',
                        color: 'white',
                      }}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      #{index + 1} Most Wanted
                    </div>
                  )}
                  <BikeCard bike={product} />
                </div>
              ))}
            </div>
            {!isRecommended && totalPages > 1 && (
              <div className="flex justify-center items-center gap-8 mt-16">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0 || loading}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors font-medium min-w-[120px]"
                >
                  Previous
                </button>

                <span className="text-lg font-medium text-gray-700">
                  Page {currentPage + 1} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors font-medium min-w-[120px]"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {selectedBike && (
        <BikeDetailModal
          bike={selectedBike}
          onClose={() => setSelectedBike(null)}
        />
      )}
    </div>
  );
}