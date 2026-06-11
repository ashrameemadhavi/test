import { useLocation, Link, Navigate } from 'react-router-dom';
import { formatCurrency, getComplexityClass } from '../utils/formatters';
import { generateQuotationPDF } from '../utils/pdfGenerator';

const ResultsPage = () => {
  const location = useLocation();
  const estimation = location.state?.estimation;
  const clientInfo = location.state?.clientInfo || { client_name: 'Client', email: '' };

  if (!estimation) {
    return <Navigate to="/estimate" replace />;
  }

  const stack = estimation.technology_stack || {};

  const handleDownloadPDF = () => {
    generateQuotationPDF(estimation, clientInfo);
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-success mb-2">Estimation Complete</span>
          <h1 className="fw-bold">Your Project Estimate</h1>
          <p className="text-muted">Review your cost breakdown, timeline, and recommended tech stack</p>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card card-custom p-4 text-center h-100">
              <small className="text-muted text-uppercase fw-semibold">Estimated Cost</small>
              <h2 className="fw-bold text-primary-custom my-2">
                {formatCurrency(estimation.total_cost)}
              </h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-custom p-4 text-center h-100">
              <small className="text-muted text-uppercase fw-semibold">Development Time</small>
              <h2 className="fw-bold my-2">{estimation.total_days} days</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-custom p-4 text-center h-100">
              <small className="text-muted text-uppercase fw-semibold">Complexity</small>
              <div className="my-2">
                <span className={`complexity-badge ${getComplexityClass(estimation.complexity)}`}>
                  {estimation.complexity}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card card-custom p-4 h-100">
              <h5 className="fw-semibold mb-3">Recommended Technology Stack</h5>
              <ul className="list-unstyled mb-0">
                {stack.frontend && (
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted">Frontend</span>
                    <strong>{stack.frontend}</strong>
                  </li>
                )}
                {stack.backend && (
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted">Backend</span>
                    <strong>{stack.backend}</strong>
                  </li>
                )}
                {stack.database && (
                  <li className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted">Database</span>
                    <strong>{stack.database}</strong>
                  </li>
                )}
                {stack.ai_service && (
                  <li className="d-flex justify-content-between py-2">
                    <span className="text-muted">AI Service</span>
                    <strong>{stack.ai_service}</strong>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card card-custom p-4 h-100">
              <h5 className="fw-semibold mb-3">Project Details</h5>
              <ul className="list-unstyled mb-0">
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Project Type</span>
                  <strong>{estimation.project_type?.name}</strong>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Features Selected</span>
                  <strong>{estimation.feature_count}</strong>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Complexity Score</span>
                  <strong>{estimation.complexity_score?.toFixed(1)}</strong>
                </li>
                {estimation.saved && (
                  <li className="d-flex justify-content-between py-2">
                    <span className="text-muted">Estimation ID</span>
                    <strong>#{estimation.estimation_id}</strong>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card card-custom p-4">
              <h5 className="fw-semibold mb-3">Cost Breakdown</h5>
              <div className="table-responsive">
                <table className="table table-custom table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-end">Cost</th>
                      <th className="text-end">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimation.cost_breakdown?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.item}</td>
                        <td className="text-end fw-semibold">{formatCurrency(item.cost)}</td>
                        <td className="text-end">{item.days}</td>
                      </tr>
                    ))}
                    <tr className="table-primary">
                      <td className="fw-bold">Total</td>
                      <td className="text-end fw-bold">{formatCurrency(estimation.total_cost)}</td>
                      <td className="text-end fw-bold">{estimation.total_days}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card card-custom p-4">
              <h5 className="fw-semibold mb-3">Timeline Breakdown</h5>
              <div className="table-responsive">
                <table className="table table-custom table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Phase</th>
                      <th className="text-end">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estimation.timeline_breakdown?.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="fw-semibold">{item.phase}</div>
                          {item.description && (
                            <small className="text-muted">{item.description}</small>
                          )}
                        </td>
                        <td className="text-end">{item.days}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center d-flex gap-3 justify-content-center flex-wrap">
          <button className="btn btn-primary btn-lg px-4" onClick={handleDownloadPDF}>
            Download PDF Quotation
          </button>
          <Link to="/estimate" className="btn btn-outline-primary btn-lg px-4">
            New Estimation
          </Link>
          <Link to="/" className="btn btn-outline-secondary btn-lg px-4">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
