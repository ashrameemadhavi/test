import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
};

export const projectTypeAPI = {
  getAll: (all = false) => api.get(`/project-types${all ? '?all=true' : ''}`),
  getById: (id) => api.get(`/project-types/${id}`),
  create: (data) => api.post('/admin/project-type', data),
  update: (id, data) => api.put(`/admin/project-type/${id}`, data),
  delete: (id) => api.delete(`/admin/project-type/${id}`),
};

export const featureAPI = {
  getAll: (all = false) => api.get(`/features${all ? '?all=true' : ''}`),
  getById: (id) => api.get(`/features/${id}`),
  create: (data) => api.post('/admin/feature', data),
  update: (id, data) => api.put(`/admin/feature/${id}`, data),
  delete: (id) => api.delete(`/admin/feature/${id}`),
};

export const estimationAPI = {
  calculate: (data) => api.post('/estimate', data),
  getAll: (params) => api.get('/estimations', { params }),
  getById: (id) => api.get(`/estimations/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getTechnologyStacks: () => api.get('/admin/technology-stacks'),
  updateTechnologyStack: (data) => api.put('/admin/technology-stack', data),
  getStackFeatureRules: () => api.get('/admin/stack-feature-rules'),
  upsertStackFeatureRule: (data) => api.post('/admin/stack-feature-rule', data),
  deleteStackFeatureRule: (id) => api.delete(`/admin/stack-feature-rule/${id}`),
};

export default api;
