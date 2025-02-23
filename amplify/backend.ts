import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  auth,
  data,
});

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      ["PathwayAIMVP-Dev"]: {
        endpoint: "https://fccnypowoe.execute-api.us-west-2.amazonaws.com/Prod",
        region: "us-west-2",
        apiName: "PathwayAIMVP-Dev",
      },
    },
  },
});

export default backend;