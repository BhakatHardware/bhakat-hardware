import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X, Layers } from 'lucide-react';

const TAGS = ['', 'Exclusive', 'Premium', 'Local', 'Imported'];
const EMPTY = { name: '', category: '', brand: '', description: '', imageUrl: '', tag: '', isPublished: true, isFeatured: false };

export default function ManageMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get('/api/materials/admin');
      setMaterials(res.data);
    } catch { toast.error('Failed to load.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
      setF('imageUrl', res.data.imageUrl);
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/materials/${editId}`, form);
        toast.success('Material updated.');
      } else {
        await axios.post('/api/materials', form);
        toast.success('Material added.');
      }
      setShowForm(false); setEditId(null); setForm(EMPTY);
      fetch();
    } catch { toast.error('Failed to save.'); }
  };

  const handleEdit = (m) => { setForm(m); setEditId(m._id); setShowForm(true); };
  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    await axios.delete(`/api/materials/${id}`);
    toast.success('Deleted.'); fetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Website Materials</h1>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>Manage products shown in the public catalog.</p>
        </div>
        <button className="btn-primary" style={{ gap: 6 }} onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY); }}>
          <Plus size={16} /> Add Material
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="glass-card" style={{ padding: 28, marginBottom: 20, border: '1px solid rgba(101,163,13,0.2)' }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>{editId ? 'Edit Material' : 'New Material'}</span>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="btn-ghost" style={{ padding: 6 }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Name *</label>
                  <input className="input-field" placeholder="Product name" value={form.name} onChange={e => setF('name', e.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Category *</label>
                  <input className="input-field" placeholder="e.g., Masonry, Plumbing" value={form.category} onChange={e => setF('category', e.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Brand / Supplier</label>
                  <input className="input-field" placeholder="e.g., MYK Arment" value={form.brand} onChange={e => setF('brand', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Tag</label>
                  <select className="input-field" value={form.tag} onChange={e => setF('tag', e.target.value)}>
                    {TAGS.map(t => <option key={t} value={t} style={{ background: '#ffffff' }}>{t || 'No Tag'}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Description</label>
                  <textarea className="input-field" rows={3} value={form.description} onChange={e => setF('description', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Image (Upload via Cloudinary)</label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ fontSize: '0.875rem' }} />
                    {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--color-lime-dark)', fontWeight: 600 }}>Uploading...</span>}
                  </div>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={form.isPublished} onChange={e => setF('isPublished', e.target.checked)} />
                    <span style={{ color: 'var(--color-ash)' }}>Published</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setF('isFeatured', e.target.checked)} />
                    <span style={{ color: 'var(--color-ash)' }}>Featured</span>
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button type="submit" className="btn-primary" style={{ gap: 6 }}><Save size={14} /> Save</button>
                <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Tag</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array(4).fill(0).map((_, i) => (
              <tr key={i}>{Array(6).fill(0).map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14, width: '80%' }} /></td>)}</tr>
            ))}
            {!loading && materials.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 60, color: 'var(--color-ash)' }}>
                <Layers size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                No materials yet.
              </td></tr>
            )}
            {!loading && materials.map(m => (
              <tr key={m._id} style={{ opacity: m.isPublished ? 1 : 0.5 }}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td><span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{m.category}</span></td>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{m.brand || '—'}</td>
                <td>{m.tag ? <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{m.tag}</span> : <span style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>—</span>}</td>
                <td>{m.isPublished ? <span className="badge badge-green">Published</span> : <span className="badge badge-gray">Hidden</span>}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleEdit(m)} className="btn-ghost" style={{ padding: '5px 10px', fontSize: '0.8rem', gap: 4 }}><Edit2 size={12} /> Edit</button>
                    <button onClick={() => handleDelete(m._id)} className="btn-ghost" style={{ padding: '5px 10px', fontSize: '0.8rem', gap: 4, color: '#f87171' }}><Trash2 size={12} /> Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>
    </div>
  );
}
