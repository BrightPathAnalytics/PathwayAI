import React from "react";
import ReactDOM from "react-dom/client";
import AppWithAuth from "./AppWithAuth";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { parseAmplifyConfig } from "aws-amplify/utils";

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: outputs.custom.API,
  },
  custom: {
    WebSocket: outputs.custom.WebSocket,
  },
});

// Export a dummy function to make Fast Refresh work
export const enableFastRefresh = () => {};

// Render the authenticated app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithAuth />
  </React.StrictMode>
);
