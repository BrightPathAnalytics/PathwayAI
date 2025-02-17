import { defineFunction } from "@aws-amplify/backend";

export const chatbotApiFunction = defineFunction({
  environment: {
    name: "ChatbotHandlerLambda",
    entry: "functions/chat-bot/index.js",
    runtime: "nodejs18.x",
  }
});
