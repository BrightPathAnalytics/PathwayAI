/*
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s conversation</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
          {todo.content}
          </li>
        )}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
*/
import { useAuthenticator } from '@aws-amplify/ui-react';
import Chatbot from './Chatbot'; // Adjust the path if Chatbot.tsx is located elsewhere

function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s Conversation</h1>
      {/* Render the Chatbot component as the main content */}
      <Chatbot />
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
