import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CareerRecommendation = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      const userDoc = await getDoc(doc(db, "user_career_data", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        generateRecommendation(userDoc.data());
      }
    };

    fetchUserData();
  }, []);

  const generateRecommendation = (data) => {
    if (!data) return;

    const { gameGenres, skills, experience, careerInterest } = data;

    if (careerInterest === "Esports Player" && skills.includes("Reflexes") && experience !== "Beginner") {
        setRecommendation("Esports Player");
        setExplanation("You have strong reflexes and experience, making you a great candidate for professional gaming.");
    } else if (careerInterest === "Streamer" && skills.includes("Communication")) {
        setRecommendation("Streamer");
        setExplanation("Your communication skills are key to building an engaging streaming audience.");
    } else if (careerInterest === "Game Developer" && skills.includes("Coding")) {
        setRecommendation("Game Developer");
        setExplanation("With coding skills, you can start developing games using Unity or Unreal Engine.");
    } else {
        setRecommendation("Gaming Enthusiast");
        setExplanation("You have a passion for gaming! Consider exploring different career options.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <h2 className="text-3xl font-bold">Your AI-Powered Career Recommendation</h2>

        {userData ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 mt-6">
            <h3 className="text-xl font-semibold">Recommended Career Path:</h3>
            <p className="text-green-400 text-2xl font-bold">{recommendation}</p>
            <p className="mt-2">{explanation}</p>

            <button 
            onClick={() => navigate("/career-insights")} 
            className="mt-4 p-3 bg-purple-500 rounded hover:bg-purple-600"
            >
            Explore Career Insights
            </button>

            <button 
            onClick={() => navigate("/dashboard")} 
            className="mt-2 p-3 bg-yellow-500 rounded hover:bg-yellow-600"
            >
            Go to Dashboard
            </button>
        </div>
        ) : (
        <p>Loading your recommendation...</p>
        )}
    </div>
  );
};

export default CareerRecommendation;
