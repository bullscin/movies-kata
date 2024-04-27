import React from "react";
import { createRoot } from "react-dom/client";
import MoviesApp from "./components/MovieApp/MovieApp";

const container = document.getElementById("root");
const rootInstance = createRoot(container);

rootInstance.render(<MoviesApp />);
