import { withAuthenticator } from "@aws-amplify/ui-react";
import App from "./App";

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

// Wrap the App component with the Authenticator
const AppWithAuth = withAuthenticator(App, {
  formFields
});

export default AppWithAuth; 