import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Check, Search, IndianRupee, NotebookTabs, X } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function ManageDebts() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);
  
  const [form, setForm] = useState({ customerName: '', contactNumber: '', amountDue: '', description: '' });
  const [paymentForm, setPaymentForm] = useState({ amountPaid: '', note: '' });

  const fetch = async () => {
    try {
      const res = await axios.get('/api/debts');
      setDebts(res.data);
    } catch { toast.error('Failed to load ledger.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleAddDebt = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/debts', form);
      toast.success('Debt record added.');
      setShowForm(false);
      setForm({ customerName: '', contactNumber: '', amountDue: '', description: '' });
      fetch();
    } catch { toast.error('Failed to add record.'); }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/debts/${paymentModal._id}`, paymentForm);
      toast.success('Payment recorded successfully!');
      setPaymentModal(null);
      setPaymentForm({ amountPaid: '', note: '' });
      fetch();
    } catch { toast.error('Failed to record payment.'); }
  };

  const totalOutstanding = debts.reduce((s, d) => s + (d.amountDue || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Customer Ledger</h1>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>Track unpaid deliveries, debts, and payments.</p>
        </div>
        <button className="btn-primary" style={{ gap: 6 }} onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Debt Record
        </button>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24, background: 'rgba(101,163,13,0.05)', border: '1px solid rgba(101,163,13,0.1)' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-ash)' }}>Total Outstanding Money in Market</div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171' }}>{fmt(totalOutstanding)}</div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="glass-card" style={{ padding: 28, marginBottom: 20, border: '1px solid rgba(101,163,13,0.2)' }}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700 }}>Record Unpaid Delivery / Debt</span>
              <button onClick={() => setShowForm(false)} className="btn-ghost" style={{ padding: 6 }}><X size={16} /></button>
            </div>
            <form onSubmit={handleAddDebt}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div>
                  <label className="input-label">Customer Name *</label>
                  <input className="input-field" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
                </div>
                <div>
                  <label className="input-label">Contact Number</label>
                  <input className="input-field" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} />
                </div>
                <div>
                  <label className="input-label">Amount Due (₹) *</label>
                  <input className="input-field" type="number" value={form.amountDue} onChange={e => setForm({ ...form, amountDue: e.target.value })} required />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="input-label">Items Delivered / Note</label>
                  <input className="input-field" placeholder="e.g. 50 bags cement, TMT bars" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button type="submit" className="btn-primary">Save Record</button>
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Details</th>
              <th>Amount Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && debts.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 60, color: 'var(--color-ash)' }}>
                <NotebookTabs size={36} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                No pending debts.
              </td></tr>
            )}
            {!loading && debts.map(d => (
              <tr key={d._id} style={{ opacity: d.status === 'Paid' ? 0.5 : 1 }}>
                <td style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                <td style={{ fontWeight: 600 }}>
                  {d.customerName}
                  {d.contactNumber && <div style={{ fontSize: '0.7rem', color: 'var(--color-ash)', fontWeight: 400 }}>{d.contactNumber}</div>}
                </td>
                <td style={{ fontSize: '0.85rem' }}>{d.description || '—'}</td>
                <td style={{ fontWeight: 700, color: d.amountDue > 0 ? '#f87171' : '#4ade80' }}>{fmt(d.amountDue)}</td>
                <td>
                  <span className={`badge ${d.status === 'Paid' ? 'badge-green' : d.status === 'Partial' ? 'badge-blue' : 'badge-gray'}`}>
                    {d.status}
                  </span>
                </td>
                <td>
                  {d.amountDue > 0 ? (
                    <button onClick={() => setPaymentModal(d)} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#3b82f6', color: '#fff' }}>
                      Collect Payment
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)', fontWeight: 600 }}><Check size={14} style={{ display: 'inline', marginBottom: -2 }} /> Settled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </motion.div>

      {/* Payment Modal */}
      {paymentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: 400, padding: 30 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 10 }}>Record Payment</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-ash)', marginBottom: 20 }}>Collecting from <strong>{paymentModal.customerName}</strong>. Current due: {fmt(paymentModal.amountDue)}</p>
            <form onSubmit={handleRecordPayment}>
              <div style={{ marginBottom: 14 }}>
                <label className="input-label">Amount Paid (₹) *</label>
                <input className="input-field" type="number" min="1" max={paymentModal.amountDue} value={paymentForm.amountPaid} onChange={e => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })} required />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="input-label">Note (Optional)</label>
                <input className="input-field" placeholder="e.g. Paid via UPI" value={paymentForm.note} onChange={e => setPaymentForm({ ...paymentForm, note: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Confirm</button>
                <button type="button" className="btn-ghost" onClick={() => setPaymentModal(null)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
