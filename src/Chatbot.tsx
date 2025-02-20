// import React, { useState } from 'react';
// import { fetchAuthSession } from '@aws-amplify/auth';  // ✅ Corrected import for authentication
// //import { post } from '@aws-amplify/api-rest';  // ✅ Corrected import for REST API calls

// const Chatbot: React.FC = () => {
//   const [message, setMessage] = useState<string>('');
//   const [responseText, setResponseText] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);

//   // Sends a chat message to the REST API and handles the response
//   async function sendChatMessage() {
//     if (!message.trim()) return;
  
//     setLoading(true);
//     try {
//       // 🔹 Fetch the user's authentication session
//       const { tokens } = await fetchAuthSession();
//       const idToken = tokens?.idToken?.toString();
  
//       if (!idToken) {
//         throw new Error("User is not authenticated.");
//       }
  
//       // 🔹 Directly call API Gateway with fetch()
//     const response = await fetch("https://1mc0l359rl.execute-api.us-west-2.amazonaws.com/Prod/chat", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${idToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ message }),
//     });

//     const jsonData = await response.json();
//     setResponseText(jsonData.response ?? "No response received");
//     } catch (error) {
//       console.error("Error sending chat message:", error);
//       setResponseText("Error: Unable to get a response");
//     } finally {
//       setLoading(false);
//       setMessage('');
//     }
//   }

//   return (
//     <div>
//       <h2>Chatbot</h2>
//       <div>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendChatMessage} disabled={loading}>
//           {loading ? 'Sending...' : 'Send'}
//         </button>
//       </div>
//       <p><strong>Response:</strong> {responseText}</p>
//     </div>
//   );
// };

// export default Chatbot;


import React, { useState } from 'react';
import { fetchAuthSession } from '@aws-amplify/auth';

const Chatbot: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [responseText, setResponseText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Sends a chat message to the REST API and handles the response
  async function sendChatMessage(message: string): Promise<string> {
    if (!message.trim()) return "No message provided";

    setLoading(true);
    try {
      // Fetch the user's authentication session
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();

      if (!idToken) {
        throw new Error("User is not authenticated.");
      }

      // Directly call API Gateway with fetch()
      const response = await fetch("https://1mc0l359rl.execute-api.us-west-2.amazonaws.com/Prod/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const jsonData = await response.json();
      return jsonData.response ?? "No response received";
    } catch (error) {
      console.error("Error sending chat message:", error);
      return "Error: Unable to get a response";
    } finally {
      setLoading(false);
    }
  }

  const handleSendMessage = async () => {
    const response = await sendChatMessage(message);
    setResponseText(response);
    setMessage('');
  };

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
        <button onClick={handleSendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <p><strong>Response:</strong> {responseText}</p>
    </div>
  );
};

export default Chatbot;