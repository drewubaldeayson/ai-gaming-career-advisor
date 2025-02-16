import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import CareerForm from "./components/CareerForm";
import CareerRecommendation from "./components/CareerRecommendation";
import Dashboard from "./components/Dashboard";
import CareerInsights from "./components/CareerInsights";
import MainLayout from "./components/MainLayout";
import GamingSkillAssessment from "./components/GamingSkillAssessment";
import AISkillAnalysis from "./components/AIChatbot";
import Subscription from "./components/Subscription";
import AIChatbot from "./components/AIChatbot";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/career" element={<CareerForm />} />
          <Route path="/recommendation" element = {<CareerRecommendation/>} />
          <Route path="/dashboard/*" element={<MainLayout />} />
          <Route path="/career-insights" element={<CareerInsights />} />
          <Route path="/gaming-skill-assessment" element={<GamingSkillAssessment />} />
          <Route path="/ai-chatbot" element={<AIChatbot />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
