import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import TaskTimeline from "./components/TaskTimeLine";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/task/:taskId" element={<TaskTimeline />} />
      </Routes>
    </Router>
  );
}
