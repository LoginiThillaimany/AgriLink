let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

function getBaseUrl() {
  // Prefer Expo public env, fallback to localhost
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  return envUrl || 'http://localhost:5000';
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${getBaseUrl()}${path}`;
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (authToken) {
    finalHeaders['Authorization'] = `Bearer ${authToken}`;
  }
  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    const message = (data && data.error) || res.statusText;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};


