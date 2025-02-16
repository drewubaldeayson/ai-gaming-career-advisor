import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";

const GamingSkillAssessment = () => {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const navigate = useNavigate();

  const questions = [
    { id: "reactionTime", question: "How fast can you react in milliseconds?", options: ["<200ms", "200-300ms", "300+ ms"] },
    { id: "decisionMaking", question: "How confident are you in making split-second decisions?", options: ["Very Confident", "Somewhat Confident", "Not Confident"] },
    { id: "strategy", question: "Do you analyze opponents’ strategies during gameplay?", options: ["Always", "Sometimes", "Rarely"] },
    { id: "teamwork", question: "How well do you work with teammates?", options: ["Excellent", "Good", "Needs Improvement"] },
    { id: "mechanicalSkill", question: "How would you rate your mechanical skills (e.g., aiming, execution)?", options: ["High", "Average", "Low"] },
    { id: "adaptability", question: "How quickly do you adapt to new game mechanics?", options: ["Very Fast", "Average", "Slow"] },
    { id: "multitasking", question: "How well do you multitask in high-pressure situations?", options: ["Great", "Okay", "Struggle"] },
    { id: "gameKnowledge", question: "How deep is your knowledge of game mechanics & meta?", options: ["Expert", "Intermediate", "Beginner"] },
    { id: "problemSolving", question: "How good are you at solving in-game problems?", options: ["Excellent", "Good", "Needs Work"] },
    { id: "patience", question: "How patient are you when learning new strategies?", options: ["Very Patient", "Moderate", "Impatient"] },
  ];

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsSubscribed(userSnap.data().isSubscribed);
        }
      }
    };
    fetchSubscriptionStatus();
  }, []);

  const handleSubmit = async () => {
    if (!isSubscribed) {
        alert("⚠️ You need a subscription to access AI skill analysis.");
        navigate("/dashboard/subscription");
        return;
    }

    setLoading(true);
    setResult(null);
    setAiRecommendation(null);

    // Build skills summary for AI
    const userSkills = Object.entries(answers)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1')}: ${value}`)
      .join(", ");

    // Simple rule-based assessment
    let skillMessage = "📈 You have well-rounded gaming skills! Keep refining your strengths.";
    if (answers.reactionTime === "<200ms" && answers.decisionMaking === "Very Confident") {
      skillMessage = "🔥 You're a natural at fast-paced games like FPS & Battle Royale!";
    } else if (answers.strategy === "Always" && answers.teamwork === "Excellent") {
      skillMessage = "🎯 Your strategic and teamwork skills make you a great MOBA or RTS player!";
    }

    setResult(skillMessage);

    // AI-Powered Career Analysis
    const prompt = `
      A gamer has the following attributes: ${userSkills}.
      Based on these, analyze the best career paths in gaming, improvement strategies, and a training roadmap.
    `;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`, // Replace with your actual key
          },
        }
      );

      setAiRecommendation(response.data.choices[0].message.content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      setAiRecommendation("⚠️ Failed to analyze skills. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <h2 className="text-3xl font-bold text-white mb-6">🎮 Gaming Skill Assessment</h2>

      {/* Description */}
      <p className="text-gray-400 mb-6">
        Answer these questions to evaluate your gaming skills and receive AI-powered career guidance.
      </p>

      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-white">📝 Skill Assessment:</h3>
        <div className="mt-4 space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="p-4 bg-gray-700 rounded-lg">
              <label className="block text-white">{q.question}</label>
              <select
                className="p-3 bg-gray-900 text-white rounded w-full mt-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleChange(q.id, e.target.value)}
              >
                <option value="">Select an answer</option>
                {q.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Skills & Career Path"}
      </button>

      {/* Rule-Based Assessment Output */}
      {result && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-xl font-semibold text-white">🎮 Rule-Based Assessment:</h3>
          <p className="mt-2 text-gray-300">{result}</p>
        </div>
      )}

      {/* AI-Powered Recommendation Output */}
      {aiRecommendation && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-xl font-semibold text-white">🚀 AI Career Recommendation:</h3>
          <p className="mt-2 text-gray-300 whitespace-pre-wrap">{aiRecommendation}</p>
        </div>
      )}
    </div>
  );
};

export default GamingSkillAssessment;
