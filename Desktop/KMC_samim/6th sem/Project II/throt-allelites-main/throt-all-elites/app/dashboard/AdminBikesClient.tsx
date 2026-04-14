'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../(auth)/contexts/AuthContext';
import { Product } from '@/interfaces/Product';
import styles from '@/app/dashboard/Admin.module.css';

const BACKEND_URL = 'http://localhost:8080/api/products';

export default function AdminBikesClient() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
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

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token || !isAuthenticated) { router.push('/login'); return; }
    if (user?.role !== 'ADMIN')     { router.push('/');      return; }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BACKEND_URL}?size=1000`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('accessToken');
          router.push('/login');
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
  }, [token, router, isAuthenticated, user?.role]);

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
      setSelectedProduct(prev => ({ ...prev, newImages: Array.from(e.target.files!) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { router.push('/login'); return; }
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
      const url    = modalMode === 'add' ? BACKEND_URL : `${BACKEND_URL}/${selectedProduct.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PATCH';
      const res    = await fetch(url, { method, body: formData, headers: { Authorization: `Bearer ${token}` } });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('accessToken');
        router.push('/login');
        return;
      }
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);

      setIsModalOpen(false);

      const updatedRes = await fetch(`${BACKEND_URL}/${selectedProduct.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (updatedRes.ok) {
        const updatedProduct = await updatedRes.json();
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        const refreshRes = await fetch(`${BACKEND_URL}?size=1000`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await refreshRes.json();
        setProducts(data.content || []);
      }
      setSelectedProduct({ stock: 0, price: 0 });
    } catch (err) {
      setError((err as Error).message || 'Failed to save bike');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`${BACKEND_URL}/${id}/hard`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('accessToken');
        router.push('/login');
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
  const commonTypes  = ['Sport', 'Naked', 'Cruiser', 'Touring', 'Adventure', 'Standard', 'Dual-Sport'];

  if (!token || !isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className={styles.container}>

      <div className={styles.adminHeader}>
        <div>
          <h1 className={styles.heading}>Manage Bikes</h1>
          <p className={styles.subheading}>{products.length} bikes in inventory</p>
        </div>

        <div className={styles.adminActions}>
          <button
            onClick={openAddModal}
            className={styles.addButton}
            disabled={submitting}
          >
            + Add New Bike
          </button>

          <button
            onClick={() => router.push('/dashboard/test-rides')}
            className={styles.navButton}
            disabled={submitting}
          >
            🏍️ Test Ride Requests
          </button>

          <button
            onClick={() => router.push('/dashboard/deliveries')}
            className={`${styles.navButton} ${styles.navButtonDeliveries}`}
            disabled={submitting}
            title="Coming soon"
          >
            🚚 Deliveries
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading bikes...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Brand</th><th>Type</th>
              <th>Price</th><th>Stock</th><th>Active</th><th>Actions</th>
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
                  <button onClick={() => openEditModal(product)} className={styles.editButton} disabled={submitting}>Edit</button>
                  <button onClick={() => setConfirmDeleteId(product.id!)} className={styles.deleteButton} disabled={submitting}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{modalMode === 'add' ? 'Add New Bike' : 'Edit Bike'}</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                {/* Basic Information */}
                <div className={styles.formField}>
                  <label className={styles.label}>Bike Name *</label>
                  <input 
                    name="name" 
                    value={selectedProduct.name || ''} 
                    onChange={handleInputChange} 
                    placeholder="Bike Name" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Brand *</label>
                  <select 
                    name="brand" 
                    value={selectedProduct.brand || ''} 
                    onChange={handleInputChange} 
                    required 
                    className={styles.input} 
                    disabled={submitting}
                  >
                    <option value="">Select Brand</option>
                    {commonBrands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Type *</label>
                  <select 
                    name="type" 
                    value={selectedProduct.type || ''} 
                    onChange={handleInputChange} 
                    required 
                    className={styles.input} 
                    disabled={submitting}
                  >
                    <option value="">Select Type</option>
                    {commonTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Dimensions (L×W×H mm) *</label>
                  <input 
                    name="dimensionMmLWH" 
                    value={selectedProduct.dimensionMmLWH || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 2100×800×1100" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Engine Specifications */}
                <div className={styles.formField}>
                  <label className={styles.label}>Engine Capacity (CC) *</label>
                  <input 
                    name="engineCapacityCc" 
                    value={selectedProduct.engineCapacityCc || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 998" 
                    type="number" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Engine Type *</label>
                  <input 
                    name="engineType" 
                    value={selectedProduct.engineType || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., L-Twin" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Max Power *</label>
                  <input 
                    name="maxPower" 
                    value={selectedProduct.maxPower || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 208 HP @ 13,000 rpm" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Max Torque *</label>
                  <input 
                    name="maxTorque" 
                    value={selectedProduct.maxTorque || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 123.6 Nm @ 11,250 rpm" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Performance */}
                <div className={styles.formField}>
                  <label className={styles.label}>Mileage (kmpl)</label>
                  <input 
                    name="mileageKmpl" 
                    value={selectedProduct.mileageKmpl || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 15.5" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Top Speed (kmph)</label>
                  <input 
                    name="topSpeedKmph" 
                    value={selectedProduct.topSpeedKmph || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 299" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Transmission */}
                <div className={styles.formField}>
                  <label className={styles.label}>Gearbox</label>
                  <input 
                    name="gearbox" 
                    value={selectedProduct.gearbox || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 6-Speed" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Clutch Type</label>
                  <input 
                    name="clutchType" 
                    value={selectedProduct.clutchType || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Wet Multiplate" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Brakes */}
                <div className={styles.formField}>
                  <label className={styles.label}>Front Brake</label>
                  <input 
                    name="frontBrake" 
                    value={selectedProduct.frontBrake || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Dual 330mm Disc" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Rear Brake</label>
                  <input 
                    name="rearBrake" 
                    value={selectedProduct.rearBrake || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Single 245mm Disc" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Suspension */}
                <div className={styles.formField}>
                  <label className={styles.label}>Front Suspension</label>
                  <input 
                    name="frontSuspension" 
                    value={selectedProduct.frontSuspension || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Öhlins USD Fork" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Rear Suspension</label>
                  <input 
                    name="rearSuspension" 
                    value={selectedProduct.rearSuspension || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Öhlins Monoshock" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Tyres */}
                <div className={styles.formField}>
                  <label className={styles.label}>Front Tyre</label>
                  <input 
                    name="frontTyre" 
                    value={selectedProduct.frontTyre || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 120/70 ZR17" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Rear Tyre</label>
                  <input 
                    name="rearTyre" 
                    value={selectedProduct.rearTyre || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 200/60 ZR17" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Tyre Type</label>
                  <input 
                    name="tyreType" 
                    value={selectedProduct.tyreType || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Tubeless" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Dimensions & Capacity */}
                <div className={styles.formField}>
                  <label className={styles.label}>Fuel Tank Capacity (L)</label>
                  <input 
                    name="fuelTankCapacityL" 
                    value={selectedProduct.fuelTankCapacityL || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 16.5" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Seat Height (mm)</label>
                  <input 
                    name="seatHeightMm" 
                    value={selectedProduct.seatHeightMm || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 830" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Ground Clearance (mm)</label>
                  <input 
                    name="groundClearanceMm" 
                    value={selectedProduct.groundClearanceMm || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 140" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Kerb Weight (kg)</label>
                  <input 
                    name="kerbWeightKg" 
                    value={selectedProduct.kerbWeightKg || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 195" 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                {/* Pricing & Stock */}
                <div className={styles.formField}>
                  <label className={styles.label}>Price (Rs.) *</label>
                  <input 
                    name="price" 
                    type="number" 
                    step="0.01" 
                    value={selectedProduct.price || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 2500000" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Stock *</label>
                  <input 
                    name="stock" 
                    type="number" 
                    value={selectedProduct.stock || ''} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 5" 
                    required 
                    className={styles.input} 
                    disabled={submitting} 
                  />
                </div>
              </div>

              <div className={styles.formField} style={{ marginTop: '1.5rem' }}>
                <label className={styles.label}>Bike Images:     </label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className={styles.fileInput} 
                  disabled={submitting} 
                />
              </div>

              <div className={styles.modalButtons}>
                <button type="submit" className={styles.saveButton} disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelButton} disabled={submitting}>
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
              <button onClick={() => handleDelete(confirmDeleteId)} className={styles.yesButton} disabled={submitting}>Yes, Delete</button>
              <button onClick={() => setConfirmDeleteId(null)}      className={styles.noButton}  disabled={submitting}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}