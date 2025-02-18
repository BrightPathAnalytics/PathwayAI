import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
//import { Stack } from "aws-cdk-lib";
//import {
  // AuthorizationType,
  // CognitoUserPoolsAuthorizer,
  // Cors,
  // LambdaIntegration,
  // RestApi,
// } from "aws-cdk-lib/aws-apigateway";
// import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { chatbotApiFunction } from "./functions/chat-bot/resource";
//import { HelloWorldLambdaStack } from './functions/resources';

const backend = defineBackend({
  auth,
  data,
  chatbotApiFunction,
});


/*
// create a new API stack
const apiStack = backend.createStack("PathwayAIMVP-stack");

// create a new REST API
const pathwayAIApi = new RestApi(apiStack, "RestApi", {
  restApiName: "PathwayAIMVP",
  deploy: true,
  deployOptions: {
    stageName: "dev",
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS, // Restrict this to domains you trust
    allowMethods: Cors.ALL_METHODS, // Specify only the methods you need to allow
    allowHeaders: Cors.DEFAULT_HEADERS, // Specify only the headers you need to allow
  },
});

// Create a Lambda integration using your chatbot function
const lambdaIntegration = new LambdaIntegration(
  backend.chatbotApiFunction.resources.lambda
);

// create a new Cognito User Pools authorizer
// const cognitoAuth = new CognitoUserPoolsAuthorizer(apiStack, "CognitoAuth", {
//   cognitoUserPools: [backend.auth.resources.userPool],
// });
const chatPath = pathwayAIApi.root.addResource("chat");
chatPath.addMethod("POST", lambdaIntegration, {
  authorizationType: AuthorizationType.NONE,
  // authorizer: cognitoAuth,
});

// Optionally, add a proxy resource if you want to support additional methods:
// chatPath.addProxy({
//   anyMethod: true,
//   defaultIntegration: lambdaIntegration,
// });

// create a new resource path with Cognito authorization
// const booksPath = myRestApi.root.addResource("cognito-auth-path");
// booksPath.addMethod("GET", lambdaIntegration, {
//   authorizationType: AuthorizationType.NONE,
//   //authorizer: cognitoAuth,
// });

// create a new IAM policy to allow Invoke access to the API
const apiRestPolicy = new Policy(apiStack, "RestApiPolicy", {
  statements: [
    new PolicyStatement({
      actions: ["execute-api:Invoke"],
      resources: [
        `${pathwayAIApi.arnForExecuteApi("*", "/chat", "dev")}`,
        `${pathwayAIApi.arnForExecuteApi("*", "/chat/*", "dev")}`,
        `${pathwayAIApi.arnForExecuteApi("*", "/cognito-auth-path", "dev")}`,
      ],
    }),
  ],
});

// attach the policy to the authenticated and unauthenticated IAM roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  apiRestPolicy
);
*/
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