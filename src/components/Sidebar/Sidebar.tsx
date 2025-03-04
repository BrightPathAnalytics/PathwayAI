import React from 'react';
import { Flex, Button, Heading, Text, View } from '@aws-amplify/ui-react';

interface SidebarProps {
  onToggle: () => void;
  isOpen: boolean;
  userLoginId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle, isOpen, userLoginId }) => {
  const createNewChat = () => {
    console.log('New chat created');
  };

  return (
    <View
      width={isOpen ? '250px' : '0'}
      height="100vh"
      backgroundColor="neutral.100"
      padding={isOpen ? '1rem' : '0'}
      style={{
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        borderRight: '1px solid #ddd'
      }}
    >
      {isOpen && (
        <Flex direction="column" gap="1rem">
          <Heading level={4}>Menu</Heading>
          <Button onClick={onToggle} variation="primary">
            Toggle Sidebar
          </Button>
          <Button onClick={createNewChat} variation="link">
            New Chat
          </Button>
          <Text fontSize="small" color="neutral.600" marginTop="auto">
            {userLoginId}'s Conversation
          </Text>
        </Flex>
      )}
    </View>
  );
};

export default Sidebar;
