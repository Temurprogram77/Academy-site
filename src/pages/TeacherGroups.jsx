import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
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
           "So‘rov bajarilmadi"
          }`
        );
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleGoToGrade = (groupId) => {
    navigate(`/teacher-dashboard/grade/${groupId}`);
    localStorage.setItem("groupId",groupId)
  };


  return (
    <div className="mt-[3rem]">
      <div className=" max-w-[1300px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-green-400 text-center">
          Salom, {name}
        </h1>
      <h1 className="lg:text-4xl md:text-3xl text-xl text-green-500 mt-[1rem] mb-[1rem]">
        Sizning guruhlaringiz:
      </h1>
        {error && (
          <p className="text-red-500 bg-white/30 backdrop-blur-md p-3 rounded-md mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[1rem]">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {group.name}
              </h2>
              <p className="text-gray-700 mb-2 text-[1.2rem]">
                O‘qituvchi: <span className="font-medium">{group.teacherName}</span>
              </p>
              <p className="text-gray-700 mb-3">
                O‘quvchilar: <span className="font-medium">{group.studentCount}</span>
              </p>
              <button
                onClick={() => handleGoToGrade(group.id)}
                className="w-full py-2 rounded-lg text-white font-semibold bg-green-500"
              >
                Baholashga o‘tish
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherGroups;