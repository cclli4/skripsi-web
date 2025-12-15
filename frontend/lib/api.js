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
  return handleJson(res, "GET /history");
}

export async function clearHistory() {
  const headers = { "Content-Type": "application/json" };
  const authToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  const res = await fetch(`${API_BASE}/history`, { method: "DELETE", headers });
  return handleJson(res, "DELETE /history");
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

export async function fetchAdminOverview(token) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : "");
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}/admin/overview`, { method: "GET", headers });
  return handleJson(res, "GET /admin/overview");
}

export async function fetchExpertCases(token) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : "");
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}/expert/cases`, { method: "GET", headers });
  return handleJson(res, "GET /expert/cases");
}

export async function fetchExpertDiagnosis(token) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") : "");
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}/expert/diagnosis`, { method: "GET", headers });
  return handleJson(res, "GET /expert/diagnosis");
}

export async function uploadExpertCasesCsv(file) {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
  if (!token) throw new Error("Token tidak ada");
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/expert/cases/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return handleJson(res, "POST /expert/cases/upload");
}
