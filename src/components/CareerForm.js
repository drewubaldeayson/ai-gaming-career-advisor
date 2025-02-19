import { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CareerForm = () => {
  const [gameGenres, setGameGenres] = useState([]);
  const [careerInterest, setCareerInterest] = useState("");
  const [experience, setExperience] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [skills, setSkills] = useState({
    Programming: 1,
    "Art & Design": 1,
    Production: 1,
    "Writing & Narrative": 1,
    "Content Creation": 1,
    "Game Analytics": 1,
    "Esports Management": 1,
    "Marketing & Community": 1,
    "Quality Assurance": 1,
    "Business & Publishing": 1,
    "Leadership & Management": 1,
    "Problem Solving": 1,
    "Communication Skills": 1,
    "Teamwork & Collaboration": 1,
    "Self-Learning": 1,
    "Adaptability": 1,
    "Critical Thinking": 1,
    "Networking Skills": 1,
  });

  const navigate = useNavigate();

  const userEmail = localStorage.getItem("email") || "";

  const handleSkillChange = (skill, value) => {
    setSkills({ ...skills, [skill]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login first!");
      return;
    }

    try {
       // 🔍 Query Firestore to find the user document by email
      const usersRef = collection(db, "user_career_data");
      const q = query(usersRef, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      let userDocRef;
      
      if (!querySnapshot.empty) {
        // 📌 If user data exists, update the existing document
        const docSnapshot = querySnapshot.docs[0];
        userDocRef = doc(db, "user_career_data", docSnapshot.id);
      } else {
        // 🆕 If no document exists for the user, create a new one
        userDocRef = doc(db, "user_career_data", auth.currentUser.uid);
      }

      // 🔄 Save or update user career data
      await setDoc(userDocRef, {
        email: userEmail, // Ensure email is stored
        gameGenres: gameGenres.map((genre) => genre.value),
        skills,
        experience,
        careerInterest,
        careerGoals,
        createdAt: new Date(),
      }, { merge: true });
      
      navigate("/recommendation");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const genreOptions = [
    { value: "FPS", label: "FPS" },
    { value: "MOBA", label: "MOBA" },
    { value: "RPG", label: "RPG" },
    { value: "Battle Royale", label: "Battle Royale" },
    { value: "Strategy", label: "Strategy" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 py-8">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-2/5">
        <h2 className="text-3xl font-bold text-center mb-6">🎮 Gaming Career Assessment</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Game Genres */}
          <label className="text-sm">🎮 Favorite Game Genres:</label>
          <Select
            options={genreOptions}
            isMulti
            className="text-black"
            onChange={setGameGenres}
          />

          {/* Experience */}
          <label className="text-sm">📊 Experience Level:</label>
          <select className="p-2 bg-gray-700 rounded" 
            onChange={(e) => setExperience(e.target.value)}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>

          {/* Career Interest */}
          <label className="text-sm">🎯 Career Interest:</label>
          <select className="p-2 bg-gray-700 rounded" 
            onChange={(e) => setCareerInterest(e.target.value)}>
            <option value="Streamer">Streamer</option>
            <option value="Esports Player">Esports Player</option>
            <option value="Game Developer">Game Developer</option>
            <option value="Game Analyst">Game Analyst</option>
          </select>

          {/* Career Goals */}
          <label className="text-sm">🚀 Career Goals:</label>
          <input 
            type="text"
            className="p-2 bg-gray-700 rounded"
            placeholder="e.g., Become a game designer, Join an esports team"
            onChange={(e) => setCareerGoals(e.target.value)}
          />

          {/* Strengths & Weaknesses */}
          <h3 className="text-lg font-bold mt-4">🧠 Strengths & Weaknesses (Rate 1-10)</h3>
          {Object.keys(skills).map((skill) => (
            <div key={skill} className="mb-3">
              <label className="text-sm">{skill}:</label>
              <div className="flex space-x-2 mt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`p-2 rounded-lg ${skills[skill] === level ? "bg-blue-500" : "bg-gray-600"}`}
                    onClick={() => handleSkillChange(skill, level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="p-3 bg-green-600 rounded hover:bg-green-700">
            Save & Get Recommendations
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;