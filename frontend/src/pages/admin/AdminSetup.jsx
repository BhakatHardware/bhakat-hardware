import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';

export default function AdminSetup() {
  const [form, setForm] = useState({ username: '', password: '', name: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await axios.post('/api/auth/setup', { username: form.username, password: form.password, name: form.name });
      toast.success('Admin account created! Please login.');
      navigate('/admin/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Setup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)', padding: 24 }}>
      <motion.div className="glass-card" style={{ width: '100%', maxWidth: 440, padding: 48 }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #4ade80, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Shield size={24} color="white" />
          </div>
          <h1 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>First-Time Setup</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-ash)' }}>Create your admin account to get started.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Susmit Bhakat', type: 'text' },
            { key: 'username', label: 'Username', placeholder: 'admin', type: 'text' },
            { key: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
            { key: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', type: 'password' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom: 16 }}>
              <label className="input-label">{field.label}</label>
              <input className="input-field" type={field.type} placeholder={field.placeholder}
                value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} required />
            </div>
          ))}
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
