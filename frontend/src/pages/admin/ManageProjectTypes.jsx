import { useState, useEffect } from 'react';
import { projectTypeAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';

const emptyForm = { name: '', base_cost: '', base_days: '', description: '' };

const ManageProjectTypes = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await projectTypeAPI.getAll(true);
      setProjectTypes(res.data.data);
    } catch {
      setError('Failed to load project types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (pt) => {
    setForm({
      name: pt.name,
      base_cost: pt.base_cost,
      base_days: pt.base_days,
      description: pt.description || '',
    });
    setEditingId(pt.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      base_cost: parseFloat(form.base_cost),
      base_days: parseInt(form.base_days, 10),
    };

    try {
      if (editingId) {
        await projectTypeAPI.update(editingId, payload);
      } else {
        await projectTypeAPI.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project type?')) return;
    try {
      await projectTypeAPI.delete(id);
      fetchData();
    } catch {
      setError('Failed to delete. It may have associated estimations.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Manage Project Types</h2>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Project Type</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card card-custom">
        <div className="table-responsive">
          <table className="table table-custom table-hover mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Base Cost</th>
                <th>Base Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectTypes.map((pt) => (
                <tr key={pt.id}>
                  <td>
                    <div className="fw-semibold">{pt.name}</div>
                    {pt.description && <small className="text-muted">{pt.description}</small>}
                  </td>
                  <td>{formatCurrency(pt.base_cost)}</td>
                  <td>{pt.base_days}</td>
                  <td>
                    <span className={`badge ${pt.is_active ? 'bg-success' : 'bg-secondary'}`}>
                      {pt.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(pt)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(pt.id)}>Delete</button>
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
                <h5 className="modal-title">{editingId ? 'Edit Project Type' : 'Create Project Type'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Base Cost ($)</label>
                    <input type="number" className="form-control" value={form.base_cost} onChange={(e) => setForm({ ...form, base_cost: e.target.value })} />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Base Days</label>
                    <input type="number" className="form-control" value={form.base_days} onChange={(e) => setForm({ ...form, base_days: e.target.value })} />
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

export default ManageProjectTypes;
