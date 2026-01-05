// src/main.tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import "./styles/index.css";
// Initialiser i18n avec le système de traduction hybride
import "./i18n/config";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);