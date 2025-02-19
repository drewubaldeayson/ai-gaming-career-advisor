import { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { query, collection, where, getDocs, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CareerRecommendation = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [recommendation, setRecommendation] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("email") || "";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const usersRef = collection(db, "user_career_data");
      const q = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // 📌 Get the first matching document
        const docSnapshot = querySnapshot.docs[0];
        const userInfo = docSnapshot.data();

        setUserData(userInfo);
        generateRecommendation(userInfo);
      } else {
        console.warn("No user data found for this email.");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const generateRecommendation = (data) => {
    if (!data) return;

    const { gameGenres, skills, experience, careerInterest } = data;
    let careerScores = {
      "Esports Player": 0,
      "Streamer": 0,
      "Game Developer": 0,
      "Game Analyst": 0,
      "Gaming Content Creator": 0,
    };

    // 🏆 Weighting the scores based on skills
    if (skills["Reflexes"] >= 8) careerScores["Esports Player"] += 3;
    if (skills["Communication Skills"] >= 7) careerScores["Streamer"] += 3;
    if (skills["Programming"] >= 7) careerScores["Game Developer"] += 3;
    if (skills["Game Analytics"] >= 7) careerScores["Game Analyst"] += 3;
    if (skills["Content Creation"] >= 7) careerScores["Gaming Content Creator"] += 3;

    // 🎮 Considering Game Genres
    if (gameGenres.includes("FPS") || gameGenres.includes("Battle Royale")) careerScores["Esports Player"] += 2;
    if (gameGenres.includes("Strategy")) careerScores["Game Analyst"] += 2;
    if (gameGenres.includes("RPG") || gameGenres.includes("MOBA")) careerScores["Game Developer"] += 2;

    // 📊 Experience Adjustment
    if (experience === "Beginner") {
      careerScores["Gaming Content Creator"] += 2; // Good starting career
    } else if (experience === "Intermediate") {
      careerScores["Streamer"] += 2;
      careerScores["Game Analyst"] += 2;
    } else if (experience === "Professional") {
      careerScores["Esports Player"] += 3;
      careerScores["Game Developer"] += 3;
    }

    // 🎯 Aligning with Career Interest
    if (careerInterest && careerScores[careerInterest] !== undefined) {
      careerScores[careerInterest] += 4; // Boost chosen career
    }

    // 🔥 Determining the best match
    const bestCareer = Object.keys(careerScores).reduce((a, b) =>
      careerScores[a] > careerScores[b] ? a : b
    );

    let explanationText = "";
    switch (bestCareer) {
      case "Esports Player":
        explanationText =
          "Your quick reflexes and experience in FPS or Battle Royale games make you a strong candidate for professional esports. Start training seriously and look for esports teams!";
        break;
      case "Streamer":
        explanationText =
          "Your strong communication skills make you well-suited for streaming. Build an engaging audience by sharing your gameplay or hosting discussions!";
        break;
      case "Game Developer":
        explanationText =
          "Your programming and strategic thinking skills make game development a great path for you. Start learning game engines like Unity or Unreal!";
        break;
      case "Game Analyst":
        explanationText =
          "Your analytical and strategic mindset makes you a great fit for game analytics. Consider roles in esports analytics or game design testing!";
        break;
      case "Gaming Content Creator":
        explanationText =
          "You have creativity and good communication skills. Consider making YouTube videos, guides, or TikTok content to grow your gaming brand!";
        break;
      default:
        explanationText =
          "You have strong potential in gaming! Keep exploring different career options to find what excites you most!";
    }

    setRecommendation(`🚀 ${bestCareer}`);
    setExplanation(explanationText);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-2/5 text-center">
        <h2 className="text-3xl font-bold mb-4">🎯 Your AI-Powered Career Recommendation</h2>

        {loading ? (
          <div className="text-gray-400 animate-pulse">Analyzing your profile...</div>
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