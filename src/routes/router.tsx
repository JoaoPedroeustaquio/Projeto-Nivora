import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Dashboard from "@/features/dashboard/dashboard";
import Transactions from "@/features/transactions/Transactions";

import Login from "@/features/auth/Login/login";
import NotFound from "@/features/NotFound/Notfound";

import ProtectedRoute from "@/routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/lancamentos",
        element: <Transactions />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);