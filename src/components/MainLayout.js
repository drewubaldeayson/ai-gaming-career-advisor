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
          <Route path="/" element={<AIChatbot />} />
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainLayout;
