import OpenAI from "openai";
import { ApiGatewayManagementApiClient, PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";

const region = "us-west-2";
const endpoint = "https://sug5qgww0b.execute-api.us-west-2.amazonaws.com/Prod/";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
        // OpenAI API Streaming Request
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }],
            stream: true
        });

        // Stream response chunks back to the client
        for await (const chunk of response) {
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
        console.error("Error sending OpenAI response:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to generate AI response" }) };
    }
};
