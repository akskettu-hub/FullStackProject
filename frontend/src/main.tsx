import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "./theme.ts";
import "./index.css";
import "@fontsource-variable/eb-garamond"; // Defaults to wght axis
import "@fontsource-variable/eb-garamond/wght.css"; // Specify axis
import "@fontsource-variable/eb-garamond/wght-italic.css"; // Specify axis and style

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
