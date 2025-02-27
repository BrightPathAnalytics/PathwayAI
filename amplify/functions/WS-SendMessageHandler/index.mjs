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
        console.log("Creating a new OpenAI thread...");
        const thread = await openai.beta.threads.create();

        console.log(`Adding user message: "${userMessage}" to thread ${thread.id}`);
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userMessage
        });

        console.log(`Starting assistant ${ASSISTANT_ID} with event-based streaming...`);

        // ✅ Make sure Lambda waits until the stream is fully processed
        await new Promise((resolve, reject) => {
            const run = openai.beta.threads.runs.stream(thread.id, {
                assistant_id: ASSISTANT_ID
            });

            run
                .on('textCreated', (text) => {
                    console.log(`Assistant started response: "${text}"`);
                })
                .on('textDelta', async (textDelta) => {
                    console.log(`Streaming chunk: "${textDelta.value}"`);
                    
                    await apiClient.send(new PostToConnectionCommand({
                        ConnectionId: connectionId,
                        Data: JSON.stringify({ message: textDelta.value })
                    }));
                })
                .on('end', () => {
                    console.log("Streaming complete.");
                    resolve(); // ✅ Ensures Lambda only exits after streaming is done
                })
                .on('error', (err) => {
                    console.error("Error during streaming:", err);
                    reject(err);
                });
        });

        return { statusCode: 200 };
    } catch (error) {
        console.error("Error sending OpenAI Assistant response:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to generate AI response" }) };
    }
};
