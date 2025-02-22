import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onToggle: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle, isOpen }) => {
  const createNewChat = () => {
    // Logic to create a new chat
    console.log('New chat created');
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={onToggle}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <button className="new-chat-button" onClick={createNewChat}>
            New Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;