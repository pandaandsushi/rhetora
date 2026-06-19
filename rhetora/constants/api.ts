export const BACKEND_URL = "https://brainier-mi-nonexhaustible.ngrok-free.dev";

/**
 * Headers required for all requests going through ngrok tunnel.
 * Without `ngrok-skip-browser-warning`, ngrok intercepts the request
 * and returns an HTML warning page instead of forwarding to the backend.
 */
export const NGROK_HEADERS: Record<string, string> = {
  "ngrok-skip-browser-warning": "true",
};
