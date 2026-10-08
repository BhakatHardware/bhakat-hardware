import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Receipt, TrendingUp } from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

export default function SalesHistory() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [expanded, setExpanded] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (paymentStatus) params.paymentStatus = paymentStatus;
      const res = await axios.get('/api/sales', { params });
      setSales(res.data.sales);
      setTotal(res.data.total);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSales(); }, [startDate, endDate, paymentStatus]);

  const statusBadge = (s) => {
    if (s === 'Paid') return <span className="badge badge-green">{s}</span>;
    if (s === 'Partial') return <span className="badge badge-gold">{s}</span>;
    return <span className="badge badge-red">{s}</span>;
  };

  const totalRevenue = sales.reduce((s, sale) => s + sale.totalAmount, 0);
  const totalProfit = sales.reduce((s, sale) => s + sale.totalProfit, 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Sales History</h1>
        <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>{total} transactions found</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Revenue', value: fmt(totalRevenue), color: '#4ade80' },
          { label: 'Total Profit', value: fmt(totalProfit), color: 'var(--color-lime-dark)' },
          { label: 'Transactions', value: sales.length, color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <label className="input-label">From Date</label>
          <input className="input-field" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: 'auto' }} />
        </div>
        <div>
          <label className="input-label">To Date</label>
          <input className="input-field" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ width: 'auto' }} />
        </div>
        <div>
          <label className="input-label">Payment Status</label>
          <select className="input-field" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} style={{ width: 'auto' }}>
            <option value="">All</option>
            {['Paid', 'Partial', 'Pending'].map(s => <option key={s} value={s} style={{ background: '#ffffff' }}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <motion.div className="glass-card" style={{ overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Payment</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading && Array(5).fill(0).map((_, i) => (
                <tr key={i}>{Array(9).fill(0).map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14, width: '80%' }} /></td>)}</tr>
              ))}
              {!loading && sales.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 60, color: 'var(--color-ash)' }}>
                  <Receipt size={40} style={{ margin: '0 auto 12px', opacity: 0.3, display: 'block' }} />
                  No sales recorded yet.
                </td></tr>
              )}
              {!loading && sales.map(sale => (
                <>
                  <tr key={sale._id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === sale._id ? null : sale._id)}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-lime-dark)' }}>{sale.invoiceNumber}</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{sale.customerName}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{new Date(sale.saleDate).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{sale.items?.length} items</td>
                    <td style={{ fontWeight: 700, color: '#4ade80' }}>{fmt(sale.totalAmount)}</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-lime-dark)' }}>{fmt(sale.totalProfit)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{sale.paymentMode}</td>
                    <td>{statusBadge(sale.paymentStatus)}</td>
                    <td style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>{expanded === sale._id ? '▲' : '▼'}</td>
                  </tr>
                  {expanded === sale._id && (
                    <tr key={`${sale._id}-detail`}>
                      <td colSpan={9} style={{ padding: '0 16px 16px' }}>
                        <div style={{ background: 'rgba(101,163,13,0.04)', border: '1px solid rgba(101,163,13,0.1)', borderRadius: 10, padding: 16 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-lime-dark)', marginBottom: 12 }}>LINE ITEMS</div>
                          {sale.items?.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)', fontSize: '0.8rem' }}>
                              <span style={{ color: 'var(--color-dark)' }}>{item.productName}</span>
                              <span style={{ color: 'var(--color-ash)' }}>{item.quantity} × {fmt(item.sellingPrice)}</span>
                              <span style={{ color: '#4ade80', fontWeight: 600 }}>{fmt(item.totalRevenue)}</span>
                              <span style={{ color: 'var(--color-lime-dark)' }}>Profit: {fmt(item.profit)}</span>
                            </div>
                          ))}
                          {sale.discount > 0 && <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8, fontSize: '0.8rem', color: '#4ade80' }}>Discount: -{fmt(sale.discount)}</div>}
                          {sale.amountDue > 0 && <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, fontSize: '0.8rem', color: '#f87171' }}>Due: {fmt(sale.amountDue)}</div>}
                          {sale.note && <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--color-ash)' }}>Note: {sale.note}</div>}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
