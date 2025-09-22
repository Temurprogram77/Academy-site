import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopStudent from "../components/TopStudent";

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
      .get("http://167.86.121.42:8080/user/teacher-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const body = res.data?.data || [];
        setGroups(body);
        if (body.length > 0) setName(body[0].teacherName);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            `Xato: ${err.response?.status || ""} So‘rov bajarilmadi`
          );
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleGoToGrade = (groupId) => {
    navigate(`/teacher-dashboard/grade/${groupId}`);
    localStorage.setItem("groupId", groupId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-600">
          Hozircha guruhlaringiz yo‘q!
        </h1>
      </div>
    );
  }
  console.log(groups);
  
  return (
    <div className="mt-[3rem]">
      <div className="max-w-[1300px] mx-auto px-4">
        {error && (
          <p className="text-red-500 bg-white/30 backdrop-blur-md p-3 rounded-md mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-[1rem]">
            <div
              className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
            <p className="text-gray-700 mb-2 text-[1.2rem]">
                <span className="font-medium">Guruhlar soni</span>
              </p>
              <h2 className="text-4xl font-semibold text-gray-800 mb-2">
               {groups.groupCount}
              </h2>
            </div>
            <div
              className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
            <p className="text-gray-700 mb-2 text-[1.2rem]">
                <span className="font-medium">O'quvchilar soni</span>
              </p>
              <h2 className="text-4xl font-semibold text-gray-800 mb-2">
               {groups.studentCount}
              </h2>
            </div>
        </div>
        <TopStudent/>
      </div>
    </div>
  );
};

export default TeacherGroups;