import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <h2 className="text-white text-center mt-10">Loading...</h2>;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button onClick={() => { logout(); navigate("/login"); }} className="mt-4 p-3 bg-red-600 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;