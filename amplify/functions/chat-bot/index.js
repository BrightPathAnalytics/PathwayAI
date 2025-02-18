// index.js
//const { post } = require('axios');
import { post } from 'axios';

export async function handler(event) {

  try {
    // Parse the incoming request
    const body = JSON.parse(event.body);
    const message = body.message;
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "message" in request body' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST',
        },
      };
    }

    // Call the OpenAI Chat Completions API using the destructured 'post' function
    const openaiResponse = await post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPEN_API_KEY}`,
          'Content-Type': 'application/json'
        },
      }
    );

    // Extract the chat response from the API response
    const completion = openaiResponse.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ response: completion }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  } catch (error) {
    console.error('Error handling chat interaction:', error.response ? error.response.data : error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
      },
    };
  }
}
