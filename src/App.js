import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import User from "./pages/User";
import AdminPanel from "./pages/AdminPanel";
import TeacherPanel from "./pages/TeacherPanel";
import TeacherGroups from "./pages/TeacherGroups";
import GradePage from "./pages/GradePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<User />} />
        <Route path="/admin-dashboard" element={<AdminPanel />} />

        <Route path="/teacher-dashboard" element={<TeacherPanel />}>
          <Route index element={<TeacherGroups />} /> 
          <Route path="grade/:groupId" element={<GradePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;