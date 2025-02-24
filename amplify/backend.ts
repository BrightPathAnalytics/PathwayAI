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
      ["ChatRestApi"]: {
        endpoint: "https://mlc2bq2561.execute-api.us-west-2.amazonaws.com/Prod/chat",
        region: "us-west-2",
        apiName: "ChatRestApi",
      },
    },
    WebSocket: {
      ["ChatWebSocket"]: {
        endpoint: "wss://8vmg6i5bve.execute-api.us-west-2.amazonaws.com/Prod/",
        region: "us-west-2",
        apiName: "ChatWebSocket",
      },
    },
  },
});

export default backend;