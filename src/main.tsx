import React from "react";
import ReactDOM from "react-dom/client";
//import { Authenticator } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import "./index.css";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';
import { parseAmplifyConfig } from "aws-amplify/utils";

// const externalAPIEndpoint = { name: "PathwayAIMVP", endpoint: "https://1mc0l359rl.execute-api.us-west-2.amazonaws.com/Prod"}

const amplifyConfig = parseAmplifyConfig(outputs);

Amplify.configure({
  ...amplifyConfig,
  API: {
    ...amplifyConfig.API,
    REST: outputs.custom.API,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 🚨 Temporarily remove authentication to prevent errors */}
    {/* <Authenticator> */}
      <App />
    {/* </Authenticator> */}
  </React.StrictMode>
);