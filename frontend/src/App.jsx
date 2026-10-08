import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/public/Home';
import Materials from './pages/public/Materials';
import Projects from './pages/public/Projects';
import Contact from './pages/public/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import AddProduct from './pages/admin/AddProduct';
import ProductDetail from './pages/admin/ProductDetail';
import RecordSale from './pages/admin/RecordSale';
import SalesHistory from './pages/admin/SalesHistory';
import ManageProjects from './pages/admin/ManageProjects';
import ManageMaterials from './pages/admin/ManageMaterials';
import ManageDebts from './pages/admin/ManageDebts';
import AdminSetup from './pages/admin/AdminSetup';

// Layout
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#F5F5F0',
                border: '1px solid rgba(101,163,13,0.2)',
                borderRadius: '10px',
              },
              success: { iconTheme: { primary: '#C9A84C', secondary: '#1C1C2E' } },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Materials />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />

            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/add" element={<AddProduct />} />
              <Route path="inventory/:id" element={<ProductDetail />} />
              <Route path="sales/new" element={<RecordSale />} />
              <Route path="sales/history" element={<SalesHistory />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="materials" element={<ManageMaterials />} />
              <Route path="debts" element={<ManageDebts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
