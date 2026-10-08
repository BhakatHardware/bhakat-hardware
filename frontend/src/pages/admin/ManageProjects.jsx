import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X, FolderKanban } from 'lucide-react';

const CATEGORIES = ['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Other'];
const EMPTY_FORM = { title: '', description: '', location: '', completionYear: '', category: 'Residential', imageUrl: '', materials: '', clientName: '', isFeatured: false, isPublished: true };

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const fetch = async () => {
    try {
      const res = await axios.get('/api/projects/admin');
      setProjects(res.data);
    } catch { toast.error('Failed to load projects.'); }
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
      const payload = { ...form, materials: form.materials ? form.materials.split(',').map(m => m.trim()).filter(Boolean) : [], completionYear: Number(form.completionYear) || undefined };
      if (editId) {
        await axios.put(`/api/projects/${editId}`, payload);
        toast.success('Project updated.');
      } else {
        await axios.post('/api/projects', payload);
        toast.success('Project added.');
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      fetch();
    } catch { toast.error('Failed to save project.'); }
  };

  const handleEdit = (p) => {
    setForm({ ...p, materials: p.materials?.join(', ') || '' });
    setEditId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await axios.delete(`/api/projects/${id}`);
    toast.success('Deleted.');
    fetch();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Manage Projects</h1>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>Add and manage projects displayed on the website.</p>
        </div>
        <button className="btn-primary" style={{ gap: 6 }} onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }}>
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="glass-card" style={{ padding: 28, marginBottom: 20, border: '1px solid rgba(101,163,13,0.2)' }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>{editId ? 'Edit Project' : 'New Project'}</span>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="btn-ghost" style={{ padding: 6 }}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Title *</label>
                  <input className="input-field" placeholder="Project title" value={form.title} onChange={e => setF('title', e.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <select className="input-field" value={form.category} onChange={e => setF('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#ffffff' }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Location</label>
                  <input className="input-field" placeholder="City/Area" value={form.location} onChange={e => setF('location', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Completion Year</label>
                  <input className="input-field" type="number" placeholder="2024" value={form.completionYear} onChange={e => setF('completionYear', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Client Name</label>
                  <input className="input-field" placeholder="Client / Builder name" value={form.clientName} onChange={e => setF('clientName', e.target.value)} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Description</label>
                  <textarea className="input-field" rows={3} placeholder="Describe the project..." value={form.description} onChange={e => setF('description', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Materials Used (comma-separated)</label>
                  <input className="input-field" placeholder="AAC Blocks, TMT Steel, Cement, Sand" value={form.materials} onChange={e => setF('materials', e.target.value)} />
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
                <button type="submit" className="btn-primary" style={{ gap: 6 }}><Save size={14} /> Save Project</button>
                <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {projects.map(p => (
            <motion.div key={p._id} className="glass-card" style={{ padding: 20, position: 'relative', opacity: p.isPublished ? 1 : 0.5 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: p.isPublished ? 1 : 0.5, y: 0 }}>
              {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 14 }} />}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{p.category}</span>
                {!p.isPublished && <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>Hidden</span>}
                {p.isFeatured && <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Featured</span>}
              </div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{p.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-ash)', marginBottom: 12 }}>{p.location} {p.completionYear ? `· ${p.completionYear}` : ''}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => handleEdit(p)} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px', gap: 4 }}><Edit2 size={12} /> Edit</button>
                <button onClick={() => handleDelete(p._id)} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '6px 12px', gap: 4, color: '#f87171' }}><Trash2 size={12} /> Delete</button>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0', color: 'var(--color-ash)' }}>
              <FolderKanban size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
              No projects yet. Add your first project!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
