// Environment based configuration
export const base_url = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? "http://localhost:5002"
    : "https://api.piedocx.in";
export const UI_URL = import.meta.env.VITE_UI_BASE_URL || "https://piedocx.in"
export const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin-portal"

export const getSocketUrl = () => {
    try {
        const url = new URL(base_url);
        return url.origin;
    } catch (e) {
        console.warn("Invalid base_url, falling back to current origin for socket", e);
        return window.location.origin;
    }
};
