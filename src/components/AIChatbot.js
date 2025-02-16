import { useState } from "react";
import axios from "axios";

const AIChatbot = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // AI Chatbot for Career Guidance
  const handleChat = async () => {
    if (!chatInput) return;
    setLoading(true);
    setChatResponse("Thinking...");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: chatInput }],
          max_tokens: 300,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your actual key
          },
        }
      );

      setChatResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      setChatResponse("⚠️ Failed to fetch response.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-white mb-6">💬 AI Career Guidance Chatbot</h2>

      <p className="text-gray-400 mb-6">
        Ask AI anything about gaming careers, esports opportunities, or skill improvement.
      </p>

      <input
        type="text"
        className="mt-2 p-3 bg-gray-900 text-white rounded w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Ask AI about gaming careers..."
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      />

      <button
        onClick={handleChat}
        className="mt-3 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {chatResponse && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          <p className="text-gray-300 whitespace-pre-wrap">{chatResponse}</p>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
