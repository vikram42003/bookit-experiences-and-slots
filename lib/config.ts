if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required to run the app");
}
// We do this so there's no weird api call failures due to that trailing slash
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
export const API_URL = rawApiUrl.endsWith("/") ? rawApiUrl.slice(0, -1) : rawApiUrl;
