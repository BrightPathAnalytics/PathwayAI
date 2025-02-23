import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  onToggle: () => void;
  isOpen: boolean;
  userLoginId: string | undefined; // Add userLoginId prop
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle, isOpen, userLoginId }) => {
  const createNewChat = () => {
    // Logic to create a new chat
    console.log('New chat created');
  };

  return (
    <div>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="toggle-button" onClick={onToggle}>
            <FontAwesomeIcon icon={faBars} />
            {/* <span className="button-text">Menu</span> */}
          </button>
          <button className="new-chat-button" onClick={createNewChat}>
            <FontAwesomeIcon icon={faPlus} />
            {/* <span className="button-text">New Chat</span> */}
          </button>
        </div>
        <div className={`sidebar-content ${isOpen ? 'visible' : 'hidden'}`}>
          {/* Add other sidebar content here */}
          <div className="user-info">{userLoginId}'s Conversation</div> {/* Add user info */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;