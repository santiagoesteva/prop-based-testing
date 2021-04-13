import React from "react";
import ReactDOM from "react-dom";
import { Form } from "./form";

function App() {
  return (
    <div className="container m-5">
      <Form />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
