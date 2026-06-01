const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

async function apiFetch(path) {
  const res = await fetch(`${API_URL}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export const projectsAPI = {
  getAll: (params = '') => apiFetch(`/api/projects${params}`),
  getOne: (id) => apiFetch(`/api/projects/${id}`),
};
export const materialsAPI = {
  getAll: (params = '') => apiFetch(`/api/materials${params}`),
};
export const workersAPI = {
  getAll: () => apiFetch('/api/workers'),
};
export const contactsAPI = {
  submit: (body) => fetch(`${API_URL}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
};
