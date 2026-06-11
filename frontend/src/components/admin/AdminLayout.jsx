import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/features', label: 'Features', icon: '⚙️' },
    { to: '/admin/project-types', label: 'Project Types', icon: '📁' },
    { to: '/admin/pricing', label: 'Pricing & Stacks', icon: '💰' },
    { to: '/admin/estimations', label: 'Estimations', icon: '📋' },
  ];

  return (
    <div className="d-flex">
      <aside className="admin-sidebar p-3" style={{ width: 260, flexShrink: 0 }}>
        <div className="mb-4 px-2">
          <h5 className="fw-bold mb-0">
            <span className="text-accent">Smart</span> IT Admin
          </h5>
          <small className="text-white-50">{user.name}</small>
        </div>
        <nav className="nav flex-column">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <button className="btn btn-outline-light btn-sm w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-grow-1 p-4" style={{ background: 'var(--background)', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
