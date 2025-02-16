import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const CareerInsights = () => {
  const [userData, setUserData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [courses, setCourses] = useState([]);
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
        generateCareerInsights(userDoc.data());
      }
    };

    fetchUserData();
  }, [navigate]);

  const generateCareerInsights = (data) => {
    if (!data) return;

    const { careerInterest } = data;

    const careerPaths = {
      "Esports Player": {
        description: "Compete in professional gaming tournaments, improve your skills, and join an esports team.",
        courses: [
          { title: "Esports Fundamentals", link: "https://www.udemy.com/course/esports-fundamentals/" },
          { title: "Improve FPS Reflexes", link: "https://www.coursera.org/learn/gaming-reflexes" }
        ]
      },
      "Streamer": {
        description: "Create gaming content on Twitch, YouTube, and TikTok. Engage with audiences and grow your brand.",
        courses: [
          { title: "How to Start Streaming", link: "https://www.skillshare.com/streaming-course" },
          { title: "YouTube Growth Strategies", link: "https://www.udemy.com/course/youtube-growth-hacks/" }
        ]
      },
      "Game Developer": {
        description: "Learn coding, game design, and development using Unity, Unreal Engine, or Godot.",
        courses: [
          { title: "Game Development with Unity", link: "https://www.udemy.com/course/unity-game-dev/" },
          { title: "Intro to Unreal Engine", link: "https://www.coursera.org/learn/unreal-engine" }
        ]
      }
    };

    if (careerPaths[careerInterest]) {
      setInsights([careerPaths[careerInterest].description]);
      setCourses(careerPaths[careerInterest].courses);
    } else {
      setInsights(["Explore different career paths in gaming. Keep improving your skills!"]);
      setCourses([]);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold">Career Insights & Learning</h2>

      {userData ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 mt-6">
          <h3 className="text-xl font-semibold">Career Path: {userData.careerInterest}</h3>
          <p className="text-green-400">{insights}</p>

          <h4 className="mt-4 text-lg font-semibold">Recommended Courses:</h4>
          <ul className="list-disc list-inside text-sm">
            {courses.map((course, index) => (
              <li key={index}>
                <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                  {course.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading career insights...</p>
      )}
    </div>
  );
};

export default CareerInsights;
