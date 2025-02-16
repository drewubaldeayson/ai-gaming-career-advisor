import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CareerRecommendation = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      const userDoc = await getDoc(doc(db, "user_career_data", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        generateRecommendation(userDoc.data());
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const generateRecommendation = (data) => {
    if (!data) return;

    const { gameGenres, skills, experience, careerInterest } = data;

    if (careerInterest === "Esports Player" && skills.includes("Reflexes") && experience !== "Beginner") {
      setRecommendation("🎮 Esports Player");
      setExplanation("You have strong reflexes and experience, making you a great candidate for professional gaming.");
    } else if (careerInterest === "Streamer" && skills.includes("Communication")) {
      setRecommendation("📺 Streamer");
      setExplanation("Your communication skills are key to building an engaging streaming audience.");
    } else if (careerInterest === "Game Developer" && skills.includes("Coding")) {
      setRecommendation("👨‍💻 Game Developer");
      setExplanation("With coding skills, you can start developing games using Unity or Unreal Engine.");
    } else {
      setRecommendation("🎯 Gaming Enthusiast");
      setExplanation("You have a passion for gaming! Consider exploring different career options.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
        <h2 className="text-3xl font-bold mb-4">🚀 AI-Powered Career Recommendation</h2>

        {loading ? (
          <div className="text-gray-400 animate-pulse">Loading your recommendation...</div>
        ) : (
          <>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-400">Recommended Career Path:</h3>
              <p className="text-2xl font-bold mt-2">{recommendation}</p>
              <p className="mt-4 text-gray-300">{explanation}</p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={() => navigate("/dashboard/career-insights")} 
                className="p-3 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition duration-300"
              >
                🔍 Explore Career Insights
              </button>

              <button 
                onClick={() => navigate("/dashboard")} 
                className="p-3 bg-yellow-500 rounded-lg text-black font-semibold hover:bg-yellow-600 transition duration-300"
              >
                🏠 Go to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CareerRecommendation;
