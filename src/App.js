import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import User from "./pages/User";
import AdminPanel from "./pages/AdminPanel";
import TeacherPanel from "./pages/TeacherPanel";
import GradePage from "./pages/GradePage";

import Dashboard from "./pages/admin/Dashboard";
import Teachers from "./pages/admin/Teachers";
import Parents from "./pages/admin/Parents";
import Students from "./pages/admin/Students";
import Rooms from "./pages/admin/Rooms";
import Teams from "./pages/admin/Teams";
import TeacherGroups from "./pages/TeacherGroups";
import Gradies from "./pages/Gradies";
import Profile from "./pages/Profile";
import AdminProfile from "./pages/admin/Profile"; 
import { Toaster } from "sonner";
import UserDetail from "./pages/UserDetail";
import ScoreHistory from "./pages/ScoreHistory";


const App = () => {
  return (
    <Router>
      <Toaster position="bottom-right" richColors reverseOrder={false} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/user-dashboard" element={<User />} />
        <Route path="/:id" element={<UserDetail />} />
        <Route path="/ScoreHistory/:id" element={<ScoreHistory/>}/>

        <Route path="/admin-dashboard" element={<AdminPanel />}>
          <Route index element={<Dashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="parents" element={<Parents />} />
          <Route path="students" element={<Students />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="teams" element={<Teams />} />
          <Route path="profile" element={<AdminProfile />} /> 
        </Route>

        <Route path="/teacher-dashboard" element={<TeacherPanel />}>
          <Route index element={<TeacherGroups />} />
          <Route path="grade/:groupId" element={<GradePage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="gradies" element={<Gradies />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
