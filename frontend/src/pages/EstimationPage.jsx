import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectTypeAPI, featureAPI, estimationAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const EstimationPage = () => {
  const navigate = useNavigate();
  const [projectTypes, setProjectTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  const [projectTypeId, setProjectTypeId] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [saveEstimation, setSaveEstimation] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ptRes, fRes] = await Promise.all([
          projectTypeAPI.getAll(),
          featureAPI.getAll(),
        ]);
        setProjectTypes(ptRes.data.data);
        setFeatures(fRes.data.data);
      } catch {
        setError('Failed to load data. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFeature = (featureId) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleCalculate = async () => {
    if (!projectTypeId) {
      setError('Please select a project type.');
      return;
    }
    if (saveEstimation && (!clientName.trim() || !email.trim())) {
      setError('Please provide your name and email to save the estimation.');
      return;
    }

    setError('');
    setCalculating(true);

    try {
      const response = await estimationAPI.calculate({
        project_type_id: parseInt(projectTypeId, 10),
        feature_ids: selectedFeatures,
        client_name: clientName.trim() || undefined,
        email: email.trim() || undefined,
        save: saveEstimation,
      });

      navigate('/results', {
        state: {
          estimation: response.data.data,
          clientInfo: { client_name: clientName, email },
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to calculate estimation.');
    } finally {
      setCalculating(false);
    }
  };

  const selectedProjectType = projectTypes.find((pt) => pt.id === parseInt(projectTypeId, 10));

  if (loading) return <LoadingSpinner message="Loading project options..." />;

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Project Estimation</h1>
          <p className="text-muted">Configure your project requirements to get an accurate estimate</p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card card-custom p-4 mb-4">
              <h5 className="fw-semibold mb-3">1. Select Project Type</h5>
              <select
                className="form-select form-select-lg"
                value={projectTypeId}
                onChange={(e) => setProjectTypeId(e.target.value)}
              >
                <option value="">Choose project type...</option>
                {projectTypes.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name} — Base: {formatCurrency(pt.base_cost)} / {pt.base_days} days
                  </option>
                ))}
              </select>
              {selectedProjectType?.description && (
                <p className="text-muted small mt-2 mb-0">{selectedProjectType.description}</p>
              )}
            </div>

            <div className="card card-custom p-4 mb-4">
              <h5 className="fw-semibold mb-3">2. Select Features</h5>
              <div className="row g-3">
                {features.map((feature) => (
                  <div key={feature.id} className="col-md-6">
                    <div
                      className={`card feature-card p-3 h-100 ${selectedFeatures.includes(feature.id) ? 'selected' : ''}`}
                      onClick={() => toggleFeature(feature.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && toggleFeature(feature.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-semibold mb-1">{feature.feature_name}</h6>
                          <p className="text-muted small mb-2">{feature.description}</p>
                          <div className="small">
                            <span className="text-primary-custom fw-semibold">
                              {formatCurrency(feature.cost)}
                            </span>
                            <span className="text-muted"> · {feature.days} days</span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="form-check-input mt-1"
                          checked={selectedFeatures.includes(feature.id)}
                          onChange={() => toggleFeature(feature.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-custom p-4">
              <h5 className="fw-semibold mb-3">3. Your Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="saveEst"
                      checked={saveEstimation}
                      onChange={(e) => setSaveEstimation(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="saveEst">
                      Save this estimation for future reference
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card card-custom p-4 sticky-top" style={{ top: 90 }}>
              <h5 className="fw-semibold mb-3">Summary</h5>
              <div className="mb-3">
                <small className="text-muted">Project Type</small>
                <p className="mb-0 fw-semibold">
                  {selectedProjectType?.name || 'Not selected'}
                </p>
              </div>
              <div className="mb-3">
                <small className="text-muted">Features Selected</small>
                <p className="mb-0 fw-semibold">{selectedFeatures.length}</p>
              </div>
              {selectedProjectType && (
                <div className="mb-3 p-3 rounded" style={{ background: 'var(--background)' }}>
                  <small className="text-muted">Base Cost</small>
                  <p className="mb-0 fw-bold text-primary-custom">
                    {formatCurrency(selectedProjectType.base_cost)}
                  </p>
                </div>
              )}
              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handleCalculate}
                disabled={calculating || !projectTypeId}
              >
                {calculating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Calculating...
                  </>
                ) : (
                  'Calculate Estimate'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimationPage;
