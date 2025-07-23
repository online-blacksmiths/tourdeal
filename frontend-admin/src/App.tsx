import { StrictMode } from "react";
import AppProvider from "./components/Providers";
import { RouterProvider } from "react-router";
import router from "./routers";
import { useAxiosInterceptor } from "./utils/axios";

export default function App() {
  // NOTE: axios 인터셉터 등록
  useAxiosInterceptor();

  return (
    <StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </StrictMode>
  );
}
