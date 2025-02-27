import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-west-2" });

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    if (!event.requestContext || !event.requestContext.connectionId) {
        console.error("Error: Missing requestContext in event");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Invalid request structure" })
        };
    }

    const { connectionId } = event.requestContext;
    console.log("Connection ID:", connectionId);
    const tableName = process.env.CONNECTIONS_TABLE;

    try {
        console.log(`Adding connectionId: ${connectionId} to ${tableName}`);

        const putCommand = new PutItemCommand({
            TableName: tableName,
            Key: { connectionId: { S: connectionId } }
        });

        const result = await ddbClient.send(putCommand);
        console.log("PutItem result:", JSON.stringify(result, null, 2));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Connected successfully" })
        };
    } catch (error) {
        console.error("PutItem error:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to make connection" }) };
    }
};
