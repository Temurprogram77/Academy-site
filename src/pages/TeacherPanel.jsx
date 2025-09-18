import React from "react";
import { Link } from "react-router-dom";

const fakeData = {
  "Guruhning egasi": [
    { id: 1, team: "Foundation 1", type: "Front-end" },
    { id: 2, team: "Foundation 2", type: "Back-end" },
    { id: 3, team: "Foundation 3", type: "Python" },
    { id: 4, team: "Foundation 4", type: "3D MAX" },
    { id: 5, team: "Foundation 5", type: "Roboto-texnika" },
    { id: 6, team: "Foundation 6", type: "Cyber" },
  ],
};

const TeacherPanel = () => {
  const handleClick = (team) => {
    localStorage.setItem("Team", team);
  };

  return (
    <div className="max-w-[1300px] mx-auto">
      <div className="flex flex-col items-center mt-12 mb-6 gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
          Salom, {Object.keys(fakeData)}
        </h1>
        <p className="text-lg text-gray-700">Sizning guruhlaringiz!</p>
      </div>

      <div className="grid w-[90%] mx-auto lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mb-[2rem]">
        {fakeData["Guruhning egasi"].map((item) => (
          <Link
            to={`/team/${item.id}`}
            onClick={() => handleClick(item.team)}
            key={item.id}
            className="block rounded-2xl p-6 shadow-md bg-gradient-to-r from-emerald-500 to-green-400 
                       text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <h1 className="text-xl font-semibold">{item.team}</h1>
            <p className="mt-2 opacity-90">{item.type}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeacherPanel;
