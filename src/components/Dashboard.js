import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      const userDoc = await getDoc(doc(db, "user_career_data", auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        generateRecommendation(userDoc.data());
      }
    };

    fetchUserData();
  }, [navigate]);

  const generateRecommendation = (data) => {
    if (!data) return;

    const { skills, experience, careerInterest } = data;

    if (careerInterest === "Esports Player" && skills.includes("Reflexes") && experience !== "Beginner") {
      setRecommendation("🔥 Keep training! Join an esports team or compete in online tournaments.");
    } else if (careerInterest === "Streamer" && skills.includes("Communication")) {
      setRecommendation("🎙 Build your Twitch/YouTube channel and engage with your audience.");
    } else if (careerInterest === "Game Developer") {
      setRecommendation("💻 Start learning game development with Unity or Unreal Engine.");
    } else {
      setRecommendation("🎮 Keep improving your skills and explore career opportunities!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold">Welcome to Your Dashboard</h2>

      {userData ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 mt-6">
          <h3 className="text-xl font-semibold">Your Career Path:</h3>
          <p className="text-green-400">{recommendation}</p>

          <button 
            onClick={() => navigate("/career")} 
            className="mt-4 p-3 bg-blue-500 rounded hover:bg-blue-600"
          >
            Edit Career Preferences
          </button>
        </div>
      ) : (
        <p>Loading your data...</p>
      )}
    </div>
  );
};

export default Dashboard;
