/**
 * Central API configuration.
 *
 * VITE_API_BASE_URL is injected at build time by Vite:
 *   - Development  → .env.development  → http://localhost:8000
 *   - Production   → .env.production   → https://<deployed-backend>.vercel.app
 *
 * Every file that needs to call the backend should import API_BASE from here
 * instead of hardcoding "localhost:8000".
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default API_BASE;
