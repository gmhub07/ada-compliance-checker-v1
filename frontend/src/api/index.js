const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function checkAccessibility(html) {
  const response = await fetch(`${API_BASE}/api/v1/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });

  if (!response.ok) {
    throw new Error('Failed to check accessibility');
  }
  return response.json();
}
