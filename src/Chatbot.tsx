import React, { useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';  // ✅ Corrected import for authentication
import { post } from '@aws-amplify/api-rest';  // ✅ Corrected import for REST API calls

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Sends a chat message to the REST API and handles the response
  async function sendChatMessage() {
    if (!message.trim()) return;
  
    setLoading(true);
    try {
      // 🔹 Fetch the user's authentication session
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();
  
      if (!idToken) {
        throw new Error("User is not authenticated.");
      }
  
      // 🔹 Call the API with the Authorization header
      const restOperation = post({
        apiName: "PathwayAIMVP",
        path: "/chat",
        options: {
          headers: {
            Authorization: `Bearer ${idToken}`, // ✅ Send Cognito token
          },
          body: { message },
        },
      });

      setResponseText(restOperation as unknown as string);
    } catch (error) {
      console.error("Error sending chat message:", error);
      setResponseText("Error: Unable to get a response");
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