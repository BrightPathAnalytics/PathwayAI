import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const createNewChat = () => {
    // Logic to create a new chat
    console.log('New chat created');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <button className="new-chat-button" onClick={createNewChat}>
          New Chat
        </button>
      </div>
    </div>
  );
};

export default Sidebar;