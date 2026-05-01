const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getAdminToken() {
  return localStorage.getItem("admin_token");
}

export async function adminFetch(path, options = {}) {
  const token = getAdminToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    return;
  }

  return res;
}