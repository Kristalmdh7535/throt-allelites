import { useState, useMemo } from 'react';
import BikeCard from '../components/BikeCard';
import { mockBikes } from '../data/mockBikes';
import { Bike } from '../interfaces/Bike';
import styles from '../styles/Bikes.module.css';


export default function BikesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const brands = useMemo(() => Array.from(new Set(mockBikes.map(bike => bike.brand))), []);
  const types = useMemo(() => Array.from(new Set(mockBikes.map(bike => bike.type))), []);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };


  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSortBy('');
  };

  const filteredAndSortedBikes = useMemo(() => {
    let bikes: Bike[] = [...mockBikes];

    // Search filter
    if (searchQuery) {
      bikes = bikes.filter(bike =>
        bike.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      bikes = bikes.filter(bike => selectedBrands.includes(bike.brand));
    }

    // Type filter
    if (selectedTypes.length > 0) {
      bikes = bikes.filter(bike => selectedTypes.includes(bike.type));
    }

    // Sorting
    if (sortBy === 'price-asc') {
      bikes.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      bikes.sort((a, b) => b.price - a.price);
    }

    return bikes;
  }, [searchQuery, selectedBrands, selectedTypes, sortBy]);

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
              onChange={(e) => setSearchQuery(e.target.value)}
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
              onChange={(e) => setSortBy(e.target.value)}
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

        {/* Bikes Grid */}
        {filteredAndSortedBikes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAndSortedBikes.map((bike, index) => (
              <div key={bike.id} className={styles.card} style={{ animationDelay: `${index * 100}ms` }}>
                <BikeCard bike={bike} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No bikes found</h2>
            <p className="text-gray-600 mt-2">Try adjusting your search or filter criteria to find your dream bike.</p>
          </div>
        )}
      </div>
    </div>
  );
}