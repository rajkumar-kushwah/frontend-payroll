// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
 // add your global css or tailwind

const root = createRoot(document.getElementById("root"));
root.render(<App />);
