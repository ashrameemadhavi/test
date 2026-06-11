import { useState, useEffect } from 'react';
import { estimationAPI, projectTypeAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate, getComplexityClass } from '../../utils/formatters';

const SavedEstimations = () => {
  const [estimations, setEstimations] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', project_type_id: '', complexity: '', page: 1 });
  const [selected, setSelected] = useState(null);

  const fetchEstimations = async () => {
    setLoading(true);
    try {
      const params = { page: filters.page, limit: 15 };
      if (filters.search) params.search = filters.search;
      if (filters.project_type_id) params.project_type_id = filters.project_type_id;
      if (filters.complexity) params.complexity = filters.complexity;

      const res = await estimationAPI.getAll(params);
      setEstimations(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    projectTypeAPI.getAll().then((res) => setProjectTypes(res.data.data));
  }, []);

  useEffect(() => {
    fetchEstimations();
  }, [filters.page, filters.project_type_id, filters.complexity]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchEstimations();
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Saved Estimations</h2>

      <div className="card card-custom p-3 mb-4">
        <form onSubmit={handleSearch} className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label small">Search</label>
            <input
              className="form-control"
              placeholder="Client name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small">Project Type</label>
            <select
              className="form-select"
              value={filters.project_type_id}
              onChange={(e) => setFilters({ ...filters, project_type_id: e.target.value, page: 1 })}
            >
              <option value="">All Types</option>
              {projectTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>{pt.name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label small">Complexity</label>
            <select
              className="form-select"
              value={filters.complexity}
              onChange={(e) => setFilters({ ...filters, complexity: e.target.value, page: 1 })}
            >
              <option value="">All</option>
              <option value="Simple">Simple</option>
              <option value="Medium">Medium</option>
              <option value="Complex">Complex</option>
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100">Search</button>
          </div>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="card card-custom">
            <div className="table-responsive">
              <table className="table table-custom table-hover mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Project Type</th>
                    <th>Cost</th>
                    <th>Days</th>
                    <th>Complexity</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {estimations.length === 0 ? (
                    <tr><td colSpan={8} className="text-center text-muted py-4">No estimations found</td></tr>
                  ) : (
                    estimations.map((est) => (
                      <tr key={est.id}>
                        <td>#{est.id}</td>
                        <td>
                          <div className="fw-semibold">{est.client_name}</div>
                          <small className="text-muted">{est.email}</small>
                        </td>
                        <td>{est.project_type_name}</td>
                        <td className="fw-semibold">{formatCurrency(est.total_cost)}</td>
                        <td>{est.total_days}</td>
                        <td>
                          <span className={`complexity-badge ${getComplexityClass(est.complexity)}`}>
                            {est.complexity}
                          </span>
                        </td>
                        <td><small>{formatDate(est.created_at)}</small></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(est)}>
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={filters.page <= 1}
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              >
                Previous
              </button>
              <span className="align-self-center small text-muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-outline-primary btn-sm"
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Estimation #{selected.id}</h5>
                <button className="btn-close" onClick={() => setSelected(null)} />
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <small className="text-muted">Client</small>
                    <p className="mb-0 fw-semibold">{selected.client_name}</p>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">Cost</small>
                    <p className="mb-0 fw-semibold text-primary-custom">{formatCurrency(selected.total_cost)}</p>
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">Timeline</small>
                    <p className="mb-0 fw-semibold">{selected.total_days} days</p>
                  </div>
                </div>
                <h6>Technology Stack</h6>
                <pre className="bg-light p-3 rounded small">
                  {JSON.stringify(selected.technology_stack, null, 2)}
                </pre>
                <h6>Cost Breakdown</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <tbody>
                      {selected.cost_breakdown?.map((item, i) => (
                        <tr key={i}>
                          <td>{item.item}</td>
                          <td className="text-end">{formatCurrency(item.cost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedEstimations;
