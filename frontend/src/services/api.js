// API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const getHeaders = () => {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    // Tenter de lire l'erreur JSON si elle existe
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error ${res.status}`);
  }
  // Pour les requêtes DELETE ou NO CONTENT
  if (res.status === 204) return true;
  return res.json();
};

export const api = {
  get: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getHeaders()
  }).then(handleResponse),

  post: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),

  put: (endpoint, data) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(handleResponse),

  delete: (endpoint) => fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.ok),
};