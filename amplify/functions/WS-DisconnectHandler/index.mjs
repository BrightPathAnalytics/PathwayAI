import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-west-2" });

export const handler = async (event) => {
    console.log("Received disconnect event:", JSON.stringify(event, null, 2));

    if (!event.requestContext || !event.requestContext.connectionId) {
        console.error("Error: Missing requestContext in event");
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid request structure" }) };
    }

    const { connectionId } = event.requestContext;
    const tableName = "ConnectionTable"; // Ensure this is correct

    try {
        console.log(`Deleting connectionId: ${connectionId} from ${tableName}`);

        const deleteCommand = new DeleteItemCommand({
            TableName: tableName,
            Key: { connectionId: { S: connectionId } }
        });

        const result = await ddbClient.send(deleteCommand);
        console.log("DeleteItem result:", JSON.stringify(result, null, 2));

        // ✅ Explicitly return a valid API Gateway response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Disconnected successfully" })
        };
    } catch (error) {
        console.error("DeleteItem error:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Failed to delete connection" }) };
    }
};
