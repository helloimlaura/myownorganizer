import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration.ts";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below
serviceWorkerRegistration.register();
