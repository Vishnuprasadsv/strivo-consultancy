// Set the base URL for the backend server
// It checks the environment variable VITE_API_BASE_URL (common in Vite projects)
// and falls back to localhost:5000 during local development.
export const SERVER_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
