// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
 // add your global css or tailwind

const root = createRoot(document.getElementById("root"));
root.render(<App />);
