import React from "react";
import ReactDOM from "react-dom/client";
import { Presentation } from "./app/Presentation";
import "./styles/tokens.css";
import "./styles/presentation.css";
import "./styles/slide-navigator.css";
import "./styles/interaction.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Presentation />
  </React.StrictMode>,
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Local serving remains fully functional if browser storage is restricted.
    });
  });
}
