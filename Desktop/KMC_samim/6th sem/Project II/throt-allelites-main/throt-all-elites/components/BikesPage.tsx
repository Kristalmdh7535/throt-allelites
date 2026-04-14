'use client';

import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import BikeCard from '../components/BikeCard';
import RecommendationStrip from '../components/RecommendationStrip';
import { Product } from '../interfaces/Product';
import styles from '../components/Bikes.module.css';

export default function BikesPage() {
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes]   = useState<string[]>([]);
  const [sortBy, setSortBy]                 = useState('id');
  const [sortDir, setSortDir]               = useState('asc');
  const [filterOpen, setFilterOpen]         = useState(false);
  const [products, setProducts]             = useState<Product[]>([]);
  const [currentPage, setCurrentPage]       = useState(0);
  const [totalPages, setTotalPages]         = useState(0);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);
  const [brands, setBrands]                 = useState<string[]>([]);
  const [types, setTypes]                   = useState<string[]>([]);

  useEffect(() => {
    fetch(`${api.products}?page=0&size=1000&sortBy=price&sortDir=asc`)
      .then(r => r.json())
      .then(d => {
        const all: Product[] = d.content ?? [];
        setBrands(Array.from(new Set(all.map(p => p.brand))));
        setTypes(Array.from(new Set(all.map(p => p.type))));
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      name: searchQuery,
      brand: selectedBrands.join(','),
      type: selectedTypes.join(','),
      page: currentPage.toString(),
      size: '8',
      sortBy,
      sortDir,
    });
    fetch(`/api/products?${params}`)
      .then(r => { if (!r.ok) throw new Error('Failed to fetch products'); return r.json(); })
      .then(d => { setProducts(d.content); setTotalPages(d.totalPages); })
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [searchQuery, selectedBrands, selectedTypes, sortBy, sortDir, currentPage]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    setCurrentPage(0);
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
    setCurrentPage(0);
  };

  const handleSortChange = (value: string) => {
    if (value === 'price-asc')  { setSortBy('price'); setSortDir('asc');  }
    if (value === 'price-desc') { setSortBy('price'); setSortDir('desc'); }
    if (value === '')           { setSortBy('id');    setSortDir('asc');  }
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

  const activeFilters = [
    ...selectedBrands.map(b => ({ label: b, remove: () => handleBrandChange(b) })),
    ...selectedTypes.map(t => ({ label: t, remove: () => handleTypeChange(t) })),
  ];

  const currentSortValue =
    sortBy === 'price' && sortDir === 'asc'  ? 'price-asc' :
    sortBy === 'price' && sortDir === 'desc' ? 'price-desc' : '';

  return (
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroEyebrow}>Throt-All Elites</p>
          <h1 className={styles.heroTitle}>
            Our Bike{' '}
            <span className={styles.heroAccent}>Collection</span>
          </h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroSub}>
            Explore our curated selection of the world's most powerful and beautiful machines.
          </p>
        </div>
      </header>

      {/* ── Recommendations ── */}
      <div className={styles.recSection}>
        <RecommendationStrip
          type="most-viewed"
          title="Trending Now"
          subtitle="Most viewed bikes in the last 30 days"
          limit={8}
        />
        <RecommendationStrip
          type="most-requested"
          title="Most Wanted"
          subtitle="Bikes with the highest test ride demand"
          limit={8}
        />
      </div>

      {/* ── Sticky Controls Bar ── */}
      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          {/* Search */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search bikes by name..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(0); }}
              className={styles.searchInput}
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFilterOpen(v => !v)}
            className={`${styles.filterToggle} ${filterOpen ? styles.filterToggleActive : ''}`}
          >
            <span>{filterOpen ? '✕' : '⚙'}</span>
            {filterOpen ? 'Close' : 'Filters'}
            {activeFilters.length > 0 && (
              <span style={{
                background: 'var(--red)',
                color: '#fff',
                borderRadius: '99px',
                fontSize: '0.7rem',
                padding: '0 0.4rem',
                fontFamily: 'DM Sans, sans-serif',
                fontWeight: 600,
              }}>
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={currentSortValue}
            onChange={e => handleSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="">Default Order</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* ── Filter Drawer ── */}
      <div className={`${styles.filterDrawer} ${filterOpen ? styles.filterDrawerOpen : ''}`}>
        <div className={styles.filterDrawerInner}>
          <div className={styles.filterGroup}>
            <h3>Brand</h3>
            <div className={styles.checkGrid}>
              {brands.map(brand => (
                <label key={brand} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className={styles.checkbox}
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <h3>Type</h3>
            <div className={styles.checkGrid}>
              {types.map(type => (
                <label key={type} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className={styles.checkbox}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <button onClick={clearFilters} className={styles.clearBtn}>
            Clear All
          </button>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      {activeFilters.length > 0 && (
        <div className={styles.activeFilters}>
          {activeFilters.map(f => (
            <button key={f.label} onClick={f.remove} className={styles.chip}>
              {f.label}
              <span className={styles.chipX}>✕</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Main content ── */}
      <main className={styles.content}>
        {/* Results count */}
        {!loading && !error && (
          <div className={styles.resultsMeta}>
            <p className={styles.resultsCount}>
              <strong>{products.length}</strong> bikes found
              {activeFilters.length > 0 && ' (filtered)'}
            </p>
          </div>
        )}

        {/* States */}
        {loading ? (
          <div className={styles.stateBox}>
            <div className={styles.spinner} />
          </div>
        ) : error ? (
          <div className={styles.stateBox}>
            <span className={styles.stateIcon}>⚠️</span>
            <h2 className={styles.stateTitle}>Something went wrong</h2>
            <p className={styles.stateDesc}>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className={styles.stateBox}>
            <span className={styles.stateIcon}>🏍️</span>
            <h2 className={styles.stateTitle}>No Bikes Found</h2>
            <p className={styles.stateDesc}>
              Try adjusting your search or filters — your dream ride is in here somewhere.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product, index) => (
              <div
                key={product.id}
                className={styles.cardWrap}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <BikeCard bike={product} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
              disabled={currentPage === 0}
            >
              ← Prev
            </button>
            <span className={styles.pageInfo}>
              Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}