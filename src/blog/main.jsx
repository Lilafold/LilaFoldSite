import "@fontsource-variable/funnel-display";
import "@fontsource-variable/funnel-sans";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BlogApp from "./BlogApp.jsx";
import "../styles.css";
import "./blog.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BlogApp />
  </StrictMode>
);
