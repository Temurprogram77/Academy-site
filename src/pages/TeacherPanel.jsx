import React, { useState } from "react";
import TeacherSideBar from "../components/TeacherSideBar";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const TeacherPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <TeacherSideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <div className="md:hidden flex items-center mb-4">
          <button
            className="text-green-700 text-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="ml-4 text-xl font-bold text-green-700">
            Teacher Panel
          </h1>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default TeacherPanel;
