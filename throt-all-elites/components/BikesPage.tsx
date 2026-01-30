'use client';
import { api } from '@/lib/api';
import { useState, useEffect, useMemo } from 'react';
import BikeCard from '../components/BikeCard';
import { Product } from '../interfaces/Product';
import styles from '../components/Bikes.module.css';

export default function BikesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [brands, setBrands] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(`${api.products}?page=${currentPage}&size=12&sortBy=price&sortDir=asc`);
        if (!res.ok) throw new Error('Failed to fetch options');
        const data = await res.json();
        const allProducts: Product[] = data.content;
        setBrands(Array.from(new Set(allProducts.map(p => p.brand))));
        setTypes(Array.from(new Set(allProducts.map(p => p.type))));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(0);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(0);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    if (value === 'price-asc') {
      setSortBy('price');
      setSortDir('asc');
    } else if (value === 'price-desc') {
      setSortBy('price');
      setSortDir('desc');
    } else {
      setSortBy('id');
      setSortDir('asc');
    }
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSortBy('id');
    setSortDir('asc');
    setCurrentPage(0);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          name: searchQuery,
          brand: selectedBrands.join(','),
          type: selectedTypes.join(','),
          page: currentPage.toString(),
          size: '8',
          sortBy,
          sortDir,
        });
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, selectedBrands, selectedTypes, sortBy, sortDir, currentPage]);

  return (
    <div className={`${styles.pageContainer} min-h-screen`}>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center my-8 md:my-12">
          <h1 className={`text-4xl md:text-6xl font-extrabold ${styles.title}`}>Our Bike Collection</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Explore our curated selection of the world's most powerful and beautiful bikes.</p>
        </header>

        {/* Search and Filter Controls */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              type="text"
              placeholder="Search bikes by name..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(0); }}
              className="p-3 border border-gray-300 rounded-lg w-full md:col-span-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="p-3 bg-gray-800 text-white rounded-lg w-full font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              {isFilterVisible ? 'Hide' : 'Show'} Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Section */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isFilterVisible ? 'max-h-96 mt-4' : 'max-h-0'
          }`}
        >
          <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Brands</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Types</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {types.map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeChange(type)}
                        className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={clearFilters}
                className="p-3 px-6 bg-red-600 text-white font-semibold rounded-lg w-full sm:w-auto hover:bg-red-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">Loading...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.id} className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
                <BikeCard bike={product} /> {/* Assume BikeCard handles Product */}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No bikes found</h2>
            <p className="text-gray-600 mt-2">Try adjusting your search or filter criteria to find your dream bike.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}