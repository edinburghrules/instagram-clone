import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import FirebaseContext from "./context/firebase";
import { firebase, FieldValue } from "./lib/firebase";

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue }}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// SEMANTIC COMMIT MESSAGES

// chore: add Oyster build script
// docs: explain hat wobble
// feat: add beta sequence
// fix: remove broken confirmation message
// refactor: share logic between 4d3d3d3 and flarhgunnstow
// style: convert tabs to spaces
// test: ensure Tayne retains clothing
