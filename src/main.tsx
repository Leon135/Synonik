// @ts-ignore
import "open-props/normalize";
// @ts-ignore
import "open-props/style";
import { render } from "preact";
import App from "./App";
import "./css/base.css";

render(<App />, document.getElementById("root")!);
