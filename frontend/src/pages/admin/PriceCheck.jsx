import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, X, Tag, Package, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'General Hardware', 'Plumbing', 'Electrical', 'Paint & Related', 'Construction Materials', 'Tools'];

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function PriceCheck() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchInputRef = useRef(null);

  // Load products with high limit for instant zero-lag counter checking
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/products', {
        params: { limit: 500 }
      });
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load product pricing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Auto-focus search input on page open
    searchInputRef.current?.focus();
  }, []);

  // Filter products instantly on client side
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!search.trim()) return true;

    const query = search.toLowerCase().trim();
    const nameMatch = item.name?.toLowerCase().includes(query);
    const skuMatch = item.sku?.toLowerCase().includes(query);
    const sizeMatch = item.size?.toLowerCase().includes(query);

    return nameMatch || skuMatch || sizeMatch;
  });

  const clearSearch = () => {
    setSearch('');
    searchInputRef.current?.focus();
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', width: '100%' }}>
      <Helmet>
        <title>Quick Price & Stock Check | Bhakat Hardware</title>
        <meta name="description" content="Instant counter price check and stock lookup for Bhakat Hardware products." />
      </Helmet>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Tag size={24} style={{ color: 'var(--color-lime-dark)' }} />
              Quick Price Check
            </h1>
            <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginTop: 2 }}>
              Instant price and available stock lookup for customers at the counter.
            </p>
          </div>
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', gap: 6, border: '1px solid var(--color-border)', borderRadius: 8, padding: '6px 14px' }}
            title="Refresh prices"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Large Instant Search Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-surface)', paddingTop: 4, paddingBottom: 16 }}>
        <div style={{ position: 'relative', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', borderRadius: 12 }}>
          <Search
            size={22}
            style={{
              position: 'absolute',
              left: 18,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-lime-dark)',
              pointerEvents: 'none'
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            className="input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product name or size (e.g. Berger, PVC 1 inch, Tap)..."
            style={{
              height: 56,
              fontSize: '1.15rem',
              fontWeight: 500,
              paddingLeft: 52,
              paddingRight: search ? 48 : 16,
              borderRadius: 12,
              border: '2px solid var(--color-border)',
              background: 'var(--color-white)',
            }}
          />
          {search && (
            <button
              onClick={clearSearch}
              type="button"
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'var(--color-surface)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--color-ash)',
              }}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 2px 2px', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  border: active ? '1.5px solid var(--color-dark)' : '1px solid var(--color-border)',
                  background: active ? 'var(--color-dark)' : 'var(--color-white)',
                  color: active ? 'var(--color-white)' : 'var(--color-ash)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Count bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, padding: '0 4px', fontSize: '0.8rem', color: 'var(--color-ash)' }}>
          <span>
            {loading ? 'Loading product prices...' : `Found ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}`}
          </span>
          {search && (
            <span style={{ color: 'var(--color-dark-muted)' }}>
              Filtering by: <strong>"{search}"</strong>
            </span>
          )}
        </div>
      </div>

      {/* Price & Stock List */}
      <div>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="glass-card" style={{ padding: '48px 24px', textAlign: 'center', borderRadius: 12 }}>
            <AlertCircle size={40} style={{ color: 'var(--color-ash)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 6 }}>
              No matching product found
            </h3>
            <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginBottom: 16 }}>
              Try checking your spelling or search with a different keyword.
            </p>
            {search && (
              <button onClick={clearSearch} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence>
              {filteredProducts.map((p) => {
                const stock = p.totalStock ?? 0;
                const isOutOfStock = stock <= 0;
                const isLowStock = stock > 0 && stock <= 5;

                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="glass-card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                      borderRadius: 12,
                      borderLeft: isOutOfStock
                        ? '5px solid #ef4444'
                        : isLowStock
                        ? '5px solid #f59e0b'
                        : '5px solid #22c55e',
                    }}
                  >
                    {/* Left: Product Name & Unit/Size */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <h2
                          style={{
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: 'var(--color-dark)',
                            margin: 0,
                            wordBreak: 'break-word',
                          }}
                        >
                          {p.name}
                        </h2>
                        {p.size && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'var(--color-surface)',
                              color: 'var(--color-dark-muted)',
                              padding: '2px 8px',
                              borderRadius: 4,
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            {p.size}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>
                        Category: {p.category} {p.sku ? `• SKU: ${p.sku}` : ''}
                      </div>
                    </div>

                    {/* Right: Selling Price & Quantity Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexShrink: 0, textAlign: 'right' }}>
                      {/* Selling Price */}
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-ash)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Selling Price
                        </div>
                        <div
                          style={{
                            fontSize: '1.45rem',
                            fontWeight: 800,
                            color: 'var(--color-dark)',
                            lineHeight: 1.2,
                            fontFamily: 'var(--font-display)',
                          }}
                        >
                          {fmt(p.sellingPrice)}
                        </div>
                      </div>

                      {/* Quantity Left */}
                      <div style={{ minWidth: 100, textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-ash)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Stock Left
                        </div>
                        {isOutOfStock ? (
                          <span
                            className="badge badge-red"
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              padding: '4px 10px',
                              marginTop: 2,
                            }}
                          >
                            0 {p.unit || 'pcs'} (Out)
                          </span>
                        ) : isLowStock ? (
                          <span
                            className="badge badge-gold"
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              padding: '4px 10px',
                              marginTop: 2,
                            }}
                          >
                            {stock} {p.unit || 'pcs'} left
                          </span>
                        ) : (
                          <span
                            className="badge badge-green"
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              padding: '4px 10px',
                              marginTop: 2,
                            }}
                          >
                            {stock} {p.unit || 'pcs'} left
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
