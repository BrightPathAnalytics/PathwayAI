/* temporarily removing data resource
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
*/
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.owner()]), // ✅ Keep existing model
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  // 🚨 Temporarily remove authorizationModes to avoid errors
  // authorizationModes: {
  //   defaultAuthorizationMode: "userPool",
  //   apiKeyAuthorizationMode: {
  //     expiresInDays: 30,
  //   },
  // },
});
