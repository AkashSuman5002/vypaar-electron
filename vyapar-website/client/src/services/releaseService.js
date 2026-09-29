import { apiFetch } from "./api";

const defaultOptions = {
  headers: {
    Accept: "application/json"
  }
};

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await apiFetch(url, {
      ...defaultOptions,
      ...options,
      signal: controller.signal,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getLatestRelease() {
  return fetchJson("/api/releases/latest");
}

export async function getAllReleases() {
  return fetchJson("/api/releases/all");
}

export async function getReleaseNotes(version) {
  const query = version ? `?version=${encodeURIComponent(version)}` : "";
  return fetchJson(`/api/releases/release-notes${query}`);
}

export async function getDownloadUrl() {
  return fetchJson("/api/releases/download-url");
}
