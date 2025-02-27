import OpenAI from "openai";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const region = "us-west-2";
const endpoint = "https://sug5qgww0b.execute-api.us-west-2.amazonaws.com/Prod/";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ASSISTANT_ID = "asst_UcvAh2XE232H1vjOuwrVFgNN";

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
        // Create a new OpenAI Thread (conversation)
        const thread = await openai.beta.threads.create();

        // Add the user message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userMessage
        });

        // Run the assistant on the thread
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: ASSISTANT_ID,
            stream: true // Enable streaming
        });

        // Stream responses back to the WebSocket client
        for await (const chunk of run) {
            if (chunk.choices && chunk.choices[0].delta.content) {
                const messageChunk = chunk.choices[0].delta.content;

                await apiClient.send(new PostToConnectionCommand({
                    ConnectionId: connectionId,
                    Data: JSON.stringify({ message: messageChunk })
                }));
            }
        }

        return { statusCode: 200 };
    } catch (error) {
        console.error("Error sending OpenAI Assistant response:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to generate AI response" }) };
    }

};
