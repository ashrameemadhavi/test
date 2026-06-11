import { useState, useEffect } from 'react';
import { featureAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

const emptyForm = { feature_name: '', cost: '', days: '', complexity_weight: '1.0', description: '' };

const ManageFeatures = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchFeatures = async () => {
    try {
      const res = await featureAPI.getAll(true);
      setFeatures(res.data.data);
    } catch {
      setError('Failed to load features');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeatures(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (feature) => {
    setForm({
      feature_name: feature.feature_name,
      cost: feature.cost,
      days: feature.days,
      complexity_weight: feature.complexity_weight,
      description: feature.description || '',
    });
    setEditingId(feature.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      cost: parseFloat(form.cost),
      days: parseInt(form.days, 10),
      complexity_weight: parseFloat(form.complexity_weight),
    };

    try {
      if (editingId) {
        await featureAPI.update(editingId, payload);
      } else {
        await featureAPI.create(payload);
      }
      setShowModal(false);
      fetchFeatures();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save feature');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feature?')) return;
    try {
      await featureAPI.delete(id);
      fetchFeatures();
    } catch {
      setError('Failed to delete feature');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Features</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Feature</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card card-custom">
        <div className="table-responsive">
          <table className="table table-custom table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost</th>
                <th>Days</th>
                <th>Weight</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => (
                <tr key={f.id}>
                  <td className="fw-semibold">{f.feature_name}</td>
                  <td>{formatCurrency(f.cost)}</td>
                  <td>{f.days}</td>
                  <td>{f.complexity_weight}</td>
                  <td>
                    <span className={`badge ${f.is_active ? 'bg-success' : 'bg-secondary'}`}>
                      {f.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(f)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? 'Edit Feature' : 'Create Feature'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Feature Name</label>
                  <input className="form-control" value={form.feature_name} onChange={(e) => setForm({ ...form, feature_name: e.target.value })} />
                </div>
                <div className="row g-3">
                  <div className="col-4">
                    <label className="form-label">Cost ($)</label>
                    <input type="number" className="form-control" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Days</label>
                    <input type="number" className="form-control" value={form.days} onChange={(e) => setForm({ ...form, days: e.target.value })} />
                  </div>
                  <div className="col-4">
                    <label className="form-label">Weight</label>
                    <input type="number" step="0.1" className="form-control" value={form.complexity_weight} onChange={(e) => setForm({ ...form, complexity_weight: e.target.value })} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFeatures;
