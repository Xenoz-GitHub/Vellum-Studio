let inMemoryToken: string | null = null;
let demoModeActive = false;

export function setApiAuthToken(token: string | null) {
  inMemoryToken = token;
}

export function setDemoWorkspaceActive(active: boolean) {
  demoModeActive = active;
  try {
    if (active) {
      sessionStorage.setItem('vellum_demo_mode', '1');
    } else {
      sessionStorage.removeItem('vellum_demo_mode');
    }
  } catch {
    // ignore storage restriction
  }
}

export function isDemoWorkspaceActive(): boolean {
  if (demoModeActive) return true;
  try {
    return sessionStorage.getItem('vellum_demo_mode') === '1';
  } catch {
    return false;
  }
}

function getLocalDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('x-client-date', getLocalDateString());

  if (inMemoryToken) {
    headers.set('Authorization', `Bearer ${inMemoryToken}`);
  } else if (isDemoWorkspaceActive()) {
    headers.set('x-demo-workspace', '1');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (contentType.includes('application/json')) {
      const errJson = await res.json().catch(() => null);
      if (errJson?.error) message = errJson.error;
    }
    throw new Error(message);
  }

  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res as unknown as T;
}

export async function apiDownloadBlob(url: string, options: RequestInit = {}): Promise<Blob> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('x-client-date', getLocalDateString());
  if (inMemoryToken) {
    headers.set('Authorization', `Bearer ${inMemoryToken}`);
  } else if (isDemoWorkspaceActive()) {
    headers.set('x-demo-workspace', '1');
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.error || `Export failed (${res.status})`);
  }
  return res.blob();
}
