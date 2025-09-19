import React from "react";
import AdminPanel from "./AdminPanel";
import TeacherPanel from "./TeacherPanel";
import UserPanel from "./UserPanel";

const Dashboard = () => {
  const role = localStorage.getItem("role");

  return (
    <div>
      {role === "ADMIN" && <AdminPanel />}
      {role === "TEACHER" && <TeacherPanel />}
      {role === "USER" && <UserPanel />}
    </div>
  );
};

export default Dashboard;
