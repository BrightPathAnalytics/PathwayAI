import React, { useState, useEffect, useRef } from 'react';
import useWebSocket from 'react-use-websocket';
import { useAuthenticator } from '@aws-amplify/ui-react';
import {
  View,
  Flex,
  Button,
  TextField,
  Card,
  Heading,
  Text,
  Divider,
} from '@aws-amplify/ui-react';
import { Sidebar } from '../Sidebar/Sidebar';

interface LessonPlan {
  title: string;
  grade_level: string;
  duration: string;
  objectives: string[];
  materials: string[];
  activities: { name: string; duration: string }[];
}

interface Message {
  id: number;
  text?: string;
  sender: 'user' | 'bot';
  lessonPlan?: LessonPlan;
}

const WEBSOCKET_URL = "wss://sug5qgww0b.execute-api.us-west-2.amazonaws.com/Prod/";

const LessonPlanCard = ({ plan }: { plan: LessonPlan }) => (
  <Card variation="outlined" padding="1.5rem" margin="1rem 0">
    <Heading level={4}>{plan.title}</Heading>
    <Text>Grade Level: {plan.grade_level}</Text>
    <Text>Duration: {plan.duration}</Text>

    <Heading level={5} marginTop="1rem">Objectives</Heading>
    <ul>
      {plan.objectives.map((o, i) => <li key={i}>{o}</li>)}
    </ul>

    <Heading level={5} marginTop="1rem">Materials</Heading>
    <ul>
      {plan.materials.map((m, i) => <li key={i}>{m}</li>)}
    </ul>

    <Heading level={5} marginTop="1rem">Activities</Heading>
    <ul>
      {plan.activities.map((a, i) => <li key={i}>{a.name} - {a.duration}</li>)}
    </ul>
  </Card>
);

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { signOut } = useAuthenticator();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { sendMessage } = useWebSocket(WEBSOCKET_URL, {
    shouldReconnect: () => true,
    onMessage: (event) => {
      const data = JSON.parse(event.data);

      if (data.lesson_plan) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "bot", lessonPlan: data.lesson_plan }
        ]);
      } else if (data.message) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, sender: "bot", text: data.message }
        ]);
      }
    },
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text: input }
    ]);

    sendMessage(JSON.stringify({ action: "sendMessage", message: input }));
    setInput('');
  };

  return (
    <Flex className="h-screen" direction="row">
      <Sidebar />
      
      <Flex direction="column" flex="1" height="100%">
        <Flex 
          justifyContent="space-between" 
          padding="1rem" 
          style={{ borderBottom: '1px solid #ddd' }}
        >
          <Heading level={3}>Chat</Heading>
          <Button onClick={signOut} variation="destructive">Sign out</Button>
        </Flex>

        <View padding="1rem" overflow="auto" flex="1">
          {messages.map((message) => (
            <View
              key={message.id}
              marginBottom="1rem"
              textAlign={message.sender === 'user' ? 'right' : 'left'}
            >
              {message.lessonPlan ? (
                <LessonPlanCard plan={message.lessonPlan} />
              ) : (
                <Card variation="outlined" padding="1rem">
                  <Text>{message.text}</Text>
                </Card>
              )}
            </View>
          ))}
          <div ref={chatEndRef} />
        </View>

        <Divider />
        
        <Flex padding="1rem" as="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
          <TextField
            label="Message"
            labelHidden
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            flex="1"
          />
          <Button type="submit" marginLeft="0.5rem">Send</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Chat;
