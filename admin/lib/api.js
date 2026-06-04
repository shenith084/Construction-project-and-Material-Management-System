const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Generic fetch helper
async function apiFetch(path, options = {}) {
  // Get token from localStorage (client-side only)
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...authHeader, ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const authAPI = {
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),
  me: () => apiFetch('/api/auth/me'),
};

// Dashboard
export const dashboardAPI = {
  get: () => apiFetch('/api/dashboard'),
};

// Projects
export const projectsAPI = {
  getAll: (params = '') => apiFetch(`/api/projects${params}`),
  getOne: (id) => apiFetch(`/api/projects/${id}`),
  create: (body) => apiFetch('/api/projects', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/projects/${id}`, { method: 'DELETE' }),
};

// Materials
export const materialsAPI = {
  getAll: (params = '') => apiFetch(`/api/materials${params}`),
  getOne: (id) => apiFetch(`/api/materials/${id}`),
  create: (body) => apiFetch('/api/materials', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/materials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/materials/${id}`, { method: 'DELETE' }),
};

// Workers
export const workersAPI = {
  getAll: (params = '') => apiFetch(`/api/workers${params}`),
  getOne: (id) => apiFetch(`/api/workers/${id}`),
  create: (body) => apiFetch('/api/workers', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/workers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/workers/${id}`, { method: 'DELETE' }),
};

// Suppliers
export const suppliersAPI = {
  getAll: () => apiFetch('/api/suppliers'),
  getOne: (id) => apiFetch(`/api/suppliers/${id}`),
  create: (body) => apiFetch('/api/suppliers', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => apiFetch(`/api/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/suppliers/${id}`, { method: 'DELETE' }),
};

// Contacts
export const contactsAPI = {
  getAll: () => apiFetch('/api/contacts'),
  update: (id, body) => apiFetch(`/api/contacts/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/contacts/${id}`, { method: 'DELETE' }),
};

// Assignments
export const assignmentsAPI = {
  getAll: () => apiFetch('/api/assignments'),
  create: (body) => apiFetch('/api/assignments', { method: 'POST', body: JSON.stringify(body) }),
  delete: (id) => apiFetch(`/api/assignments/${id}`, { method: 'DELETE' }),
};
