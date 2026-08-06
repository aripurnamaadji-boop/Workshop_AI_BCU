import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Coverage from "./pages/Coverage";
import PeopleDevelopment from "./pages/PeopleDevelopment";
import TrainingHours from "./pages/TrainingHours";
import UpdateData from "./pages/UpdateData";
import TrainingEvaluation from "./pages/TrainingEvaluation";
import TrainingAnalysis from "./pages/TrainingAnalysis";
import Assistant from "./pages/Assistant";
import Login from "./pages/Login";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="coverage" element={<Coverage />} />
              <Route path="people" element={<PeopleDevelopment />} />
              <Route path="hours" element={<TrainingHours />} />
              <Route path="eval" element={<TrainingEvaluation />} />
              <Route path="analysis" element={<TrainingAnalysis />} />
              <Route path="update-data" element={<UpdateData />} />
              <Route path="assistant" element={<Assistant />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
