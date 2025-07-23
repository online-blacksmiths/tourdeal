import { StrictMode } from "react";
import AppProvider from "./components/Providers";
import { RouterProvider } from "react-router";
import router from "./routers";

export default function App() {
  return (
    <StrictMode>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </StrictMode>
  );
}
