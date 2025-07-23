import type { StateCreator } from "zustand";
import type { PersistOptions } from "zustand/middleware";

export interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export type PersistAuthStoreType = (
  config: StateCreator<AuthStore>,
  options: PersistOptions<AuthStore>
) => StateCreator<AuthStore>;
