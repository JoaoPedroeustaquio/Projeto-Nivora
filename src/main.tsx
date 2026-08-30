import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";

import { router } from "@/routes/router";

import { AuthProvider } from "@/contexts/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { TransactionProvider } from "@/contexts/TransactionProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <TransactionProvider>
          <RouterProvider router={router} />
        </TransactionProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);