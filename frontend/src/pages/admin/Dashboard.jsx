import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Package, TrendingUp, IndianRupee, AlertTriangle,
  ShoppingCart, BarChart3, ArrowRight, Clock, Users
} from 'lucide-react';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div className="glass-card stat-card"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{ color }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-dark)', lineHeight: 1 }}>{value}</div>
    <div style={{ color: 'var(--color-ash)', fontSize: '0.8rem', marginTop: 6 }}>{label}</div>
    {sub && <div style={{ color, fontSize: '0.75rem', marginTop: 4, fontWeight: 600 }}>{sub}</div>}
  </motion.div>
);

const MiniChart = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: '100%', borderRadius: 4, background: 'linear-gradient(to top, var(--color-lime-dark), var(--color-lime-light))', height: `${(d.revenue / max) * 52}px`, minHeight: 4, opacity: i === data.length - 1 ? 1 : 0.5 }} />
          <span style={{ fontSize: '0.6rem', color: 'var(--color-ash)' }}>{d.date?.slice(-2)}</span>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/dashboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
      {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 130, borderRadius: 16 }} />)}
    </div>
  );

  const inv = data?.inventory || {};
  const sales = data?.sales || {};

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>Welcome back. Here's what's happening today.</p>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Package} label="Total SKUs" value={inv.totalSKUs || 0} sub="Active products" color="#C9A84C" delay={0} />
        <StatCard icon={TrendingUp} label="Total Stock" value={`${(inv.totalStock || 0).toLocaleString()}`} sub="Units available" color="#60a5fa" delay={0.05} />
        <StatCard icon={IndianRupee} label="Today Revenue" value={fmt(sales.today?.revenue)} sub={`${sales.today?.count || 0} transactions`} color="#4ade80" delay={0.1} />
        <StatCard icon={BarChart3} label="Today Profit" value={fmt(sales.today?.profit)} sub="Net today" color="#a78bfa" delay={0.15} />
        <StatCard icon={IndianRupee} label="This Month" value={fmt(sales.month?.revenue)} sub={`${sales.month?.count || 0} sales`} color="#fb923c" delay={0.2} />
        <StatCard icon={TrendingUp} label="Month Profit" value={fmt(sales.month?.profit)} sub="Net this month" color="#34d399" delay={0.25} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={inv.lowStockItems || 0} sub="Items ≤ 5 units" color="#f87171" delay={0.3} />
        <StatCard icon={Package} label="Out of Stock" value={inv.outOfStock || 0} sub="Needs restocking" color="#f59e0b" delay={0.35} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* 7-Day Chart */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>7-Day Revenue</div>
              <div style={{ color: 'var(--color-ash)', fontSize: '0.8rem' }}>Last 7 days</div>
            </div>
            <div className="text-gold-gradient font-display" style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {fmt(data?.last7Days?.reduce((s, d) => s + d.revenue, 0))}
            </div>
          </div>
          <MiniChart data={data?.last7Days} />
        </motion.div>

        {/* Inventory Value */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 20 }}>Inventory Valuation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Cost Value', value: fmt(inv.inventoryValue), color: '#f87171' },
              { label: 'Retail Value', value: fmt(inv.inventoryRetailValue), color: '#4ade80' },
              { label: 'Potential Profit', value: fmt((inv.inventoryRetailValue || 0) - (inv.inventoryValue || 0)), color: '#C9A84C' },
              { label: 'Pending Dues', value: fmt(data?.pendingDues), color: '#fb923c' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-ash)' }}>{item.label}</span>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Category Breakdown */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 20 }}>Category Breakdown</div>
          {(data?.categoryBreakdown || []).map((cat, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-ash)' }}>{cat._id}</span>
                <span style={{ color: 'var(--color-dark)', fontWeight: 600 }}>{cat.count} SKUs · {cat.totalStock} units</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, var(--color-lime-dark), var(--color-lime))', width: `${(cat.count / Math.max(...(data?.categoryBreakdown || []).map(c => c.count), 1)) * 100}%` }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Top Products */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Top Selling Products</div>
          </div>
          {(data?.topProducts || []).length === 0 && <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem' }}>No sales yet.</p>}
          {(data?.topProducts || []).map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(101,163,13,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-lime-dark)' }}>{i + 1}</div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-dark)' }}>{p._id}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-lime-dark)' }}>{p.totalQty} units</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-ash)' }}>{fmt(p.totalRevenue)}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Link to="/admin/inventory/add" className="btn-primary" style={{ gap: 8 }}>
          <Package size={16} /> Add Product
        </Link>
        <Link to="/admin/sales/new" className="btn-outline" style={{ gap: 8 }}>
          <ShoppingCart size={16} /> Record Sale
        </Link>
        <Link to="/admin/inventory" className="btn-ghost" style={{ gap: 8 }}>
          View Inventory <ArrowRight size={14} />
        </Link>
      </motion.div>
    </div>
  );
}
