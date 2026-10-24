const defaultBaseUrl = 'http://localhost:8080/api/v1';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
}
