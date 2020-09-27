import React from "react";
import ReactDOM from "react-dom";
// Scss
import "./styles/index.scss";
// Focus
import "focus-visible";
import "./focus";
// Components
import App from "./App";

ReactDOM.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById("root")
);
