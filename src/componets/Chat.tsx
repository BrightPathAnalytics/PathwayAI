// import React, { useState } from 'react';
// import './Chat.css';
// import { useAuthenticator } from '@aws-amplify/ui-react';
// import Sidebar from './Sidebar'; // Import the Sidebar component
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCog } from '@fortawesome/free-solid-svg-icons';

// interface Message {
//   id: number;
//   text: string;
//   sender: 'user' | 'bot';
// }

// const Chat: React.FC = () => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState('');
//   const { user, signOut } = useAuthenticator();

//   const sendMessage = async () => {
//     if (input.trim() === '') return;

//     const userMessage: Message = {
//       id: messages.length + 1,
//       text: input,
//       sender: 'user',
//     };

//     setMessages([...messages, userMessage]);
//     setInput('');

//     // Hardcoded bot response
//     const botMessage: Message = {
//       id: messages.length + 2,
//       text: 'This is a hardcoded response from the bot.',
//       sender: 'bot',
//     };

//     setMessages((prevMessages) => [...prevMessages, botMessage]);
//   };

//   return (
//     <div className="chat-container">
//       <Sidebar /> {/* Add the Sidebar component */}
//       <div className="chat-header">
//         <span className="user-info">{user?.signInDetails?.loginId}'s Conversation</span>
//         <div className="header-buttons">
//           <button className="settings-button">
//             <FontAwesomeIcon icon={faCog} />
//           </button>
//           <button className="sign-out-button" onClick={signOut}>Sign out</button>
//         </div>
//       </div>
//       <div className="messages">
//         {messages.map((message) => (
//           <div key={message.id} className={`message ${message.sender}`}>
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;


import React, { useState } from 'react';
import './Chat.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { fetchAuthSession } from '@aws-amplify/auth';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { user, signOut } = useAuthenticator();
  const [loading, setLoading] = useState<boolean>(false);

  const sendChatMessage = async (message: string): Promise<string> => {
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
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Send message to the backend and get the response
    const botResponse = await sendChatMessage(input);

    const botMessage: Message = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot',
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className="chat-container">
      <Sidebar /> {/* Add the Sidebar component */}
      <div className="chat-header">
        <span className="user-info">{user?.signInDetails?.loginId}'s Conversation</span>
        <div className="header-buttons">
          <button className="settings-button">
            <FontAwesomeIcon icon={faCog} />
          </button>
          <button className="sign-out-button" onClick={signOut}>Sign out</button>
        </div>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;