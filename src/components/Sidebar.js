import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/")
  }

  return (
    <div className="w-72 bg-gray-800 h-screen fixed left-0 top-0 p-6">
      <h2 className="text-white text-xl font-bold mb-4">Gareer Guide</h2>
      <button onClick={() => navigate("/dashboard")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">🤖 AI Counselor Agent</button>
      <button onClick={() => navigate("/dashboard/subscription")} className="block text-white p-3 hover:bg-gray-700 w-full text-left">💳 Subscription</button>
      <button onClick={logoutUser} className="block text-white p-3 hover:bg-gray-700 w-full text-left">Logout</button>
    </div>
  );
};

export default Sidebar;
