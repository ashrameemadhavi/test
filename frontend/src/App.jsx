import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import HomePage from './pages/HomePage';
import EstimationPage from './pages/EstimationPage';
import ResultsPage from './pages/ResultsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageFeatures from './pages/admin/ManageFeatures';
import ManageProjectTypes from './pages/admin/ManageProjectTypes';
import PricingRules from './pages/admin/PricingRules';
import SavedEstimations from './pages/admin/SavedEstimations';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/estimate" element={<EstimationPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="features" element={<ManageFeatures />} />
            <Route path="project-types" element={<ManageProjectTypes />} />
            <Route path="pricing" element={<PricingRules />} />
            <Route path="estimations" element={<SavedEstimations />} />
          </Route>
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
