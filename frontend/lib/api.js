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

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`, { method: "GET" });
  if (!res.ok) {
    throw new Error(`GET /history failed: ${res.status}`);
  }
  return res.json();
}