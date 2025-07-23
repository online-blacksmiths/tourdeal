import { type RouteObject } from "react-router";
import AuthGuard from "./AuthGuard";
import Layout from "@/components/Layout";
import PATH from "@/constants/path";
import Home from "@/pages/Home";

export const routes: RouteObject[] = [
  {
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      {
        path: PATH.HOME,
        element: <Home />,
      },
    ],
  },
];
