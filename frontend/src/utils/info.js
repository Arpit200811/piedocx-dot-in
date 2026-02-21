// Environment based configuration
// export const base_url = "http://localhost:5002"; // Force local for dev
export const base_url = import.meta.env.VITE_API_BASE_URL || "https://api.piedocx.in"
export const UI_URL = import.meta.env.VITE_UI_BASE_URL || "https://piedocx.in"
export const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/admin-portal"
