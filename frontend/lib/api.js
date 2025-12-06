export const API_BASE = "http://localhost:8000";

export async function postDiagnosis(features) {
  const res = await fetch(`${API_BASE}/diagnosis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ features }),
  });
  if (!res.ok) {
    throw new Error(`POST /diagnosis failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchHistory(token) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : "");
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_BASE}/history`, { method: "GET", headers });
  if (!res.ok) {
    throw new Error(`GET /history failed: ${res.status}`);
  }
  return res.json();
}

export async function clearHistory() {
  const headers = { "Content-Type": "application/json" };
  const authToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_BASE}/history`, { method: "DELETE", headers });
  if (!res.ok) {
    throw new Error(`DELETE /history failed: ${res.status}`);
  }
  return res.json();
}

async function handleJson(res, context) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.detail || `${context} failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function registerUser(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res, "POST /auth/register");
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson(res, "POST /auth/login");
}
