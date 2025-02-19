import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found"  || error.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError(JSON.stringify(error));
      }
      console.error("Login Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input className="p-3 bg-gray-700 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="p-3 bg-gray-700 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="p-3 bg-blue-600 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don't have an account? <a href="/signup" className="text-blue-400">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
