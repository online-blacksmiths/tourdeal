import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useCallback } from "react";

import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/components/ui/toast";

import { getErrorMessage } from "./getErrorMessage";

export const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});

export function useAxiosInstance() {
  // TODO: 토큰 가져오는 작업 필요

  const toast = useToast();

  const requestInterceptor = useCallback(
    (config: InternalAxiosRequestConfig) => {
      // TODO: 토큰 Header에 추가하는 로직 추가 필요
      return config;
    },
    [],
  );

  const responseErrorInterceptor = useCallback(
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // TODO: 토큰 만료 시 refreshToken 사용하여 accessToken 재발급
      }

      const message = getErrorMessage(error);
      toast.show({
        id: "axios-error",
        placement: "top",
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = `toast-${id}`;
          return (
            <Toast nativeID={uniqueToastId} action="error" variant="outline">
              <ToastTitle>서버 에러가 발생했습니다</ToastTitle>
              <ToastDescription>{message}</ToastDescription>
            </Toast>
          );
        },
      });
      return Promise.reject(error);
    },
    [toast],
  );

  const registerInterceptors = useCallback(() => {
    instance.interceptors.request.use(requestInterceptor);
    instance.interceptors.response.use(
      (response) => response,
      responseErrorInterceptor,
    );
  }, []);

  registerInterceptors();
}
