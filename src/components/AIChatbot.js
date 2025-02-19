import { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

const AIChatbot = () => {
  const [chatStep, setChatStep] = useState(0);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setUserEmail(storedEmail);
      const q = query(collection(db, "chatHistory"), where("email", "==", storedEmail));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChatHistory(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, []);

  const steps = [
    "Welcome! I am your AI gaming career facilitator. Let's start by identifying your strengths. What are your key skills or experiences related to gaming careers?",
    "Great! Now, let's talk about areas you'd like to improve. Are there any skills or knowledge gaps you'd like to work on?",
    "Awesome! What aspects of the gaming industry excite you the most? (Development, Art, Marketing, Esports, QA, Game Writing, etc.)",
    "Would you like career path suggestions based on your strengths and interests?",
    "Would you like to explore recommended skill development courses or certifications?",
    "Would you like a personalized resume and interview question preparation?",
    "Thank you for sharing! Now, based on everything you've told me, I will generate a personalized career plan for you. Click the Generate Career Plan to continue"
  ];

  const handleChat = async () => {
    if (!chatInput && chatStep === 0) return;
    setLoading(true);
    setChatResponse("Processing your journey...");

    setUserResponses([...userResponses, chatInput]);
    setShowInput(false);


    if (chatStep != -1 && chatStep < steps.length - 1) {
      setChatStep(chatStep + 1);
      setChatInput("");
      setLoading(false);
      setShowInput(true);
      return;
    }

    if(chatStep == 5){
      setShowInput(false)  
    }



    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an AI Career Facilitator specializing in the gaming industry..." },
            { role: "user", content: `<p>${userResponses.join(" | ")}</p>` }
          ],
          max_tokens: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
        }
      );
      
      const aiResponse = response.data.choices[0].message.content;
      setChatResponse(aiResponse);
      setShowInput(true);

      const newChat = { email: userEmail, question: "Final Career Plan", response: aiResponse };
      setChatHistory((prevChats) => [...prevChats, newChat]);
      await addDoc(collection(db, "chatHistory"), newChat);
    } catch (error) {
      console.error("OpenAI API error:", error);
      setChatResponse("⚠️ Failed to fetch response.");
    }
    setLoading(false);
    setChatInput("");
  };

  return ( <>
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-white mb-6">💬 AI Counselor Agent</h2>
      
      <div className="mb-4">
        <h3 className="text-xl text-gray-300 mb-2">Current Step:</h3>
        <p className="text-gray-400">
          {chatStep === -1 ? "Ask me anything here related to your gaming career development" : steps[chatStep]}
        </p>
      </div>

      {showInput && (
        <>
          <input
            type="text"
            className="mt-2 p-3 bg-gray-900 text-white rounded w-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your response here..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <br /><br />
        </>
      )}

      <button
        onClick={handleChat}
        className="mt-3 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? "Thinking..." : chatStep < steps.length - 1 ? "Next Step" : "Generate Career Plan"}
      </button>

      
      <div className="mt-4 p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700">
          {chatResponse && (
          <p className="text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: chatResponse }}></p>
          )}
          <div className="mt-4 flex space-x-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={() => {
                setChatStep(0);
                setUserResponses([]);
                setChatResponse("");
                setShowInput(true);
              }}
            >
              🔄 Start Again
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              onClick={() => {
                setChatStep(-1); // Indicate free question mode
                setChatResponse("Ask me anything.");
                setShowInput(true);
              }}
            >
              💡 Ask Free Questions
            </button>
          </div>

      </div>
      
    </div>
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <div className="mt-6 text-white">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <ul className="mt-2 overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <li key={index} className="p-2 border-b border-gray-700">
               <p className="text-gray-300">🔹 <strong>{chat.question}:</strong></p>
               <p className="text-gray-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: chat.response }}></p>
            </li>
          ))}
        </ul>
      </div>
    </div></>
  );
};

export default AIChatbot;
