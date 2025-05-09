import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: new Date(),
      });

      localStorage.setItem("email", email);

      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Error:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
            {/* App Title Section */}
      <div className="flex items-center mb-6">
        <img src="/logo.png" alt="Gareer Guide Logo" className="w-10 h-10 mr-3" />
        <h1 className="text-3xl font-bold text-white">Gareer Guide</h1>
      </div>

      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input className="p-3 bg-gray-700 rounded" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="p-3 bg-gray-700 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="p-3 bg-gray-700 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="p-3 bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-600" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-blue-400">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
