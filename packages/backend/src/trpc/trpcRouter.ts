import { initTRPC } from "@trpc/server";

import type { createContext } from "./actualRouter";

type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create({
  sse: {
    ping: {
      // Enable ping comments sent from the server
      enabled: true,
      // Send ping message every 2s to keep connection alive
      intervalMs: 2000,
    },
    // Maximum duration in milliseconds for the request before ending the stream
    // Set to 10 minutes - adjust as needed
    maxDurationMs: 600_000,
    client: {
      // Reconnect if no messages or pings are received for 5 seconds
      reconnectAfterInactivityMs: 5000,
    },
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
