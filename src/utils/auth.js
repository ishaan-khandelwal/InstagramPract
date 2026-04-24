const AUTH_TOKEN_KEY = "instagram_auth_token";

function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
}

function saveAuthToken(token) {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
}

function clearAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
}

function isAuthenticated() {
    return Boolean(getAuthToken());
}

export { clearAuthToken, getAuthToken, isAuthenticated, saveAuthToken };
