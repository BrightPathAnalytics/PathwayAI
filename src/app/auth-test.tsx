
import { Authenticator, useAuthenticator, View, Text, Button, Heading } from '@aws-amplify/ui-react';

// Simple component to display when authenticated
const AuthenticatedContent = () => {
  const { user, signOut } = useAuthenticator();
  
  return (
    <View padding="2rem">
      <Heading level={3}>Authentication Successful!</Heading>
      <Text>Welcome, {user?.username || 'User'}</Text>
      <Text>You are now signed in!</Text>
      <Button onClick={signOut} marginTop="1rem">Sign Out</Button>
    </View>
  );
};

// Test component with minimal styling to verify Authenticator works
export default function AuthTest() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1>Authentication Test Page</h1>
      <p>This page tests if the AWS Amplify Authenticator is working correctly.</p>
      
      <div style={{ marginTop: '2rem', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
        <Authenticator>
          <AuthenticatedContent />
        </Authenticator>
      </div>
    </div>
  );
} 