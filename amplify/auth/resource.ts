import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    givenName: {
      required: true, // First Name required
    },
    familyName: {
      required: true, // Last Name required
    },
  },
});