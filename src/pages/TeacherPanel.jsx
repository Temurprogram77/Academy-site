import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); 
      return;
    }
    axios
      .get("http://167.86.121.42:8080/group?page=0&size=10", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const body = res.data.data.body || [];
        setGroups(body);
        if (body.length > 0) setName(body[0].teacherName);
      })
      .catch((err) => {
        setError(
          `Xato: ${err.response?.status} ${
            err.response?.data?.message || "So‘rov bajarilmadi"
          }`
        );
      });
  }, [navigate]);
  const handleGoToGrade = (groupId) => {
    navigate(`/teacher/grade/${groupId}`);
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Salom {name}</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {group.name}
            </h2>
            <p className="text-gray-600">O'quvchilar: {group.studentCount}</p>
            <div className="mt-4">
              {group.weekDays?.map((day) => (
                <span
                  key={day}
                  className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mr-2"
                >
                  {day}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleGoToGrade(group.id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Baholashga o‘tish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherGroups;