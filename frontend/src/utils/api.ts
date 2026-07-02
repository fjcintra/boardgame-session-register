const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export interface ApiError {
  status: number;
  message: string;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers = new Headers(options.headers || {});

  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // If the body is not FormData or URLSearchParams, set Content-Type to application/json
  if (options.body && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired or unauthorized
    removeToken();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    // Force redirect or refresh to trigger logout flow in App.tsx
    window.location.reload();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let errorDetail = 'Ocorreu um erro na requisição.';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // JSON parsing failed, use status text
      errorDetail = response.statusText || errorDetail;
    }
    const apiErr: ApiError = { status: response.status, message: errorDetail };
    throw apiErr;
  }

  // Handle empty or 204 responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  // For delete requests returning success structure
  const text = await response.text();
  if (!text) return {} as T;
  
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}
