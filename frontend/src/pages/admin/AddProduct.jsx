import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Package } from 'lucide-react';

const CATEGORIES = ['General Hardware', 'Plumbing', 'Electrical', 'Paint & Related', 'Construction Materials', 'Tools'];
const UNITS = ['pcs', 'kg', 'meter', 'bag', 'bundle', 'liter', 'sqft', 'ton', 'set', 'pair', 'roll', 'box', 'sheet'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', category: 'General Hardware', subCategory: '', size: '', unit: 'pcs',
    sellingPrice: '', description: '',
    purchasePrice: '', quantityBought: '', purchaseNote: '', imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      set('imageUrl', res.data.imageUrl);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.purchasePrice || !form.quantityBought) return toast.error('Purchase price and quantity are required.');
    setLoading(true);
    try {
      await axios.post('/api/products', form);
      toast.success('Product added to inventory!');
      navigate('/admin/inventory');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: 8 }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Add New Product</h1>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>Add a product with its first purchase batch.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Product Info */}
        <motion.div className="glass-card" style={{ padding: 28, marginBottom: 20 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Package size={18} color="var(--color-lime-dark)" />
            <span style={{ fontWeight: 700 }}>Product Information</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Product Name *</label>
              <input className="input-field" placeholder="e.g., PVC Pipe 1 inch" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>

            <div>
              <label className="input-label">Category *</label>
              <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#ffffff' }}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="input-label">Sub-Category</label>
              <input className="input-field" placeholder="e.g., PVC Pipes, TMT Steel" value={form.subCategory} onChange={e => set('subCategory', e.target.value)} />
            </div>

            <div>
              <label className="input-label">Size / Spec</label>
              <input className="input-field" placeholder="e.g., 3/4 inch, 2mm, 10mm" value={form.size} onChange={e => set('size', e.target.value)} />
            </div>

            <div>
              <label className="input-label">Unit</label>
              <select className="input-field" value={form.unit} onChange={e => set('unit', e.target.value)}>
                {UNITS.map(u => <option key={u} value={u} style={{ background: '#ffffff' }}>{u}</option>)}
              </select>
            </div>

            <div>
              <label className="input-label">Selling Price (₹) *</label>
              <input className="input-field" type="number" min="0" step="0.01" placeholder="0.00" value={form.sellingPrice} onChange={e => set('sellingPrice', e.target.value)} required />
            </div>

            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Description</label>
              <textarea className="input-field" rows={2} placeholder="Optional product description..." value={form.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Product Image</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ fontSize: '0.875rem' }} />
                {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--color-lime-dark)', fontWeight: 600 }}>Uploading...</span>}
              </div>
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--color-border)' }} />
              )}
            </div>
          </div>
        </motion.div>

        {/* First Batch / Purchase */}
        <motion.div className="glass-card" style={{ padding: 28, marginBottom: 24, border: '1px solid rgba(101,163,13,0.2)' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontWeight: 700 }}>First Purchase Batch</span>
            <span className="badge badge-gold">Batch #1</span>
          </div>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.8rem', marginBottom: 20 }}>
            Record the first time you're buying/adding this product to stock.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="input-label">Purchase Price / Unit (₹) *</label>
              <input className="input-field" type="number" min="0" step="0.01" placeholder="0.00" value={form.purchasePrice} onChange={e => set('purchasePrice', e.target.value)} required />
              {form.sellingPrice && form.purchasePrice && (
                <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: 4 }}>
                  Margin: ₹{(form.sellingPrice - form.purchasePrice).toFixed(2)} ({(((form.sellingPrice - form.purchasePrice) / form.purchasePrice) * 100).toFixed(1)}%)
                </div>
              )}
            </div>

            <div>
              <label className="input-label">Quantity Bought *</label>
              <input className="input-field" type="number" min="1" placeholder="0" value={form.quantityBought} onChange={e => set('quantityBought', e.target.value)} required />
              {form.purchasePrice && form.quantityBought && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>
                  Total cost: ₹{(form.purchasePrice * form.quantityBought).toLocaleString('en-IN')}
                </div>
              )}
            </div>

            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Batch Note</label>
              <input className="input-field" placeholder="e.g., Bought from Ramesh Traders, invoice #123" value={form.purchaseNote} onChange={e => set('purchaseNote', e.target.value)} />
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '12px 32px' }}>
            {loading ? 'Adding...' : 'Add to Inventory'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => navigate('/admin/inventory')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
