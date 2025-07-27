import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

type PersistAuthStore = (
  config: StateCreator<AuthStore>,
  options: PersistOptions<AuthStore>,
) => StateCreator<AuthStore>;

export const useAuthStore = create<AuthStore>(
  (persist as PersistAuthStore)(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
