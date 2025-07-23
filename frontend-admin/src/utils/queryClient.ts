import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 60 * 1000, // 데이터 유효시간 (1분), 데이터가 유효한 시간
      gcTime: 1000 * 60 * 5, // 가비지 컬렉션 시간 (5분), 데이터 캐시 삭제 시간
      networkMode: "offlineFirst",
    },
  },
});
