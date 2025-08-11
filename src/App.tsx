import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import QuickDeStress from "./pages/QuickDeStress";
import SleepTracker from "./pages/SleepTracker";
import ChallengeBox from "./pages/ChallengeBox";
import WeeklyReview from "./pages/WeeklyReview";
import SelfCarePlanner from "./pages/SelfCarePlanner";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/de-stress" element={<QuickDeStress />} />
      <Route path="/sleep-tracker" element={<SleepTracker />} />
      <Route path="/challenge-box" element={<ChallengeBox />} />
      <Route path="/weekly-review" element={<WeeklyReview />} />
      <Route path="/self-care" element={<SelfCarePlanner />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );
}
