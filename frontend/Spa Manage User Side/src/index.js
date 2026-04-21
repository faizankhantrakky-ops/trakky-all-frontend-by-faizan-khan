// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { AuthProvider } from "./context/Auth";
import store from "./Store/store";
import { Provider } from "react-redux";

// NEW
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <AuthProvider>
      <HelmetProvider>   {/* Required for <Helmet> */}
        <App />
      </HelmetProvider>
    </AuthProvider>
  </Provider>
);