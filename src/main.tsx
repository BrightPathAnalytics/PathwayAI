import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { parseAmplifyConfig } from "aws-amplify/utils";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App";

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

// Define custom form fields for sign-up
const formFields = {
  signUp: {
    given_name: {
      label: "First Name",
      placeholder: "Enter your first name",
      isRequired: true,
    },
    family_name: {
      label: "Last Name",
      placeholder: "Enter your last name",
      isRequired: true,
    },
    email: {
      label: "Email",
      placeholder: "Enter your email",
      isRequired: true,
    },
    password: {
      label: "Password",
      placeholder: "Enter a strong password",
      isRequired: true,
    },
  },
};

// Render the authenticated app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator formFields={formFields}>
      <App />
    </Authenticator>
  </React.StrictMode>
);
