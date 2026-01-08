// app/dashboard/bikes/page.tsx
'use client';

import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/interfaces/Product';
import styles from '@/app/dashboard/Admin.module.css';

export default function AdminBikesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> & { newImages?: File[] }>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // DEBUG: Log token on every render
  useEffect(() => {
    console.log('Current accessToken:', token ? `${token.substring(0, 20)}... (${token.length} chars)` : 'MISSING');
  }, [token]);

  const getAuthHeaders = (): HeadersInit => {
    if (!token) {
      console.error('No token - redirecting to login');
      router.push('/auth/login');
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching products with token:', token.substring(0, 20) + '...');
        const res = await fetch(`${api.products}?size=1000`, {
          headers: getAuthHeaders(),
        });

        if (res.status === 401) {
          console.warn('401 Unauthorized - clearing token');
          localStorage.removeItem('accessToken');
          router.push('/auth/login');
          return;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        setProducts(data.content || []);
      } catch (err) {
        setError((err as Error).message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token, router]);

  const openAddModal = () => {
    setSelectedProduct({ stock: 0, price: 0 });
    setModalMode('add');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedProduct(prev => ({
      ...prev,
      [name]: name.includes('Cc') || name === 'stock' || name === 'price' ? Number(value) || '' : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedProduct(prev => ({ ...prev, newImages: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    console.log('Saving bike with token:', token.substring(0, 20) + '...');

    const formData = new FormData();
    const dto = { ...selectedProduct };
    delete (dto as any).id;
    delete (dto as any).images;
    delete (dto as any).active;
    delete (dto as any).newImages;

    formData.append('product', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

    if (selectedProduct.newImages) {
      selectedProduct.newImages.forEach(file => formData.append('images', file));
    }

    try {
      const url = modalMode === 'add' ? api.products : `${api.products}/${selectedProduct.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        body: formData,
        headers: getAuthHeaders(), // ONLY auth header - no Content-Type
      });

      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} ${text}`);
      }

      setIsModalOpen(false);

      const refreshRes = await fetch(`${api.products}?size=1000`, {
        headers: getAuthHeaders(),
      });
      const data = await refreshRes.json();
      setProducts(data.content || []);
    } catch (err) {
      setError((err as Error).message);
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;

    try {
      const res = await fetch(`${api.products}/${id}/hard`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) throw new Error('Delete failed');

      setProducts(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const commonBrands = ['Ducati', 'BMW', 'MV Agusta', 'Yamaha', 'Aprilia', 'Suzuki', 'Kawasaki', 'Honda', 'KTM', 'Triumph'];
  const commonTypes = ['Sport', 'Naked', 'Cruiser', 'Touring', 'Adventure', 'Standard', 'Dual-Sport'];

  if (!token) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Manage Bikes</h1>
      <button onClick={openAddModal} className={styles.addButton}>+ Add New Bike</button>

      {loading ? <p>Loading products...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Brand</th><th>Type</th><th>Price ($)</th><th>Stock</th><th>Active</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.type}</td>
                <td>{product.price.toLocaleString()}</td>
                <td>{product.stock}</td>
                <td>{product.active ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => openEditModal(product)} className={`${styles.actionButton} ${styles.editButton}`}>Edit</button>
                  <button onClick={() => setConfirmDeleteId(product.id!)} className={`${styles.actionButton} ${styles.deleteButton}`}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{modalMode === 'add' ? 'Add New' : 'Edit'} Bike</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <input name="name" value={selectedProduct.name || ''} onChange={handleInputChange} placeholder="Bike Name" required className={styles.input} />
                <select name="brand" value={selectedProduct.brand || ''} onChange={handleInputChange} required className={styles.input}>
                  <option value="">Select Brand</option>
                  {commonBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
                <select name="type" value={selectedProduct.type || ''} onChange={handleInputChange} required className={styles.input}>
                  <option value="">Select Type</option>
                  {commonTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input name="dimensionMmLWH" value={selectedProduct.dimensionMmLWH || ''} onChange={handleInputChange} placeholder="Dimensions (L×W×H mm)" required className={styles.input} />
                <input name="engineCapacityCc" type="number" value={selectedProduct.engineCapacityCc || ''} onChange={handleInputChange} placeholder="Engine CC" required className={styles.input} />
                <input name="engineType" value={selectedProduct.engineType || ''} onChange={handleInputChange} placeholder="Engine Type" required className={styles.input} />
                <input name="maxPower" value={selectedProduct.maxPower || ''} onChange={handleInputChange} placeholder="Max Power" required className={styles.input} />
                <input name="maxTorque" value={selectedProduct.maxTorque || ''} onChange={handleInputChange} placeholder="Max Torque" required className={styles.input} />
                <input name="price" type="number" step="0.01" value={selectedProduct.price || ''} onChange={handleInputChange} placeholder="Price" required className={styles.input} />
                <input name="stock" type="number" value={selectedProduct.stock || ''} onChange={handleInputChange} placeholder="Stock" required className={styles.input} />
              </div>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton}>Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <p>Are you sure you want to permanently delete this bike?</p>
            <div className={styles.confirmButtons}>
              <button onClick={() => handleDelete(confirmDeleteId)} className={`${styles.yesButton} ${styles.actionButton}`}>Yes, Delete</button>
              <button onClick={() => setConfirmDeleteId(null)} className={`${styles.noButton} ${styles.actionButton}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}