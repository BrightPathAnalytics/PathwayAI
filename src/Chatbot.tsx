import React, { useState } from 'react';
import { post } from 'aws-amplify/api';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

// Generate the data client from your backend schema
const client = generateClient<Schema>();

interface ChatbotResponse {
  response: string;
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [responseText, setResponseText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Saves a chat entry to your ChatHistory model
  async function saveChatHistory(chatContent: string): Promise<void> {
    try {
      const newEntry = await client.models.ChatHistory.create({
        content: chatContent,
        createdAt: new Date().toISOString(),
      });
      console.log('Chat saved:', newEntry);
      setChatHistory((prev) => [...prev, chatContent]);
    } catch (error: unknown) {
      let errMessage = "Unknown error";
      if (error instanceof Error) {
        errMessage = error.message;
      }
      console.error("Error saving chat:", errMessage);
    }
  }

  // Sends a chat message to the REST API and handles the response
  async function sendChatMessage(): Promise<void> {
    if (!message.trim()) {
      return;
    }
    setLoading(true);
    try {
      // Call the REST API endpoint for the chatbot
      const restOperation = post({
        apiName: 'myRestApi', // Ensure this matches your Amplify API name
        path: '/chat',        // Ensure this matches your API resource path
        options: {
          body: { message },
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
      
      // Save both the user's message and the bot's reply in chat history
      await saveChatHistory(`You: ${message}`);
      await saveChatHistory(`Bot: ${chatbotResponse.response}`);
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
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      <div>
        <h3>Chat History</h3>
        <ul>
          {chatHistory.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
      <p>Latest Response: {responseText}</p>
    </div>
  );
};

export default Chatbot;
