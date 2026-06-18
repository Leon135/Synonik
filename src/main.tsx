import "open-props/normalize";
import "open-props/style";
import { render } from "preact";
import App from "./App";
import "./css/base.css";

const root = document.getElementById("root");
if (root) render(<App />, root);
