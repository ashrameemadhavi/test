import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then((res) => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="fw-bold mb-4">Dashboard</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <StatCard
            title="Total Estimations"
            value={stats?.total_estimations || 0}
            icon="📋"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            title="Total Features"
            value={stats?.total_features || 0}
            icon="⚙️"
            color="accent"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            title="Project Types"
            value={stats?.total_project_types || 0}
            icon="📁"
          />
        </div>
      </div>

      <div className="card card-custom p-4 mt-4">
        <h5 className="fw-semibold mb-3">Quick Actions</h5>
        <div className="d-flex gap-2 flex-wrap">
          <a href="/admin/features" className="btn btn-outline-primary">Manage Features</a>
          <a href="/admin/project-types" className="btn btn-outline-primary">Manage Project Types</a>
          <a href="/admin/pricing" className="btn btn-outline-primary">Update Pricing</a>
          <a href="/admin/estimations" className="btn btn-outline-primary">View Estimations</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
