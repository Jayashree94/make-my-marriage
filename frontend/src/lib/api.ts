const defaultBaseUrl = 'http://localhost:8081/api/v1';

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
    const raw = await response.text();
    let message = 'Request failed';

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { message?: string; error?: string };
        message = parsed.message ?? parsed.error ?? raw;
      } catch {
        message = raw;
      }
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
