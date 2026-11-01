const defaultBaseUrl =
  typeof window === 'undefined'
    ? 'http://localhost:8081/api/v1'
    : `${window.location.protocol}//${window.location.hostname}:8081/api/v1`;

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Unable to reach the backend server at ${apiBaseUrl}. Start the backend on port 8081 and check the browser network connection.`,
      );
    }
    throw error;
  }

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
