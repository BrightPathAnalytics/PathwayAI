import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SheetsPage from "./app/sheets/page";
import SchedulePage from "./app/schedule/page";
import HomePage from "./app/home/page";
import HelpPage from "./app/help/page";
import AssistantPage from "./app/assistant/page";
import ReportsPage from "./app/reports/page";
import AuthTest from "./app/auth-test";
import { Layout } from "./components/layout";
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

// Wrap the App component with BrowserRouter and define routes
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator formFields={formFields}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="sheets" element={<SheetsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
          <Route path="/auth-test" element={<AuthTest />} />
        </Routes>
      </BrowserRouter>
    </Authenticator>
  </React.StrictMode>
);
