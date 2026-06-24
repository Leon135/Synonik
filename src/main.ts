import { createApp } from "vue";
import { invoke } from "@tauri-apps/api/core";
import App from "./App.vue";
import "open-props/normalize";
import "open-props/style";
import "./css/base.css";

const app = createApp(App);
app.mount("#root");

invoke<string | null>("get_accent_color")
  .then((color) => {
    if (color) {
      document.documentElement.style.setProperty("--brand", color);
      document.documentElement.style.setProperty("--brand-hover", color);
    }
  })
  .catch(() => {});
