// app/dashboard/bikes/AdminBikesClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/interfaces/Product';
import styles from '@/app/dashboard/Admin.module.css';

const BACKEND_URL = 'http://localhost:8080/api/products';

export default function AdminBikesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> & { newImages?: File[] }>({
    stock: 0,
    price: 0,
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_URL}?size=1000`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('accessToken');
          router.push('/auth/login');
          return;
        }

        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();
        setProducts(data.content || []);
      } catch (err) {
        setError((err as Error).message || 'Failed to load bikes');
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
      [name]: ['engineCapacityCc', 'stock', 'price'].includes(name) ? Number(value) || '' : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedProduct(prev => ({
        ...prev,
        newImages: Array.from(e.target.files!),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);
    setError(null);

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
      const url = modalMode === 'add' ? BACKEND_URL : `${BACKEND_URL}/${selectedProduct.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('accessToken');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Save failed: ${res.status} - ${text}`);
      }

      // Success - close modal
      setIsModalOpen(false);

      // Re-fetch the updated/created product to get fresh images array
      const updatedRes = await fetch(`${BACKEND_URL}/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (updatedRes.ok) {
        const updatedProduct = await updatedRes.json();
        // Update only this product in local state (instant image update)
        setProducts(prev =>
          prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
      } else {
        // Fallback: full refresh if single fetch fails
        const refreshRes = await fetch(`${BACKEND_URL}?size=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await refreshRes.json();
        setProducts(data.content || []);
      }

      // Reset form state
      setSelectedProduct({ stock: 0, price: 0 });
    } catch (err) {
      setError((err as Error).message || 'Failed to save bike');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/${id}/hard`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('accessToken');
        router.push('/auth/login');
        return;
      }

      if (!res.ok) throw new Error('Delete failed');

      setProducts(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to delete bike');
    }
  };

  const commonBrands = ['Ducati', 'BMW', 'MV Agusta', 'Yamaha', 'Aprilia', 'Suzuki', 'Kawasaki', 'Honda', 'KTM', 'Harley Davidson'];
  const commonTypes = ['Sport', 'Naked', 'Cruiser', 'Touring', 'Adventure', 'Standard', 'Dual-Sport'];

  if (!token) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Manage Bikes</h1>
      <button 
        onClick={openAddModal} 
        className={styles.addButton}
        disabled={submitting}
      >
        + Add New Bike
      </button>

      {loading ? (
        <p>Loading bikes...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.type}</td>
                <td>Rs. {product.price.toLocaleString()}</td>
                <td>{product.stock}</td>
                <td>{product.active ? 'Yes' : 'No'}</td>
                <td>
                  <button 
                    onClick={() => openEditModal(product)} 
                    className={styles.editButton}
                    disabled={submitting}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(product.id!)} 
                    className={styles.deleteButton}
                    disabled={submitting}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {modalMode === 'add' ? 'Add New Bike' : 'Edit Bike'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                {/* Basic Information */}
                <input
                  name="name"
                  value={selectedProduct.name || ''}
                  onChange={handleInputChange}
                  placeholder="Bike Name"
                  required
                  className={styles.input}
                  disabled={submitting}
                />
                <select
                  name="brand"
                  value={selectedProduct.brand || ''}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  disabled={submitting}
                >
                  <option value="">Select Brand</option>
                  {commonBrands.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <select
                  name="type"
                  value={selectedProduct.type || ''}
                  onChange={handleInputChange}
                  required
                  className={styles.input}
                  disabled={submitting}
                >
                  <option value="">Select Type</option>
                  {commonTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input
                  name="dimensionMmLWH"
                  value={selectedProduct.dimensionMmLWH || ''}
                  onChange={handleInputChange}
                  placeholder="Dimensions (L×W×H mm)"
                  required
                  className={styles.input}
                  disabled={submitting}
                />

                {/* Engine & Power */}
                <input
                  name="engineCapacityCc"
                  type="number"
                  value={selectedProduct.engineCapacityCc || ''}
                  onChange={handleInputChange}
                  placeholder="Engine CC"
                  required
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="engineType"
                  value={selectedProduct.engineType || ''}
                  onChange={handleInputChange}
                  placeholder="Engine Type"
                  required
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="maxPower"
                  value={selectedProduct.maxPower || ''}
                  onChange={handleInputChange}
                  placeholder="Max Power"
                  required
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="maxTorque"
                  value={selectedProduct.maxTorque || ''}
                  onChange={handleInputChange}
                  placeholder="Max Torque"
                  required
                  className={styles.input}
                  disabled={submitting}
                />

                {/* Performance */}
                <input
                  name="mileageKmpl"
                  value={selectedProduct.mileageKmpl || ''}
                  onChange={handleInputChange}
                  placeholder="Mileage (kmpl)"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="topSpeedKmph"
                  value={selectedProduct.topSpeedKmph || ''}
                  onChange={handleInputChange}
                  placeholder="Top Speed (kmph)"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="gearbox"
                  value={selectedProduct.gearbox || ''}
                  onChange={handleInputChange}
                  placeholder="Gearbox"
                  className={styles.input}
                  disabled={submitting}
                />

                {/* Brakes & Suspension */}
                <input
                  name="clutchType"
                  value={selectedProduct.clutchType || ''}
                  onChange={handleInputChange}
                  placeholder="Clutch Type"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="frontBrake"
                  value={selectedProduct.frontBrake || ''}
                  onChange={handleInputChange}
                  placeholder="Front Brake"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="rearBrake"
                  value={selectedProduct.rearBrake || ''}
                  onChange={handleInputChange}
                  placeholder="Rear Brake"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="frontSuspension"
                  value={selectedProduct.frontSuspension || ''}
                  onChange={handleInputChange}
                  placeholder="Front Suspension"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="rearSuspension"
                  value={selectedProduct.rearSuspension || ''}
                  onChange={handleInputChange}
                  placeholder="Rear Suspension"
                  className={styles.input}
                  disabled={submitting}
                />

                {/* Tyres & Dimensions */}
                <input
                  name="frontTyre"
                  value={selectedProduct.frontTyre || ''}
                  onChange={handleInputChange}
                  placeholder="Front Tyre"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="rearTyre"
                  value={selectedProduct.rearTyre || ''}
                  onChange={handleInputChange}
                  placeholder="Rear Tyre"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="tyreType"
                  value={selectedProduct.tyreType || ''}
                  onChange={handleInputChange}
                  placeholder="Tyre Type"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="fuelTankCapacityL"
                  value={selectedProduct.fuelTankCapacityL || ''}
                  onChange={handleInputChange}
                  placeholder="Fuel Tank (L)"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="seatHeightMm"
                  value={selectedProduct.seatHeightMm || ''}
                  onChange={handleInputChange}
                  placeholder="Seat Height (mm)"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="groundClearanceMm"
                  value={selectedProduct.groundClearanceMm || ''}
                  onChange={handleInputChange}
                  placeholder="Ground Clearance (mm)"
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="kerbWeightKg"
                  value={selectedProduct.kerbWeightKg || ''}
                  onChange={handleInputChange}
                  placeholder="Kerb Weight (kg)"
                  className={styles.input}
                  disabled={submitting}
                />

                {/* Price & Stock */}
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={selectedProduct.price || ''}
                  onChange={handleInputChange}
                  placeholder="Price"
                  required
                  className={styles.input}
                  disabled={submitting}
                />
                <input
                  name="stock"
                  type="number"
                  value={selectedProduct.stock || ''}
                  onChange={handleInputChange}
                  placeholder="Stock"
                  required
                  className={styles.input}
                  disabled={submitting}
                />
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
                disabled={submitting}
              />

              <div className={styles.modalButtons}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelButton}
                  disabled={submitting}
                >
                  Cancel
                </button>
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
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className={styles.yesButton}
                disabled={submitting}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className={styles.noButton}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}