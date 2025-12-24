import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom"; // ← Ajoute cette ligne

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>  {/* ← Enveloppe toute ton app ici */}
    <App />
  </BrowserRouter>
);