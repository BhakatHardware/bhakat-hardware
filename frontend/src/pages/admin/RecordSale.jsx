import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Plus, Trash2, ShoppingCart, ChevronDown } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function RecordSale() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [items, setItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [amountPaid, setAmountPaid] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/products', { params: { limit: 200 } }).then(r => setProducts(r.data.products || []));
  }, []);

  const handleSearch = (q) => {
    setSearchQ(q);
    if (!q) { setSearchResults([]); return; }
    const results = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) && p.totalStock > 0);
    setSearchResults(results.slice(0, 8));
  };

  const addItem = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product._id && !i.batchId);
      if (existing) {
        return prev.map(i => i.productId === product._id && !i.batchId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product._id,
        productName: product.name,
        productSku: product.sku,
        sellingPrice: product.sellingPrice,
        quantity: 1,
        batchId: null, // null = auto (FIFO)
        maxStock: product.totalStock,
        batches: product.batches?.filter(b => b.quantityRemaining > 0) || [],
      }];
    });
    setSearchQ('');
    setSearchResults([]);
  };

  const updateItem = (idx, key, val) => setItems(prev => prev.map((item, i) => i === idx ? { ...item, [key]: val } : item));
  const removeItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, item) => s + (item.sellingPrice * item.quantity), 0);
  const totalAmount = subtotal - Number(discount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Add at least one item.');
    setLoading(true);
    try {
      await axios.post('/api/sales', {
        customerName, customerPhone,
        items: items.map(i => ({ productId: i.productId, sellingPrice: i.sellingPrice, quantity: i.quantity, batchId: i.batchId })),
        discount: Number(discount),
        paymentMode, paymentStatus,
        amountPaid: paymentStatus === 'Paid' ? totalAmount : Number(amountPaid),
        note,
      });
      toast.success('Sale recorded successfully!');
      navigate('/admin/sales/history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record sale.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Record Sale</h1>
        <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>Add items and complete the transaction.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Info */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Customer (Optional)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            <div>
              <label className="input-label">Customer Name</label>
              <input className="input-field" placeholder="Walk-in Customer" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div>
              <label className="input-label">Phone</label>
              <input className="input-field" placeholder="+91 XXXXX XXXXX" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          {/* Live Search Feed */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ash)' }} />
            <input className="input-field" style={{ paddingLeft: 38 }} placeholder="Type to search products (e.g. pipe, 2mm)..." 
              value={searchQ} onChange={e => handleSearch(e.target.value)} />
            {searchResults.length > 0 && (
              <div className="glass-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 4, padding: 6, maxHeight: 300, overflowY: 'auto' }}>
                {searchResults.map(p => (
                  <button key={p._id} type="button" onClick={() => addItem(p)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 12px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 6, textAlign: 'left', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(101,163,13,0.08)'}
                    onMouseOut={e => e.currentTarget.style.background = 'none'}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-dark)' }}>{p.name} {p.size ? `(${p.size})` : ''}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>{p.category} · <span style={{ color: 'var(--color-lime-dark)', fontWeight: 600 }}>{p.totalStock} in stock</span></div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--color-lime-dark)', fontSize: '0.875rem' }}>{fmt(p.sellingPrice)}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item List */}
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-ash)' }}>
              <ShoppingCart size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
              <p style={{ fontSize: '0.875rem' }}>No items added yet.</p>
            </div>
          )}

          {items.map((item, idx) => (
            <motion.div key={`${item.productId}-${idx}`} className="glass-card-light" style={{ padding: '16px 20px', marginBottom: 10, border: '1px solid rgba(0,0,0,0.04)' }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>Stock: {item.maxStock} {item.productSku ? `· ${item.productSku}` : ''}</div>
                </div>
                <button type="button" onClick={() => removeItem(idx)} className="btn-ghost" style={{ padding: 4, color: '#f87171' }}>
                  <Trash2 size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
                <div>
                  <label className="input-label">Qty</label>
                  <input className="input-field" type="number" min="1" max={item.maxStock} value={item.quantity}
                    onChange={e => updateItem(idx, 'quantity', Math.min(Number(e.target.value), item.maxStock))} />
                </div>
                <div>
                  <label className="input-label">Price / Unit (₹)</label>
                  <input className="input-field" type="number" min="0" step="0.01" value={item.sellingPrice}
                    onChange={e => updateItem(idx, 'sellingPrice', e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Sell From Batch</label>
                  <select className="input-field" value={item.batchId || ''} onChange={e => updateItem(idx, 'batchId', e.target.value || null)}>
                    <option value="" style={{ background: '#ffffff' }}>Auto (No Preference)</option>
                    {item.batches.map(b => (
                      <option key={b.batchId} value={b.batchId} style={{ background: '#ffffff' }}>
                        {b.batchId} · Cost:{fmt(b.purchasePrice)} · {b.quantityRemaining} left
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-lime-dark)' }}>
                  Line Total: {fmt(item.sellingPrice * item.quantity)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Payment Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div>
              <label className="input-label">Payment Mode</label>
              <select className="input-field" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                {['Cash', 'UPI', 'Credit', 'Cheque', 'Other'].map(m => <option key={m} value={m} style={{ background: '#ffffff' }}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Payment Status</label>
              <select className="input-field" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                {['Paid', 'Partial', 'Pending'].map(s => <option key={s} value={s} style={{ background: '#ffffff' }}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="input-label">Discount (₹)</label>
              <input className="input-field" type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" />
            </div>
            {paymentStatus !== 'Paid' && (
              <div>
                <label className="input-label">Amount Paid (₹)</label>
                <input className="input-field" type="number" min="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
              </div>
            )}
          </div>
          <div>
            <label className="input-label">Note</label>
            <input className="input-field" placeholder="Optional note..." value={note} onChange={e => setNote(e.target.value)} />
          </div>
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="glass-card" style={{ padding: 24, marginBottom: 20, background: 'rgba(101,163,13,0.04)', border: '1px solid rgba(101,163,13,0.15)' }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem', color: 'var(--color-lime-dark)' }}>Bill Summary</div>
            {[
              { label: 'Subtotal', value: fmt(subtotal) },
              { label: 'Discount', value: `-${fmt(discount)}`, color: '#4ade80' },
              { label: 'Total Amount', value: fmt(totalAmount), bold: true, big: true },
              paymentStatus !== 'Paid' ? { label: 'Amount Paid', value: fmt(amountPaid), color: '#60a5fa' } : null,
              paymentStatus !== 'Paid' ? { label: 'Amount Due', value: fmt(totalAmount - (amountPaid || 0)), color: '#f87171' } : null,
            ].filter(Boolean).map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ color: r.bold ? 'var(--color-white)' : 'var(--color-ash)', fontWeight: r.bold ? 700 : 400, fontSize: r.big ? '1rem' : '0.875rem' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.color || (r.bold ? 'var(--color-lime-dark)' : 'var(--color-white)'), fontSize: r.big ? '1.1rem' : '0.9rem' }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading || items.length === 0} style={{ padding: '13px 36px', fontSize: '0.95rem' }}>
          {loading ? 'Recording...' : `Record Sale · ${fmt(totalAmount)}`}
        </button>
      </form>
    </div>
  );
}
