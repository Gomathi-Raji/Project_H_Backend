const API_BASE = import.meta.env.VITE_API_BASE || "/api";

let token = null;
export function setToken(t) {
  token = t;
  try {
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
  } catch (e) {
    // ignore
  }
}

export function loadToken() {
  if (!token) {
    try {
      token = localStorage.getItem("token");
    } catch (e) {
      token = null;
    }
  }
  return token;
}

export async function apiFetch(path, options = {}) {
  const t = loadToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    credentials: options.credentials || "include",
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { message: res.statusText };
    return data;
  } catch (err) {
    throw err;
  }
}

export default apiFetch;
