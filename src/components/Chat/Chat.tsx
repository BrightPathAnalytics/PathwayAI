/*
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chat.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Sidebar from '../Sidebar/Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus, faCog, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { fetchAuthSession } from '@aws-amplify/auth';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { user, signOut } = useAuthenticator();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch existing conversation history
  // ✅ Use `useCallback` to prevent function recreation on every render
  const fetchConversation = useCallback(async (convId: string) => {
    try {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();
      if (!idToken) throw new Error("User is not authenticated.");

      const response = await fetch("https://fccnypowoe.execute-api.us-west-2.amazonaws.com/Prod/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.username,
          conversationId: convId,
        }),
      });

      const jsonData = await response.json();
      setMessages(jsonData.history || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  }, [user?.username]);

  // ✅ Determine conversationId ONCE and store it
  useEffect(() => {
    let storedConversationId = localStorage.getItem("conversationId");

    if (!storedConversationId) {
      storedConversationId = uuidv4();
      localStorage.setItem("conversationId", storedConversationId);
    }

    setConversationId(storedConversationId);
    fetchConversation(storedConversationId);
  }, [fetchConversation]); // ✅ Now includes `fetchConversation` in dependencies

  // ✅ Send message along with conversationId
  const sendChatMessage = async (message: string): Promise<string> => {
    if (!message.trim()) return "No message provided";
    if (!conversationId) return "Error: Conversation ID is missing";

    setLoading(true);
    try {
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();
      if (!idToken) throw new Error("User is not authenticated.");

      const response = await fetch("https://fccnypowoe.execute-api.us-west-2.amazonaws.com/Prod/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.username,
          conversationId, // Always use the stored conversationId
          message,
        }),
      });

      const jsonData = await response.json();

      // ✅ Update conversationId in local storage if a new one was created
      if (jsonData.conversationId && jsonData.conversationId !== conversationId) {
        setConversationId(jsonData.conversationId);
        localStorage.setItem("conversationId", jsonData.conversationId);
      }

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

    // Send message to backend and get response
    const botResponse = await sendChatMessage(input);

    const botMessage: Message = {
      id: messages.length + 2,
      text: botResponse,
      sender: 'bot',
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFeedbackToggle = () => {
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleFeedbackSubmit = () => {
    console.log('Feedback submitted:', feedback);
    setIsFeedbackOpen(false);
    setFeedback('');
    // Logic to submit feedback 
  };

  const createNewChat = () => {
    console.log('New chat created');
  };

  return (
    <div className={`chat-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar onToggle={handleSidebarToggle} isOpen={isSidebarOpen} userLoginId={user?.signInDetails?.loginId} />
      <div className="chat-header">
        <div className="left-buttons">
          {!isSidebarOpen && (
            <>
              <button className="toggle-button" onClick={handleSidebarToggle}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <button className="new-chat-button" onClick={createNewChat}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </>
          )}
        </div>
        <div className="right-buttons">
          <button className="feedback-button" onClick={handleFeedbackToggle}>
            <FontAwesomeIcon icon={faCommentDots} />
          </button>
          <button className="settings-button" onClick={handleSettingsToggle}>
            <FontAwesomeIcon icon={faCog} />
          </button>
          <button className="sign-out-button" onClick={signOut}>Sign out</button>
        </div>
      </div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
          </div>
        ))}
        <div ref={chatEndRef} />
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
      {isFeedbackOpen && (
        <div className="feedback-popup">
          <h3>Feedback</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here..."
          />
          <button onClick={handleFeedbackSubmit}>Submit</button>
        </div>
      )}
      {isSettingsOpen && (
        <div className="settings-popup">
          <h3>Settings</h3>
          <p>Settings content goes here...</p>
          <button onClick={handleSettingsToggle}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
*/

/**
 * Client (Chat.tsx):
• Opens a persistent WebSocket connection to API Gateway.
• When a chat message is sent, the client triggers a REST API (or includes its connection ID
  in the payload) so that your backend process knows where to stream responses.
 */
  import React, { useState, useEffect, useRef } from 'react';
  import './Chat.css';
  import { useAuthenticator } from '@aws-amplify/ui-react';
  import Sidebar from '../Sidebar/Sidebar';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faBars, faPlus, faCog, faCommentDots } from '@fortawesome/free-solid-svg-icons';
  import { fetchAuthSession } from '@aws-amplify/auth';
  import ReactMarkdown from "react-markdown";
  import remarkGfm from "remark-gfm";
  
  // Import our custom WebSocket hook and its type.
  import useWebSocket, { WebSocketMessage } from '../../hooks/useWebSocket';
  
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [connectionId, setConnectionId] = useState<string | null>(null);
  
    // Scroll to bottom when messages update.
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    // Handle incoming WebSocket messages.
    const handleMessage = (data: WebSocketMessage) => {
      if (data.connectionId) {
        console.log("Received connectionId:", data.connectionId);
        setConnectionId(data.connectionId);
        return;
      }
      if (data.text) {
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            const updatedMessage: Message = { 
              ...lastMessage, 
              text: lastMessage.text + (data.text || "") 
            };
            return [...prev.slice(0, -1), updatedMessage];
          }
          return [...prev, { id: Date.now(), text: data.text || "", sender: 'bot' }];
        });
      }
    };
  
    // Establish WebSocket connection using the custom hook.
    useWebSocket({
      url: "wss://8vmg6i5bve.execute-api.us-west-2.amazonaws.com/Prod/",
      onMessage: handleMessage,
    });
  
    // Send a chat message to the backend.
    const sendChatMessage = async (message: string): Promise<string> => {
      if (!message.trim()) return "No message provided";
      if (!connectionId) return "Error: WebSocket connection is not established";
  
      setLoading(true);
      try {
        const { tokens } = await fetchAuthSession();
        const idToken = tokens?.idToken?.toString();
        if (!idToken) throw new Error("User is not authenticated.");
  
        const response = await fetch("https://mlc2bq2561.execute-api.us-west-2.amazonaws.com/Prod/chat", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.username,
            message,
            connectionId,
          }),
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
  
    // Trigger sending a message.
    const sendMessage = async () => {
      if (input.trim() === '') return;
      // Add user's message to UI.
      const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);
  
      // Add placeholder for bot's streaming response.
      const botMessageId = Date.now() + 1;
      setMessages(prev => [...prev, { id: botMessageId, text: "", sender: 'bot' }]);
  
      const currentInput = input;
      setInput('');
      sendChatMessage(currentInput)
        .then((res) => {
          console.log("Streaming initiated:", res);
        })
        .catch(err => console.error("Error in sendChatMessage:", err));
    };
  
    // UI toggles and handlers.
    const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);
    const handleFeedbackToggle = () => setIsFeedbackOpen(!isFeedbackOpen);
    const handleSettingsToggle = () => setIsSettingsOpen(!isSettingsOpen);
    const handleFeedbackSubmit = () => {
      console.log('Feedback submitted:', feedback);
      setIsFeedbackOpen(false);
      setFeedback('');
    };
    const createNewChat = () => {
      console.log('New chat created');
    };
  
    return (
      <div className={`chat-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar onToggle={handleSidebarToggle} isOpen={isSidebarOpen} userLoginId={user?.signInDetails?.loginId} />
        <div className="chat-header">
          <div className="left-buttons">
            {!isSidebarOpen && (
              <>
                <button className="toggle-button" onClick={handleSidebarToggle}>
                  <FontAwesomeIcon icon={faBars} />
                </button>
                <button className="new-chat-button" onClick={createNewChat}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </>
            )}
          </div>
          <div className="right-buttons">
            <button className="feedback-button" onClick={handleFeedbackToggle}>
              <FontAwesomeIcon icon={faCommentDots} />
            </button>
            <button className="settings-button" onClick={handleSettingsToggle}>
              <FontAwesomeIcon icon={faCog} />
            </button>
            <button className="sign-out-button" onClick={signOut}>Sign out</button>
          </div>
        </div>
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} disabled={loading || !connectionId}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        {isFeedbackOpen && (
          <div className="feedback-popup">
            <h3>Feedback</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
            />
            <button onClick={handleFeedbackSubmit}>Submit</button>
          </div>
        )}
        {isSettingsOpen && (
          <div className="settings-popup">
            <h3>Settings</h3>
            <p>Settings content goes here...</p>
            <button onClick={handleSettingsToggle}>Close</button>
          </div>
        )}
      </div>
    );
  };
  
  export default Chat;
  