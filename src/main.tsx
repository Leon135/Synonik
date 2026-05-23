import "open-props/normalize";
import "open-props/style";
import { render } from "preact";
import App from "./App";
import "./css/theme.css";

render(<App />, document.getElementById("root")!);
