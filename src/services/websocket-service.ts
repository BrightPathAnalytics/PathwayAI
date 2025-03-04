import { Amplify } from "aws-amplify";

/**
 * Gets the WebSocket URL from Amplify configuration
 * @returns The WebSocket URL from Amplify configuration or a fallback URL
 */
export const getWebSocketUrl = (): string => {
  const config = Amplify.getConfig();
  // @ts-expect-error - custom property might not be recognized by TypeScript
  return config.custom?.WebSocket?.ChatWebSocket?.endpoint || 
    "wss://8vmg6i5bve.execute-api.us-west-2.amazonaws.com/Prod/";
};

/**
 * Formats a message to be sent to the WebSocket API
 * @param message The message to send
 * @returns A formatted message object
 */
export const formatMessage = (message: string): string => {
  return JSON.stringify({
    action: "sendMessage",
    message
  });
};

/**
 * Parses a WebSocket message
 * @param data The raw message data
 * @returns The parsed message or null if parsing fails
 */
export const parseWebSocketMessage = (data: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing WebSocket message:", error);
    return null;
  }
}; 