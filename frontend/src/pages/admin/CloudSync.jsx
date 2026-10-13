import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Cloud, RefreshCw, UploadCloud, DownloadCloud, CheckCircle2,
  AlertCircle, HardDrive, Wifi, Clock, Image as ImageIcon,
  Package, ShoppingCart, NotebookTabs, Layers, FolderKanban, ShieldCheck
} from 'lucide-react';

export default function CloudSync() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncType, setSyncType] = useState(null);
  const [syncResult, setSyncResult] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sync/status');
      setStatus(res.data);
    } catch {
      toast.error('Failed to load sync status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSync = async (endpoint, typeLabel) => {
    setSyncing(true);
    setSyncType(typeLabel);
    setSyncResult(null);

    const toastId = toast.loading(`Starting ${typeLabel}... Please keep internet connected.`);
    try {
      const res = await axios.post(`/api/sync/${endpoint}`);
      setSyncResult(res.data);
      toast.success(res.data.message || `${typeLabel} completed!`, { id: toastId });
      fetchStatus();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Sync failed. Please check your internet connection.';
      toast.error(errMsg, { id: toastId });
      setSyncResult({ error: errMsg, details: err.response?.data?.error });
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return 'Never synced yet';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <Helmet>
        <title>Cloud Sync Center | Bhakat Hardware Admin</title>
        <meta name="description" content="Synchronize shop sales, stock updates, and offline photos with MongoDB Atlas and Cloudinary." />
      </Helmet>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cloud size={28} style={{ color: 'var(--color-lime-dark)' }} />
            Cloud Sync Center
          </h1>
          <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', marginTop: 2 }}>
            Manage offline store data and push updates to MongoDB Atlas & Cloudinary.
          </p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading || syncing}
          className="btn-ghost"
          style={{ fontSize: '0.85rem', gap: 6, border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 16px' }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Status
        </button>
      </div>

      {/* Status Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {/* Local Engine Status */}
        <div className="glass-card" style={{ padding: 20, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase' }}>Database Mode</span>
            <HardDrive size={18} style={{ color: 'var(--color-lime-dark)' }} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Local PC (0ms)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>
            Shop counter & mobile zero-lag
          </div>
        </div>

        {/* Cloud Atlas Target */}
        <div className="glass-card" style={{ padding: 20, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase' }}>Cloud Target</span>
            <Wifi size={18} style={{ color: 'var(--color-lime-dark)' }} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark)' }}>
            MongoDB Atlas
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>
            Live for father & online visitors
          </div>
        </div>

        {/* Last Synced */}
        <div className="glass-card" style={{ padding: 20, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase' }}>Last Cloud Sync</span>
            <Clock size={18} style={{ color: 'var(--color-lime-dark)' }} />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark)' }}>
            {formatDate(status?.lastSyncedAt)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>
            {status?.lastAction ? `Last action: ${status.lastAction}` : 'Ready to sync'}
          </div>
        </div>

        {/* Pending Photos */}
        <div className="glass-card" style={{ padding: 20, borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase' }}>Offline Photos</span>
            <ImageIcon size={18} style={{ color: status?.pendingImages > 0 ? '#f59e0b' : 'var(--color-lime-dark)' }} />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-dark)' }}>
            {status?.pendingImages ?? 0} Pending
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)', marginTop: 4 }}>
            {status?.pendingImages > 0 ? 'Will upload to Cloudinary on push' : 'All photos synced to Cloudinary'}
          </div>
        </div>
      </div>

      {/* Main Action Banner */}
      <div
        className="glass-card"
        style={{
          padding: 28,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #ffffff, var(--color-surface))',
          border: '2px solid rgba(163, 230, 53, 0.4)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 540 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: 'var(--color-lime-light)', color: 'var(--color-dark)', fontSize: '0.75rem', fontWeight: 700, marginBottom: 8 }}>
              <ShieldCheck size={14} /> RECOMMENDED
            </div>
            <h2 className="font-display" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-dark)', marginBottom: 6 }}>
              Smart Two-Way Sync
            </h2>
            <p style={{ color: 'var(--color-ash)', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Pulls any new changes made by your father on the cloud first, uploads any offline product photos to Cloudinary, and pushes all your shop sales and stock updates to MongoDB Atlas.
            </p>
          </div>

          <button
            onClick={() => handleSync('two-way', 'Smart Two-Way Sync')}
            disabled={syncing}
            className="btn-primary"
            style={{
              padding: '16px 32px',
              fontSize: '1rem',
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--color-lime-dark), #4d7c0f)',
              color: 'var(--color-white)',
              gap: 10,
              boxShadow: '0 8px 24px rgba(101, 163, 13, 0.3)',
            }}
          >
            <RefreshCw size={20} className={syncing && syncType === 'Smart Two-Way Sync' ? 'animate-spin' : ''} />
            {syncing && syncType === 'Smart Two-Way Sync' ? 'Syncing with Cloud...' : 'Sync Everything Now'}
          </button>
        </div>
      </div>

      {/* Manual Push / Pull Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28 }}>
        {/* Push */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={22} style={{ color: '#166534' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark)' }}>Push to Cloud (Evening)</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>Local PC $\rightarrow$ MongoDB Atlas & Cloudinary</div>
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-ash)', marginBottom: 16 }}>
            Run this when closing the shop or on your home Wi-Fi. Uploads all day's sales, stock counts, and product photos so your father can view them online.
          </p>
          <button
            onClick={() => handleSync('push', 'Push to Cloud')}
            disabled={syncing}
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            <UploadCloud size={16} />
            {syncing && syncType === 'Push to Cloud' ? 'Pushing to Cloud...' : 'Push Local Data to Cloud'}
          </button>
        </div>

        {/* Pull */}
        <div className="glass-card" style={{ padding: 24, borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DownloadCloud size={22} style={{ color: '#1e40af' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-dark)' }}>Pull from Cloud (Morning)</h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-ash)' }}>MongoDB Atlas $\rightarrow$ Local PC</div>
            </div>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-ash)', marginBottom: 16 }}>
            Run this in the morning at home before heading to the shop. Downloads any new products, supplier items, or price changes added on the cloud.
          </p>
          <button
            onClick={() => handleSync('pull', 'Pull from Cloud')}
            disabled={syncing}
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            <DownloadCloud size={16} />
            {syncing && syncType === 'Pull from Cloud' ? 'Pulling from Cloud...' : 'Pull Cloud Data to Local'}
          </button>
        </div>
      </div>

      {/* Sync Result Details */}
      <AnimatePresence>
        {syncResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card"
            style={{
              padding: 24,
              borderRadius: 14,
              marginBottom: 24,
              borderLeft: syncResult.error ? '5px solid #ef4444' : '5px solid #22c55e',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              {syncResult.error ? (
                <AlertCircle size={22} style={{ color: '#ef4444' }} />
              ) : (
                <CheckCircle2 size={22} style={{ color: '#22c55e' }} />
              )}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', margin: 0 }}>
                {syncResult.error ? 'Sync Encountered an Issue' : 'Sync Completed Successfully!'}
              </h4>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-dark-muted)', marginBottom: 12 }}>
              {syncResult.message || syncResult.error}
            </p>

            {syncResult.uploadedImages !== undefined && (
              <div style={{ fontSize: '0.825rem', color: 'var(--color-ash)', marginBottom: 4 }}>
                • <strong>{syncResult.uploadedImages}</strong> offline photo{syncResult.uploadedImages === 1 ? '' : 's'} uploaded to Cloudinary.
              </div>
            )}

            {syncResult.pushResults && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 10 }}>
                {Object.entries(syncResult.pushResults).map(([col, data]) => (
                  <span key={col} className="badge badge-gray" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    {col}: {data.total} records synced
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local Store Snapshot */}
      <div className="glass-card" style={{ padding: 24, borderRadius: 14 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: 14 }}>
          Current Local Store Inventory & Records
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 4 }}>
              <Package size={14} /> Products
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)' }}>{status?.counts?.products ?? 0}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 4 }}>
              <ShoppingCart size={14} /> Sales Made
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)' }}>{status?.counts?.sales ?? 0}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 4 }}>
              <NotebookTabs size={14} /> Customer Ledger
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)' }}>{status?.counts?.debts ?? 0}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 4 }}>
              <Layers size={14} /> Materials (Web)
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)' }}>{status?.counts?.materials ?? 0}</div>
          </div>
          <div style={{ padding: '12px 16px', background: 'var(--color-surface)', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--color-ash)', marginBottom: 4 }}>
              <FolderKanban size={14} /> Projects
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-dark)' }}>{status?.counts?.projects ?? 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
