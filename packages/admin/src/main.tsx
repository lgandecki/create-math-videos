import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import { ToastProvider } from "./components/Toast/ToastProvider";
import { queryClient } from "./utils/trpc";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/lessons/:lessonName" element={<App />} />
        </Routes>
        <ToastProvider />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
