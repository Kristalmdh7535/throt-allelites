// app/bikes/ClientBikes.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import BikeCard from '@/components/BikeCard';
import BikeDetailModal from '@/components/BikeDetailModal'; // ← new import
import styles from '@/components/Bikes.module.css';
import { Product } from '@/interfaces/Product';
import { InitialData } from './page';

interface Props {
  initialData: InitialData;
}

export default function ClientBikes({ initialData }: Props) {
  const [products, setProducts] = useState<Product[]>(initialData.bikes);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBike, setSelectedBike] = useState<Product | null>(null); 

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortValue, setSortValue] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { brands, types } = initialData.filterOptions;

  const getSortParams = () => {
    switch (sortValue) {
      case 'price-asc':
        return { sortBy: 'price', sortDir: 'asc' };
      case 'price-desc':
        return { sortBy: 'price', sortDir: 'desc' };
      default:
        return { sortBy: 'id', sortDir: 'desc' };
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { sortBy, sortDir } = getSortParams();

      const params = new URLSearchParams({
        name: searchQuery.trim(),
        brand: selectedBrands.join(','),
        type: selectedTypes.join(','),
        page: currentPage.toString(),
        size: '12',
        sortBy,
        sortDir,
      });

      const url = `http://localhost:8080/api/products?${params.toString()}`;

      const res = await fetch(url, {
        next: { revalidate: 0 },
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to load bikes: ${res.status} ${res.statusText}`);
      }

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
    setSortValue(e.target.value as 'newest' | 'price-asc' | 'price-desc');
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
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />

            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
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
            </select>
          </div>

          {/* Filters panel */}
          {isFilterVisible && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map(product => (
                <div
                  key={product.id}
                  className="transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => setSelectedBike(product)} // ← this opens the modal
                >
                  <BikeCard bike={product} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
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

      {/* Modal – only shown when a bike is selected */}
      {selectedBike && (
        <BikeDetailModal
          bike={selectedBike}
          onClose={() => setSelectedBike(null)}
        />
      )}
    </div>
  );
}