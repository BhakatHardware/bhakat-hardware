import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Edit2, Save, X, Package } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const UNITS = ['pcs', 'kg', 'meter', 'bag', 'bundle', 'liter', 'sqft', 'ton', 'set', 'pair', 'roll', 'box', 'sheet'];
const CATEGORIES = ['General Hardware', 'Plumbing', 'Electrical', 'Paint & Related', 'Construction Materials', 'Tools'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addingBatch, setAddingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({ purchasePrice: '', quantityBought: '', purchaseNote: '' });

  const fetch = async () => {
    try {
      const [res, salesRes] = await Promise.all([
        axios.get(`/api/products/${id}`),
        axios.get(`/api/sales/product/${id}`)
      ]);
      setProduct(res.data);
      setSalesHistory(salesRes.data);
      setEditForm({
        name: res.data.name, category: res.data.category, subCategory: res.data.subCategory,
        size: res.data.size, unit: res.data.unit, sellingPrice: res.data.sellingPrice,
        description: res.data.description, imageUrl: res.data.imageUrl || '',
      });
    } catch { toast.error('Product not found.'); navigate('/admin/inventory'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`/api/products/${id}`, editForm);
      toast.success('Product updated.');
      setEditing(false);
      fetch();
    } catch { toast.error('Failed to update.'); }
  };

  const [uploading, setUploading] = useState(false);
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
      setEditForm(f => ({ ...f, imageUrl: res.data.imageUrl }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddBatch = async () => {
    if (!batchForm.purchasePrice || !batchForm.quantityBought) return toast.error('Price and quantity required.');
    try {
      await axios.post(`/api/products/${id}/batch`, batchForm);
      toast.success('New batch added!');
      setAddingBatch(false);
      setBatchForm({ purchasePrice: '', quantityBought: '', purchaseNote: '' });
      fetch();
    } catch { toast.error('Failed to add batch.'); }
  };

  if (loading) return <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />;
  if (!product) return null;

  const activeBatches = product.batches?.filter(b => b.quantityRemaining > 0) || [];
  const exhaustedBatches = product.batches?.filter(b => b.quantityRemaining <= 0) || [];

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <button onClick={() => navigate('/admin/inventory')} className="btn-ghost" style={{ padding: 8 }}><ArrowLeft size={18} /></button>
        {product.imageUrl && !editing && (
          <img src={product.imageUrl} alt={product.name} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Stock', value: product.totalStock, color: product.totalStock === 0 ? '#f87171' : product.totalStock <= 5 ? '#fbbf24' : '#4ade80' },
          { label: 'Avg Cost', value: fmt(product.avgPurchasePrice), color: 'var(--color-ash)' },
          { label: 'Selling Price', value: fmt(product.sellingPrice), color: 'var(--color-lime-dark)' },
          { label: 'Active Batches', value: activeBatches.length, color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
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
              <label className="input-label">Name</label>
              <input className="input-field" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
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
              <label className="input-label">Unit</label>
              <select className="input-field" value={editForm.unit} onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u} value={u} style={{ background: '#ffffff' }}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Selling Price (₹)</label>
              <input className="input-field" type="number" value={editForm.sellingPrice} onChange={e => setEditForm(f => ({ ...f, sellingPrice: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Description</label>
              <textarea className="input-field" rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="input-label">Product Image (Cloudinary)</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ fontSize: '0.875rem' }} />
                {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--color-lime-dark)' }}>Uploading...</span>}
              </div>
              {editForm.imageUrl && (
                <img src={editForm.imageUrl} alt="Preview" style={{ height: 60, borderRadius: 6, objectFit: 'cover' }} />
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Batches */}
      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700 }}>Purchase Batches</div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', gap: 6 }} onClick={() => setAddingBatch(a => !a)}>
            <Plus size={14} /> Add Restock
          </button>
        </div>

        {/* Add Batch Form */}
        {addingBatch && (
          <motion.div style={{ background: 'rgba(101,163,13,0.05)', border: '1px solid rgba(101,163,13,0.2)', borderRadius: 10, padding: 20, marginBottom: 20 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 16, color: 'var(--color-lime-dark)' }}>New Purchase Batch</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <div>
                <label className="input-label">Purchase Price / Unit (₹)</label>
                <input className="input-field" type="number" min="0" step="0.01" placeholder="0.00"
                  value={batchForm.purchasePrice} onChange={e => setBatchForm(f => ({ ...f, purchasePrice: e.target.value }))} />
              </div>
              <div>
                <label className="input-label">Quantity</label>
                <input className="input-field" type="number" min="1" placeholder="0"
                  value={batchForm.quantityBought} onChange={e => setBatchForm(f => ({ ...f, quantityBought: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label className="input-label">Note</label>
                <input className="input-field" placeholder="Supplier, invoice number, etc."
                  value={batchForm.purchaseNote} onChange={e => setBatchForm(f => ({ ...f, purchaseNote: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={handleAddBatch} className="btn-primary" style={{ padding: '9px 20px', fontSize: '0.85rem' }}>Add Batch</button>
              <button onClick={() => setAddingBatch(false)} className="btn-ghost">Cancel</button>
            </div>
          </motion.div>
        )}

        {/* Active Batches */}
        {activeBatches.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4ade80', letterSpacing: '0.1em', marginBottom: 10 }}>ACTIVE BATCHES</div>
            {activeBatches.map(b => (
              <div key={b.batchId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-dark)' }}>Batch #{b.batchId}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 2 }}>{b.note || 'No notes'}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ash)' }}>{new Date(b.purchaseDate).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-lime-dark)' }}>{fmt(b.purchasePrice)}/unit</div>
                  <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: 2 }}>{b.quantityRemaining} / {b.quantityBought} left</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exhausted Batches */}
        {exhaustedBatches.length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ash)', letterSpacing: '0.1em', marginBottom: 10 }}>EXHAUSTED BATCHES</div>
            {exhaustedBatches.map(b => (
              <div key={b.batchId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(0,0,0,0.02)', borderRadius: 10, marginBottom: 6, opacity: 0.5 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>Batch #{b.batchId}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-ash)' }}>{b.note || 'No notes'} · {new Date(b.purchaseDate).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{fmt(b.purchasePrice)}/unit</div>
                  <div style={{ fontSize: '0.75rem', color: '#f87171' }}>Sold Out ({b.quantityBought} bought)</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {product.batches?.length === 0 && <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>No batches yet.</p>}
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
