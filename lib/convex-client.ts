import { ConvexAdapter } from "./convex-adapter";
import { ConvexHttpClient } from "convex/browser";

// Get Convex URL with proper error handling
const getConvexUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!url) {
    console.warn('[convex-client] NEXT_PUBLIC_CONVEX_URL is not set. Convex client will not be initialized for server-side adapter calls.');
    // Return an empty string; code that depends on the client should guard this.
    return '';
  }

  return url;
};

const convexUrl = getConvexUrl();

let convex: any = null;
if (convexUrl) {
  convex = new ConvexHttpClient(convexUrl);
} else {
  console.warn('[convex-client] ConvexHttpClient not initialized due to missing NEXT_PUBLIC_CONVEX_URL.');
}

export const convexAdapter = convex ? ConvexAdapter(convex) : undefined as any;
export { convex };