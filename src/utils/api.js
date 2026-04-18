const DEFAULT_API_BASE_URL = "https://instagrampract.onrender.com";
const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).trim();
const normalizedApiBaseUrl = rawApiBaseUrl
    ? rawApiBaseUrl.startsWith("http")
        ? rawApiBaseUrl
        : `https://${rawApiBaseUrl}`
    : "";
const API_BASE_URL = normalizedApiBaseUrl.replace(/\/$/, "");

function getApiUrl(path) {
    if (!API_BASE_URL) {
        return path;
    }

    return `${API_BASE_URL}${path}`;
}

export { API_BASE_URL, getApiUrl };
