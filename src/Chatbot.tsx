import React, { useState } from 'react';
import { post } from 'aws-amplify/api';

interface ChatbotResponse {
  response: string;
}

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function postItem(): Promise<void> {
    console.log("postItem called with message:", message);
    setLoading(true);
    try {
      const restOperation = post({
        apiName: 'myRestApi',
        path: '/chat',
        options: {
          body: { message },
        },
      });
      console.log("API call initiated...");

      const { body } = await restOperation.response;
      if (!body) {
        throw new Error("Response body is null");
      }
      
      // First convert the JSON result to unknown, then assert to ChatbotResponse
      const jsonData = await body.json();
      const data = jsonData as unknown as ChatbotResponse;
      
      setResponseText(data.response);
    } catch (error: unknown) {
      let errMessage = "Unknown error";
      if (error instanceof Error) {
        errMessage = error.message;
      }
      console.error("POST call failed:", errMessage);
      setResponseText("Error: " + errMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleSendMessage() {
    if (!message.trim()) {
      console.warn("Message is empty");
      return;
    }
    postItem();
  }

  return (
    <div>
      <h2>Chatbot</h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>
      <p>Response: {responseText}</p>
    </div>
  );
};

export default Chatbot;
