import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ImageModalProvider } from './context/ImageModalContext';

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
import PriceCheck from './pages/admin/PriceCheck';
import CloudSync from './pages/admin/CloudSync';


// Layout
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ImageModalProvider>
          <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.875rem',
                fontWeight: 600,
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
              },
              success: {
                iconTheme: {
                  primary: '#16a34a',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                },
              },
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


            {/* Admin Protected Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="sync" element={<CloudSync />} />
              <Route path="price-check" element={<PriceCheck />} />
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
        </ImageModalProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
