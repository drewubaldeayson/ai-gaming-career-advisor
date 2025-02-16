import { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const LearningResources = () => {
  const [userCareer, setUserCareer] = useState("");
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUserCareer = async () => {
      if (!auth.currentUser) return;

      const userDoc = await getDoc(doc(db, "user_career_data", auth.currentUser.uid));
      if (userDoc.exists()) {
        const careerInterest = userDoc.data().careerInterest;
        setUserCareer(careerInterest);
        loadResources(careerInterest);
      }
    };

    fetchUserCareer();
  }, []);

  const loadResources = (career) => {
    const resourcesData = {
      "Esports Player": [
        { title: "Pro Gamer Guide", link: "https://www.gamecareerguide.com" },
        { title: "Training Drills", link: "https://www.esportstraining.com" },
      ],
      "Streamer": [
        { title: "Streaming Setup Guide", link: "https://www.twitch.tv/creatorcamp" },
        { title: "Audience Engagement Tips", link: "https://www.youtube.com/watch?v=streaming" },
      ],
      "Game Developer": [
        { title: "Unity Game Dev", link: "https://learn.unity.com" },
        { title: "Unreal Engine Basics", link: "https://www.unrealengine.com/en-US/learn" },
      ],
      "Analyst": [
        { title: "Game Strategy Analysis", link: "https://www.chess.com/lessons" },
        { title: "Esports Data Analytics", link: "https://esportsobserver.com/" },
      ],
    };

    setResources(resourcesData[career] || []);
  };

  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Learning Resources</h2>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for resources..."
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content Container */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-gray-300">Find courses and tutorials to improve your gaming career.</p>

        {userCareer && (
          <h3 className="mt-6 text-xl font-semibold text-white">
            Recommended for <span className="text-blue-400">{userCareer}</span>:
          </h3>
        )}

        {/* Grid Layout for Resources */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map((res, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
              >
                <h4 className="text-lg font-semibold text-white">{res.title}</h4>
                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline block mt-2"
                >
                  Learn More
                </a>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No matching resources found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningResources;
