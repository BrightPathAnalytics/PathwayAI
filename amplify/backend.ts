import { defineBackend } from '@aws-amplify/backend';
//import { auth } from './auth/resource';
import { data } from './data/resource';

const backend = defineBackend({
  //auth,
  data,
});

// add outputs to the configuration file
backend.addOutput({
  custom: {
    API: {
      ["PathwayAIMVP"]: {
        endpoint: "https://1mc0l359rl.execute-api.us-west-2.amazonaws.com/Prod",
        region: "us-west-2",
        apiName: "PathwayAIMVP",
      },
    },
  },
});

export default backend;