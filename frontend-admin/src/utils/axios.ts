import { useAuthStore } from "@/stores/auth";
import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useCallback } from "react";

export const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function useAxiosInterceptor() {
  const { token } = useAuthStore();

  // NOTE: 요청 중간에 토큰 추가
  const requestInterceptor = useCallback(
    (config: InternalAxiosRequestConfig) => {
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    [token]
  );

  // NOTE: 응답 중간에 발생한 에러 메시지, 만료 토큰 등 처리
  const responseErrorInterceptor = useCallback(
    (error: AxiosError) => {
      if (error.response && error.response.data) {
        // TODO: 에러 발생 시 Toast 메시지 등 띄워주기
        console.log(error.response.data);
      }

      // 토큰 만료인 경우 로그아웃
      // TODO: 토큰 만료 시 refreshToken 호출
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }

      return Promise.reject(error);
    },
    [token]
  );

  const register = useCallback(() => {
    // 요청 인터셉터 등록
    instance.interceptors.request.use(requestInterceptor);

    // 응답 인터셉터 등록
    instance.interceptors.response.use((response) => {
      // 응답이 문제 없이 잘 왔다면 바로 사용함
      return response;
    }, responseErrorInterceptor);
  }, [token]);

  register();
}
