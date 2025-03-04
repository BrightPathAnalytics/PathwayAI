import OpenAI from "openai";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const region = "us-west-2";
const endpoint = "https://sug5qgww0b.execute-api.us-west-2.amazonaws.com/Prod/";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ASSISTANT_ID = "asst_RBdyIF68NtuVqdjJY29f1b4T";

export const handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  if (!event.requestContext || !event.requestContext.connectionId) {
    console.error("Error: Missing requestContext in event");
    return { statusCode: 500, body: JSON.stringify({ message: "Invalid request structure" }) };
  }

  const { connectionId } = event.requestContext;
  const body = JSON.parse(event.body || "{}");
  const userMessage = body.message;

  const apiClient = new ApiGatewayManagementApiClient({ endpoint, region });

  try {
    const thread = await openai.beta.threads.create();

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userMessage
    });

    await new Promise((resolve, reject) => {
      const run = openai.beta.threads.runs.stream(thread.id, {
        assistant_id: ASSISTANT_ID,
        response_format: "json_object", // ✅ Request JSON output
      });

      run
        .on("textDelta", async (textDelta) => {
          try {
            const jsonChunk = JSON.parse(textDelta.value);
            console.log("Streaming JSON chunk:", jsonChunk);

            await apiClient.send(
              new PostToConnectionCommand({
                ConnectionId: connectionId,
                Data: JSON.stringify({ lesson_plan: jsonChunk })
              })
            );
          } catch (err) {
            console.error("Failed to parse JSON chunk:", err);
          }
        })
        .on("end", () => {
          console.log("Streaming complete.");
          resolve();
        })
        .on("error", (err) => {
          console.error("Error during streaming:", err);
          reject(err);
        });
    });

    return { statusCode: 200 };
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return { statusCode: 500, body: JSON.stringify({ message: "Failed to generate lesson plan" }) };
  }
};
