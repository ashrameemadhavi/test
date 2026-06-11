-- Seed Data for Smart IT Project Cost Estimation System
-- Note: Admin user is created by backend/scripts/seed.js with bcrypt hash

-- Project Types
INSERT INTO project_types (name, base_cost, base_days, description) VALUES
('Website', 5000.00, 14, 'Static or dynamic marketing website'),
('Mobile Application', 15000.00, 45, 'Native or cross-platform mobile app'),
('Web Application', 12000.00, 35, 'Full-featured web application with backend'),
('E-Commerce Platform', 20000.00, 60, 'Online store with product catalog and checkout'),
('Custom Software', 25000.00, 75, 'Tailored software solution for specific business needs');

-- Features
INSERT INTO features (feature_name, cost, days, complexity_weight, description) VALUES
('Authentication', 2500.00, 7, 1.5, 'User login, registration, password reset'),
('Admin Panel', 3500.00, 10, 2.0, 'Administrative dashboard for content management'),
('Database Integration', 2000.00, 5, 1.5, 'MySQL/PostgreSQL database setup and ORM'),
('Payment Gateway', 4000.00, 12, 2.5, 'Stripe, PayPal, or Razorpay integration'),
('API Integration', 3000.00, 8, 2.0, 'Third-party API connections'),
('AI Features', 8000.00, 20, 3.5, 'Machine learning, NLP, or AI-powered features'),
('Real-Time Chat', 4500.00, 14, 2.5, 'WebSocket-based live messaging'),
('Analytics Dashboard', 3500.00, 10, 2.0, 'Charts, metrics, and reporting widgets'),
('Notification System', 2500.00, 7, 1.5, 'Email, SMS, and push notifications'),
('File Upload System', 2000.00, 5, 1.5, 'Cloud storage and file management'),
('Multi User Management', 3000.00, 8, 2.0, 'Roles, permissions, and user administration'),
('Reporting Module', 3500.00, 10, 2.0, 'Exportable reports and data visualization');

-- Technology Stacks per Project Type
INSERT INTO technology_stacks (project_type_id, frontend, backend, database_name, ai_service) VALUES
(1, 'HTML, CSS, JavaScript', NULL, NULL, NULL),
(2, 'React Native', 'Node.js', 'MySQL', NULL),
(3, 'React', 'Node.js', 'MySQL', NULL),
(4, 'React', 'Node.js', 'MySQL', NULL),
(5, 'React', 'Node.js', 'MySQL', NULL);

-- Stack feature rules (AI Features adds Python AI service)
INSERT INTO stack_feature_rules (feature_id, stack_key, stack_value)
SELECT id, 'ai_service', 'Python'
FROM features WHERE feature_name = 'AI Features';

-- Real-Time Chat may suggest WebSocket on backend
INSERT INTO stack_feature_rules (feature_id, stack_key, stack_value)
SELECT id, 'backend', 'Node.js + Socket.io'
FROM features WHERE feature_name = 'Real-Time Chat';
