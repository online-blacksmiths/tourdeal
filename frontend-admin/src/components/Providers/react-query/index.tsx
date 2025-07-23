import type { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/utils/queryClient";

export default function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
