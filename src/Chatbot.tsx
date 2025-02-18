import React, { useState } from 'react';
import { post } from 'aws-amplify/api';

interface ChatbotResponse {
  response: string;
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Sends a chat message to the REST API and handles the response
  async function sendChatMessage(): Promise<void> {
    if (!message.trim()) {
      return;
    }
    setLoading(true);
    try {
      // Call the REST API endpoint for the chatbot
      const restOperation = post({
        apiName: 'PathwayAIMVP', // Ensure this matches your Amplify API name
        path: '/chat',        // Ensure this matches your API resource path
        options: {
          body: { message },
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'OPTIONS,POST',
          },
        },
      });
      
      const { body } = await restOperation.response;
      if (!body) {
        throw new Error("Response body is null");
      }
      const jsonData = await body.json();
      const chatbotResponse = jsonData as unknown as ChatbotResponse;
      console.log("Chatbot response:", chatbotResponse);
      
      // Update the latest response state
      setResponseText(chatbotResponse.response);
    } catch (error: unknown) {
      let errMessage = "Unknown error";
      if (error instanceof Error) {
        errMessage = error.message;
      }
      console.error("Error sending chat message:", errMessage);
      setResponseText("Error: " + errMessage);
    } finally {
      setLoading(false);
      setMessage('');
    }
  }

  return (
    <div>
      <h2>Chatbot</h2>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendChatMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <p><strong>Response:</strong> {responseText}</p>
    </div>
  );
};

export default Chatbot;