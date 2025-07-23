import type { PropsWithChildren } from "react";
import QueryProvider from "./react-query";

export default function AppProvider({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}
