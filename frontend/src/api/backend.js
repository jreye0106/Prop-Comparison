const API_BASE = "http://localhost:4000";

export async function searchPlayer(query) {
  const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}
