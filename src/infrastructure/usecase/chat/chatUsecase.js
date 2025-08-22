const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "OPENAI_API_KEY";

async function chatUsecase(message, conversationHistory = []) {
  if (!message) {
    throw new Error("Message is required");
  }

  const messages = [
    {
      role: "system",
      content:
        "Bạn là một trợ lý AI thân thiện và hữu ích. Hãy trả lời bằng tiếng Việt một cách tự nhiên và ngắn gọn.",
    },
    ...conversationHistory,
    {
      role: "user",
      content: message,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 300,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("[Usecase] OpenAI API Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error?.message || "AI service error occurred"
    );
  }
}

module.exports = chatUsecase;
