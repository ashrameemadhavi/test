const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <div className="card card-custom stat-card h-100">
    <div className="card-body d-flex align-items-center">
      <div className="flex-grow-1">
        <p className="text-muted small mb-1 text-uppercase fw-semibold">{title}</p>
        <h3 className="mb-0 fw-bold">{value}</h3>
      </div>
      <div
        className={`rounded-circle d-flex align-items-center justify-content-center`}
        style={{
          width: 48,
          height: 48,
          background: color === 'primary' ? 'rgba(37,99,235,0.1)' : 'rgba(6,182,212,0.1)',
          fontSize: '1.5rem',
        }}
      >
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;
