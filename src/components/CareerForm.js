import { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CareerForm = () => {
  const [gameGenres, setGameGenres] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState("");
  const [careerInterest, setCareerInterest] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Please login first!");
      return;
    }

    try {
      await setDoc(doc(db, "user_career_data", auth.currentUser.uid), {
        gameGenres,
        skills,
        experience,
        careerInterest,
        createdAt: new Date(),
      });
      navigate("/recommendation");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Gaming Career Form</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Game Genres */}
          <label className="text-sm">Favorite Game Genres:</label>
          <select multiple className="p-2 bg-gray-700 rounded" onChange={(e) => setGameGenres([...e.target.selectedOptions].map(o => o.value))}>
            <option value="FPS">FPS</option>
            <option value="MOBA">MOBA</option>
            <option value="RPG">RPG</option>
            <option value="Battle Royale">Battle Royale</option>
            <option value="Strategy">Strategy</option>
          </select>

          {/* Skills */}
          <label className="text-sm">Your Key Skills:</label>
          <select multiple className="p-2 bg-gray-700 rounded" onChange={(e) => setSkills([...e.target.selectedOptions].map(o => o.value))}>
            <option value="Reflexes">Reflexes</option>
            <option value="Strategy">Strategy</option>
            <option value="Communication">Communication</option>
            <option value="Creativity">Creativity</option>
            <option value="Coding">Coding</option>
          </select>

          {/* Experience */}
          <label className="text-sm">Experience Level:</label>
          <select className="p-2 bg-gray-700 rounded" onChange={(e) => setExperience(e.target.value)}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Professional">Professional</option>
          </select>

          {/* Career Interest */}
          <label className="text-sm">Career Interest:</label>
          <select className="p-2 bg-gray-700 rounded" onChange={(e) => setCareerInterest(e.target.value)}>
            <option value="Streamer">Streamer</option>
            <option value="Esports Player">Esports Player</option>
            <option value="Game Developer">Game Developer</option>
            <option value="Game Analyst">Game Analyst</option>
          </select>

          <button type="submit" className="p-3 bg-blue-600 rounded hover:bg-blue-700">Save Preferences</button>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;