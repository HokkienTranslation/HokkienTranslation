import axios from "axios";

// https://platform.openai.com/docs/api-reference/introduction
async function callOpenAIChat(prompt) {
  const apiKey = process.env.OPEN_AI_KEY;

  console.log("API Key:", apiKey);

  if (!apiKey) {
    throw new Error(
      "API key is not defined. Check .env file and ensure it contains the OPEN_AI_KEY variable."
    );
  }

  const url = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  };

  try {
    const response = await axios.post(url, body, { headers });
    console.log(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

export { callOpenAIChat };

// callOpenAI("Say this is a test!")
//   .then((response) => console.log("OpenAI Response:", response))
//   .catch((error) => console.error("Error:", error));
