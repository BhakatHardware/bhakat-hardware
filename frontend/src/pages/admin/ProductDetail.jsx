import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Edit2, Save, X, Package, TrendingUp } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import { useImageModal } from '../../context/ImageModalContext';
import ImageUploadInput from '../../components/common/ImageUploadInput';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const UNITS = ['pcs', 'kg', 'meter', 'bag', 'bundle', 'liter', 'sqft', 'ton', 'set', 'pair', 'roll', 'box', 'sheet'];
const CATEGORIES = ['General Hardware', 'Plumbing', 'Electrical', 'Paint & Related', 'Construction Materials', 'Tools'];

export default function ProductDetail() {
  const { openImage } = useImageModal();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addingStock, setAddingStock] = useState(false);
  const [restockForm, setRestockForm] = useState({ quantity: '', purchasePrice: '' });

  const fetch = async () => {
    try {
      const [res, salesRes] = await Promise.all([
        axios.get(`/api/products/${id}`),
        axios.get(`/api/sales/product/${id}`)
      ]);
      setProduct(res.data);
      setSalesHistory(salesRes.data);
      setEditForm({
        name: res.data.name,
        category: res.data.category,
        subCategory: res.data.subCategory,
        size: res.data.size,
        unit: res.data.unit,
        purchasePrice: res.data.purchasePrice ?? res.data.avgPurchasePrice ?? 0,
        sellingPrice: res.data.sellingPrice ?? 0,
        totalStock: res.data.totalStock ?? 0,
        description: res.data.description,
        imageUrl: res.data.imageUrl || '',
      });
      setRestockForm({
        quantity: '',
        purchasePrice: res.data.purchasePrice ?? res.data.avgPurchasePrice ?? ''
      });
    } catch {
      toast.error('Product not found.');
      navigate('/admin/inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleSave = async () => {
    if (!editForm.name?.trim()) return toast.error('Product name is required.');
    if (!editForm.unit?.trim()) return toast.error('Product unit is required.');
    try {
      await axios.put(`/api/products/${id}`, editForm);
      toast.success('Product updated.');
      setEditing(false);
      fetch();
    } catch {
      toast.error('Failed to update.');
    }
  };

  const handleRestock = async () => {
    const qty = Number(restockForm.quantity);
    if (!qty || qty <= 0) return toast.error('Please enter a valid quantity to add.');
    try {
      await axios.post(`/api/products/${id}/restock`, restockForm);
      toast.success('Stock updated successfully!');
      setAddingStock(false);
      fetch();
    } catch {
      toast.error('Failed to update stock.');
    }
  };

  if (loading) return <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />;
  if (!product) return null;

  const currentPurchasePrice = Number(product.purchasePrice ?? product.avgPurchasePrice ?? 0);
  const currentSellingPrice = Number(product.sellingPrice ?? 0);
  const marginAmt = currentSellingPrice - currentPurchasePrice;
  const marginPct = currentPurchasePrice > 0 ? ((marginAmt / currentPurchasePrice) * 100).toFixed(1) : 0;

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/admin/inventory')} className="btn-ghost" style={{ padding: 8 }}><ArrowLeft size={18} /></button>
        {product.imageUrl && !editing && (
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            onError={handleImageError}
            onClick={() => openImage(getImageUrl(product.imageUrl), product.name, `${product.category} • SKU: ${product.sku || 'N/A'}`)}
            title="Click to view full image"
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              objectFit: 'cover',
              cursor: 'zoom-in',
              border: '1px solid var(--color-border)',
              transition: 'transform 0.15s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        )}
        <div style={{ flex: 1 }}>
          <h1 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{product.name}</h1>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{product.category}</span>
            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--color-ash)' }}>{product.sku}</span>
          </div>
        </div>
        <button onClick={() => setEditing(e => !e)} className={editing ? 'btn-outline' : 'btn-ghost'} style={{ gap: 6 }}>
          {editing ? <><X size={14} /> Cancel</> : <><Edit2 size={14} /> Edit</>}
        </button>
        {editing && <button onClick={handleSave} className="btn-primary" style={{ gap: 6 }}><Save size={14} /> Save</button>}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Stock', value: `${product.totalStock} ${product.unit}`, color: product.totalStock === 0 ? '#f87171' : product.totalStock <= 5 ? '#fbbf24' : '#4ade80' },
          { label: 'Purchase Price', value: fmt(currentPurchasePrice), color: 'var(--color-ash)' },
          { label: 'Selling Price', value: fmt(currentSellingPrice), color: 'var(--color-lime-dark)' },
          { label: 'Margin', value: `${fmt(marginAmt)} (${marginPct}%)`, color: marginAmt >= 0 ? '#4ade80' : '#f87171' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {editing && (
        <motion.div className="glass-card" style={{ padding: 24, marginBottom: 20, border: '1px solid rgba(101,163,13,0.2)' }}
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Name *</label>
              <input className="input-field" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="input-label">Category</label>
              <select className="input-field" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#ffffff' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Sub-Category</label>
              <input className="input-field" value={editForm.subCategory} onChange={e => setEditForm(f => ({ ...f, subCategory: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Size</label>
              <input className="input-field" value={editForm.size} onChange={e => setEditForm(f => ({ ...f, size: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Unit *</label>
              <select className="input-field" value={editForm.unit} onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))} required>
                {UNITS.map(u => <option key={u} value={u} style={{ background: '#ffffff' }}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Purchase Price / Cost (₹)</label>
              <input className="input-field" type="number" min="0" step="0.01" value={editForm.purchasePrice} onChange={e => setEditForm(f => ({ ...f, purchasePrice: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Selling Price (₹)</label>
              <input className="input-field" type="number" min="0" step="0.01" value={editForm.sellingPrice} onChange={e => setEditForm(f => ({ ...f, sellingPrice: e.target.value }))} />
            </div>
            <div>
              <label className="input-label">Current Stock</label>
              <input className="input-field" type="number" min="0" value={editForm.totalStock} onChange={e => setEditForm(f => ({ ...f, totalStock: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Description</label>
              <textarea className="input-field" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <ImageUploadInput
                value={editForm.imageUrl}
                onChange={(url) => setEditForm(f => ({ ...f, imageUrl: url }))}
                label="Product Image (Cloudinary)"
                helperText="Upload to Cloudinary: Tap 'Take Photo' to open camera directly, or choose from gallery."
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stock Management / Quick Restock */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: addingStock ? 16 : 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>Stock Management</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-ash)', marginTop: 2 }}>
              Current stock: <strong style={{ color: 'var(--color-dark)' }}>{product.totalStock} {product.unit}</strong> · Cost: <strong>{fmt(currentPurchasePrice)}</strong>
            </div>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', gap: 6 }} onClick={() => setAddingStock(a => !a)}>
            <Plus size={14} /> Add Stock / Restock
          </button>
        </div>

        {/* Restock Form */}
        {addingStock && (
          <motion.div style={{ background: 'rgba(101,163,13,0.05)', border: '1px solid rgba(101,163,13,0.2)', borderRadius: 10, padding: 20, marginTop: 12 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 14, color: 'var(--color-lime-dark)' }}>Add Stock & Update Purchase Price</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
              <div>
                <label className="input-label">Quantity to Add *</label>
                <input className="input-field" type="number" min="1" placeholder="e.g. 10"
                  value={restockForm.quantity} onChange={e => setRestockForm(f => ({ ...f, quantity: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">New Purchase Price / Unit (₹)</label>
                <input className="input-field" type="number" min="0" step="0.01" placeholder={String(currentPurchasePrice)}
                  value={restockForm.purchasePrice} onChange={e => setRestockForm(f => ({ ...f, purchasePrice: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button onClick={handleRestock} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>Save Stock</button>
              <button onClick={() => setAddingStock(false)} className="btn-ghost">Cancel</button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sales History */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 40 }}>
        <div style={{ fontWeight: 700, marginBottom: 20 }}>Sales History for {product.name}</div>
        {salesHistory.length === 0 ? (
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>No sales recorded for this product yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Qty</th>
                <th>Revenue</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.map(sale => (
                <tr key={sale.saleId}>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{new Date(sale.saleDate).toLocaleDateString('en-IN')}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-lime-dark)' }}>{sale.invoiceNumber}</td>
                  <td>{sale.customerName || 'Walk-in'}</td>
                  <td style={{ fontWeight: 700 }}>{sale.quantity}</td>
                  <td>{fmt(sale.sellingPrice * sale.quantity)}</td>
                  <td style={{ color: sale.profit > 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>{fmt(sale.profit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
