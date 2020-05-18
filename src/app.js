import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";

import Field from "./container/Field";

function Test() {
  return <Field />;
}

ReactDOM.render(
  <Test />,

  document.querySelector("#root")
);
