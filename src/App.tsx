import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import Coverage from "./pages/Coverage";
import PeopleDevelopment from "./pages/PeopleDevelopment";
import EmptyModule from "./pages/EmptyModule";
import UpdateData from "./pages/UpdateData";
import TrainingEvaluation from "./pages/TrainingEvaluation";
import TrainingAnalysis from "./pages/TrainingAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="coverage" element={<Coverage />} />
          <Route path="people" element={<PeopleDevelopment />} />
          <Route path="hours" element={<EmptyModule title="Training Hours & Days" />} />
          <Route path="eval" element={<TrainingEvaluation />} />
          <Route path="analysis" element={<TrainingAnalysis />} />
          <Route path="update-data" element={<UpdateData />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
