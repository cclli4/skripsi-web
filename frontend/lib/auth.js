/** Decode JWT payload safely (base64url) and return object or null. */
export function parseJwt(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base.padEnd(base.length + ((4 - (base.length % 4)) % 4), "=");
  try {
    const payload = atob(padded);
    return JSON.parse(payload);
  } catch (e) {
    console.warn("Failed to parse JWT", e);
    return null;
  }
}
