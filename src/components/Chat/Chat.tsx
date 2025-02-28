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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import useWebSocket from 'react-use-websocket';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const WEBSOCKET_URL = "wss://sug5qgww0b.execute-api.us-west-2.amazonaws.com/Prod/";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { user, signOut } = useAuthenticator();
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const botMessageIdRef = useRef<number | null>(null);
  const currentMessage = useRef(""); // ✅ Persistent full message
  const messageQueue = useRef<string[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ WebSocket connection using `react-use-websocket`
  const { sendMessage } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: () => true, // ✅ Auto-reconnect on disconnect
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      if (data.message) {
        messageQueue.current.push(data.message); // ✅ Queue incoming message chunks

        // ✅ Process queue at controlled intervals to ensure order
        if (data.message.includes("\n") || messageQueue.current.length > 10) {
          currentMessage.current += messageQueue.current.join(" "); // ✅ Append queued chunks
          messageQueue.current = []; // ✅ Clear processed queue

          setMessages((prevMessages) => {
            if (botMessageIdRef.current !== null) {
              return prevMessages.map((msg) =>
                msg.id === botMessageIdRef.current
                  ? { ...msg, text: currentMessage.current.trim() }
                  : msg
              );
            } else {
              const newBotMessage: Message = {
                id: prevMessages.length + 1,
                text: currentMessage.current.trim(),
                sender: "bot",
              };
              botMessageIdRef.current = newBotMessage.id;
              return [...prevMessages, newBotMessage];
            }
          });
        }
      }
    },
  });

  const sendChatMessage = () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setInput("");

    sendMessage(JSON.stringify({ action: "sendMessage", message: input }));
    
    botMessageIdRef.current = null; // ✅ Reset bot message tracking
    currentMessage.current = ""; // ✅ Reset bot message buffer
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
    setMessages([]);
    botMessageIdRef.current = null;
    currentMessage.current = "";
    // Logic to create new chat
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
            onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
          />
          <button onClick={sendChatMessage} disabled={loading}>
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