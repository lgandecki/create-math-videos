import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  httpLink,
  splitLink,
  isNonJsonSerializable,
  httpSubscriptionLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../backend/src/trpc/actualRouter";

export const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      // Use SSE for subscriptions
      condition: (op) => op.type === "subscription",
      true: httpSubscriptionLink({
        url: import.meta.env.VITE_API_URL + "/trpc",
      }),
      false: splitLink({
        // Use httpLink for non-JSON requests (like FormData)
        condition: (op) => isNonJsonSerializable(op.input),
        true: httpLink({
          url: import.meta.env.VITE_API_URL + "/trpc",
        }),
        false: httpBatchLink({
          url: import.meta.env.VITE_API_URL + "/trpc",
        }),
      }),
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

// Export the raw client for direct subscription access
export { trpcClient };
