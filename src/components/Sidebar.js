import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 h-screen fixed left-0 top-0 p-6">
      <h2 className="text-white text-xl font-bold mb-4">AI Gaming Career Advisor</h2>
      <button onClick={() => navigate("/dashboard")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">🏠 Dashboard</button>
      <button onClick={() => navigate("/dashboard/career-insights")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">📈 Career Insights</button>
      <button onClick={() => navigate("/dashboard/learning-resources")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">📚 Learning Resources</button>
      <button onClick={() => navigate("/dashboard/gaming-skill-assessment")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">🎮 Skill Assessment</button>
      <button onClick={() => navigate("/dashboard/ai-chatbot")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">🤖 AI Career Guidance Chatbot</button>
      <button onClick={() => navigate("/dashboard/subscription")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">💳 Subscription</button>
    </div>
  );
};

export default Sidebar;
