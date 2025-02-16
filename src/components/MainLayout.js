import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import CareerInsights from "./CareerInsights";
import LearningResources from "./LearningResources";
import GamingSkillAssessment from "./GamingSkillAssessment";
import AISkillAnalysis from "./AIChatbot";
import Subscription from "./Subscription";
import AIChatbot from "./AIChatbot";

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/career-insights" element={<CareerInsights />} />
          <Route path="/learning-resources" element={<LearningResources />} />
          <Route path="/gaming-skill-assessment" element={<GamingSkillAssessment />} />
          <Route path="/ai-chatbot" element={<AIChatbot />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainLayout;
