import { Link } from 'react-router-dom';

const features = [
  { icon: '💡', title: 'Smart Estimation', desc: 'AI-powered cost calculation based on your project requirements' },
  { icon: '⏱️', title: 'Timeline Planning', desc: 'Accurate development time estimates with phase breakdown' },
  { icon: '🛠️', title: 'Tech Stack Advice', desc: 'Recommended technology stack for your project type' },
  { icon: '📄', title: 'PDF Quotation', desc: 'Download professional quotation documents instantly' },
];

const HomePage = () => (
  <>
    <section className="hero-gradient text-white py-5">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-accent text-dark mb-3 px-3 py-2" style={{ background: 'var(--accent)' }}>
              Smart IT Estimation System
            </span>
            <h1 className="display-4 fw-bold mb-4">
              Estimate Your Software Project Cost in Minutes
            </h1>
            <p className="lead text-white-50 mb-4">
              Get accurate cost estimates, development timelines, complexity analysis,
              and technology recommendations for your next software project.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/estimate" className="btn btn-light btn-lg px-4 fw-semibold">
                Start Estimation
              </Link>
              <a href="#features" className="btn btn-outline-light btn-lg px-4">
                Learn More
              </a>
            </div>
          </div>
          <div className="col-lg-5 d-none d-lg-block text-center">
            <div className="card card-custom p-4 text-dark">
              <h5 className="text-primary-custom fw-bold mb-3">Quick Preview</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Estimated Cost</span>
                <strong>$45,000</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Timeline</span>
                <strong>90 days</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Complexity</span>
                <span className="complexity-badge complexity-medium">Medium</span>
              </div>
              <div className="text-start small text-muted">
                <div>Frontend: React</div>
                <div>Backend: Node.js</div>
                <div>Database: MySQL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" className="py-5">
      <div className="container py-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose Smart IT?</h2>
          <p className="text-muted">Everything you need to plan your software project budget</p>
        </div>
        <div className="row g-4">
          {features.map((f) => (
            <div key={f.title} className="col-md-6 col-lg-3">
              <div className="card card-custom h-100 p-4 text-center">
                <div className="fs-1 mb-3">{f.icon}</div>
                <h5 className="fw-semibold">{f.title}</h5>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-5 bg-white">
      <div className="container text-center py-4">
        <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
        <p className="text-muted mb-4">
          Select your project type, choose features, and get an instant estimate.
        </p>
        <Link to="/estimate" className="btn btn-primary btn-lg px-5">
          Start Estimation Now
        </Link>
      </div>
    </section>
  </>
);

export default HomePage;
