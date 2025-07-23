import { type AuthStore, type PersistAuthStoreType } from "@/types/auth";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

// NOTE: AuthToken 전역 상태 저장소 생성 및 localStorage에 저장

export const useAuthStore = create<AuthStore>()(
  devtools(
    (persist as PersistAuthStoreType)(
      (set) => ({
        token: null,
        setToken(token: string) {
          set({ token });
        },
        logout() {
          set({ token: null });
        },
      }),
      {
        name: "token",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
