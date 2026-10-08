import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Search, AlertTriangle, Package, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';

const CATEGORIES = ['All', 'General Hardware', 'Plumbing', 'Electrical', 'Paint & Related', 'Construction Materials', 'Tools'];

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [total, setTotal] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load products.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [search, category]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted.');
      fetchProducts();
    } catch { toast.error('Failed to delete.'); }
    setOpenMenu(null);
  };

  const stockBadge = (qty) => {
    if (qty === 0) return <span className="badge badge-red">Out of Stock</span>;
    if (qty <= 5) return <span className="badge badge-gold">Low Stock</span>;
    return <span className="badge badge-green">In Stock</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Inventory</h1>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>{total} products across all categories</p>
        </div>
        <Link to="/admin/inventory/add" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ash)' }} />
          <input className="input-field" style={{ paddingLeft: 38 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ flex: '0 1 200px' }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#ffffff' }}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Size/Unit</th>
                <th>Batches</th>
                <th>Stock</th>
                <th>Avg Cost</th>
                <th>Selling Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && Array(5).fill(0).map((_, i) => (
                <tr key={i}>
                  {Array(9).fill(0).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 16, width: '80%' }} /></td>
                  ))}
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 60, color: 'var(--color-ash)' }}>
                  <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                  No products found. <Link to="/admin/inventory/add" style={{ color: 'var(--color-lime-dark)' }}>Add your first product.</Link>
                </td></tr>
              )}
              {!loading && products.map(p => (
                <tr key={p._id} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={16} color="var(--color-ash)" />
                        </div>
                      )}
                      <div>
                        <Link to={`/admin/inventory/${p._id}`} style={{ color: 'var(--color-dark)', textDecoration: 'none', fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</Link>
                        {p.description && <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 2 }}>{p.description.slice(0, 50)}{p.description.length > 50 ? '...' : ''}</div>}
                      </div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-ash)' }}>{p.sku}</span></td>
                  <td><span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{p.category}</span></td>
                  <td style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>{p.size ? `${p.size} / ` : ''}{p.unit}</td>
                  <td style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>{p.batches?.filter(b => b.quantityRemaining > 0).length || 0} active</td>
                  <td style={{ fontWeight: 700 }}>{p.totalStock}</td>
                  <td style={{ color: 'var(--color-ash)', fontSize: '0.85rem' }}>{fmt(p.avgPurchasePrice)}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-lime-dark)' }}>{fmt(p.sellingPrice)}</td>
                  <td>{stockBadge(p.totalStock)}</td>
                  <td style={{ position: 'relative' }}>
                    <button onClick={() => setOpenMenu(openMenu === p._id ? null : p._id)}
                      className="btn-ghost" style={{ padding: 6 }}>
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === p._id && (
                      <div className="glass-card" style={{ position: 'absolute', right: 0, top: 32, zIndex: 50, minWidth: 140, padding: 8 }}>
                        <Link to={`/admin/inventory/${p._id}`} className="sidebar-link" style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                          <Edit size={14} /> Edit / View
                        </Link>
                        <button onClick={() => handleDelete(p._id)} className="sidebar-link" style={{ width: '100%', border: 'none', background: 'none', color: '#f87171', fontSize: '0.8rem', padding: '8px 12px' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
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
