import axios from 'axios';
//import type { APIGatewayProxyHandler } from "aws-lambda";

// interface OpenAIChatResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
// }
/*
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("Event received:", event);

  try {
    // Parse the incoming request body
    const body = JSON.parse(event.body || "{}");
    const message = body.message;
    if (!message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Adjust as needed
          "Access-Control-Allow-Headers": "*",
        },
        body: JSON.stringify({ error: 'Missing "message" in request body' }),
      };
    }

    // Call the OpenAI Chat Completions API using the chat model format
    // Use axios's generic type parameter to type the response data
    const openaiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
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
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPEN_API_KEY}`,
          },
        }
      );

    const completion = openaiResponse.data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ response: completion }),
    };
  } catch (error: unknown) {
    let errMessage = "Unknown error";
    if (error instanceof Error) {
      errMessage = error.message;
    }
    console.error("Error handling chat interaction:", errMessage);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
*/

exports.handler = async (event: { body: string; }) => {
  try {
    // Parse the incoming request
    const body = JSON.parse(event.body);
    const message = body.message;
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "message" in request body' }),
      };
    }

    // Call the OpenAI Chat Completions API using the destructured 'post' function
    const openaiResponse = await axios.post(
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
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error handling chat interaction:', error.response ? error.response.data : error.message);
    } else {
      console.error('Error handling chat interaction:', error);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};