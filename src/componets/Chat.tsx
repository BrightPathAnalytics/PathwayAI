import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Chat.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCommentDots } from '@fortawesome/free-solid-svg-icons';
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

      const response = await fetch("https://1mc0l359rl.execute-api.us-west-2.amazonaws.com/Prod/chat", {
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
  }, [user?.username]); // ✅ Dependency array includes `user?.username`

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

      const response = await fetch("https://1mc0l359rl.execute-api.us-west-2.amazonaws.com/Prod/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
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
    /* Logic to submit feedback */
  };

  return (
    <div className={`chat-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar onToggle={handleSidebarToggle} isOpen={isSidebarOpen} />
      <div className="chat-header">
        <span className="user-info">{user?.signInDetails?.loginId}'s Conversation</span>
        <div className="header-buttons">
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