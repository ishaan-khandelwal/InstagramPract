const DEFAULT_LOCAL_API_BASE_URL = "http://localhost:65535";
const DEFAULT_PRODUCTION_API_BASE_URL = "https://instagrampract.onrender.com";
const defaultApiBaseUrl = import.meta.env.DEV
    ? DEFAULT_LOCAL_API_BASE_URL
    : DEFAULT_PRODUCTION_API_BASE_URL;
const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl).trim();
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
