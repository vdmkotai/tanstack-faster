import { anonymousClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

// Auto-detect base URL: use current origin in browser, fallback to env var
const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : import.meta.env.VITE_SERVER_URL || 'http://localhost:8080';

export const authClient = createAuthClient({
  baseURL,
  plugins: [anonymousClient()],
});
