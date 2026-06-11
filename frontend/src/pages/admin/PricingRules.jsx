import { useState, useEffect } from 'react';
import { adminAPI, projectTypeAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PricingRules = () => {
  const [stacks, setStacks] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStack, setEditingStack] = useState(null);

  const fetchData = async () => {
    try {
      const [stackRes, ptRes, rulesRes] = await Promise.all([
        adminAPI.getTechnologyStacks(),
        projectTypeAPI.getAll(true),
        adminAPI.getStackFeatureRules(),
      ]);
      setStacks(stackRes.data.data);
      setProjectTypes(ptRes.data.data);
      setRules(rulesRes.data.data);
    } catch {
      setError('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStackSave = async () => {
    try {
      await adminAPI.updateTechnologyStack(editingStack);
      setEditingStack(null);
      fetchData();
    } catch {
      setError('Failed to update technology stack');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="fw-bold mb-4">Pricing Rules & Technology Stacks</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card card-custom p-4 mb-4">
        <h5 className="fw-semibold mb-3">Base Pricing (Project Types)</h5>
        <p className="text-muted small">
          Base costs and days are managed in Project Types. Changes apply immediately to new estimations.
        </p>
        <div className="table-responsive">
          <table className="table table-custom table-sm mb-0">
            <thead>
              <tr>
                <th>Project Type</th>
                <th>Base Cost</th>
                <th>Base Days</th>
              </tr>
            </thead>
            <tbody>
              {projectTypes.map((pt) => (
                <tr key={pt.id}>
                  <td>{pt.name}</td>
                  <td>${parseFloat(pt.base_cost).toLocaleString()}</td>
                  <td>{pt.base_days} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <a href="/admin/project-types" className="btn btn-sm btn-outline-primary mt-3">
          Edit Base Pricing
        </a>
      </div>

      <div className="card card-custom p-4 mb-4">
        <h5 className="fw-semibold mb-3">Technology Stack Rules</h5>
        <div className="table-responsive">
          <table className="table table-custom table-hover mb-0">
            <thead>
              <tr>
                <th>Project Type</th>
                <th>Frontend</th>
                <th>Backend</th>
                <th>Database</th>
                <th>AI Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stacks.map((stack) => (
                <tr key={stack.id}>
                  <td className="fw-semibold">{stack.project_type_name}</td>
                  <td>{stack.frontend || '—'}</td>
                  <td>{stack.backend || '—'}</td>
                  <td>{stack.database_name || '—'}</td>
                  <td>{stack.ai_service || '—'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setEditingStack({ ...stack })}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card card-custom p-4">
        <h5 className="fw-semibold mb-3">Feature-Based Stack Overrides</h5>
        <div className="table-responsive">
          <table className="table table-custom table-sm mb-0">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Stack Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td>{rule.feature_name}</td>
                  <td><code>{rule.stack_key}</code></td>
                  <td>{rule.stack_value}</td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr><td colSpan={3} className="text-muted text-center">No feature rules configured</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingStack && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Stack — {editingStack.project_type_name}</h5>
                <button className="btn-close" onClick={() => setEditingStack(null)} />
              </div>
              <div className="modal-body">
                {['frontend', 'backend', 'database_name', 'ai_service'].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label text-capitalize">{field.replace('_', ' ')}</label>
                    <input
                      className="form-control"
                      value={editingStack[field] || ''}
                      onChange={(e) => setEditingStack({ ...editingStack, [field]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingStack(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleStackSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingRules;
