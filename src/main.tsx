import "open-props/normalize";
import "open-props/style";
import { invoke } from "@tauri-apps/api/core";
import { render } from "preact";
import App from "./App";
import "./css/base.css";

const root = document.getElementById("root");
if (root) render(<App />, root);

invoke<string | null>("get_accent_color")
  .then((color) => {
    if (color) {
      document.documentElement.style.setProperty("--brand", color);
      document.documentElement.style.setProperty("--brand-hover", color);
    }
  })
  .catch(() => {});
