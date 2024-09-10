import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import AWS from 'aws-sdk';

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    loadEnvVars();
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  const loadEnvVars = async () => {
    const envVars:any = {};

    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: aKeyId,
      secretAccessKey: aKey,
    });
  
    const secretsManager = new AWS.SecretsManager();
    console.log("secretsManager->",secretsManager);
    // Fetch secrets from Secrets Manager
    const secretsData = await secretsManager.getSecretValue({ SecretId: 'your-secret-id' }).promise();
    console.log("secretsData->",secretsData);
    if(secretsData){
    const secrets = JSON.parse(secretsData.SecretString);
    console.log("secrets->",secrets);  
    }
    
    for (const secret of Object.keys(secrets)) {
      if (secret.startsWith('NUXT_')) {
        envVars[secret] = secrets[secret];
      }
    }
    console.log("envVars->",envVars);
    return envVars;
  };
  
  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
