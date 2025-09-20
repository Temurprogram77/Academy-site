import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Sahifalar
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import User from "./pages/User";
import AdminPanel from "./pages/AdminPanel";
import TeacherPanel from "./pages/TeacherPanel";
import TeacherGroups from "./pages/TeacherGroups";
import GradePage from "./pages/GradePage";

// Admin panel sahifalari
import Dashboard from "./pages/admin/Dashboard";
import Teachers from "./pages/admin/Teachers";
import Parents from "./pages/admin/Parents";
import Students from "./pages/admin/Students";
import Rooms from "./pages/admin/Rooms";
import Teams from "./pages/admin/Teams";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Umumiy sahifalar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user-dashboard" element={<User />} />
        <Route path="/admin-dashboard" element={<AdminPanel />} />

        <Route path="/teacher-dashboard" element={<TeacherPanel />}>
          <Route index element={<TeacherGroups />} /> 
          <Route path="grade/:groupId" element={<GradePage />} />
        </Route>
        <Route path="/team/:id" element={<LandingTeacher />} />

        {/* Foydalanuvchi dashboard */}
        <Route path="/user-dashboard" element={<User />} />

        {/* Admin panel routelari */}
        <Route path="/admin-dashboard" element={<AdminPanel />}>
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="parents" element={<Parents />} />
          <Route path="students" element={<Students />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="teams" element={<Teams />} />
        </Route>

        {/* O‘qituvchi dashboard */}
        <Route path="/teacher-dashboard" element={<TeacherPanel />} />

        {/* 404 sahifa */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
