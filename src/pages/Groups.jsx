import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getTeacherDashboard = async (token) => {
  const { data } = await axios.get("http://167.86.121.42:8080/user/teacher-dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data;
};

const getTeacherGroups = async (token) => {
  const { data } = await axios.get("http://167.86.121.42:8080/group?page=0&size=10", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data?.body || [];
};

const TeacherGroups = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ["teacher-dashboard", token],
    queryFn: () => getTeacherDashboard(token),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!token,
  });

  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ["teacher-groups", token],
    queryFn: () => getTeacherGroups(token),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!token,
  });

  const handleGoToGrade = (groupId) => {
    navigate(`/teacher-dashboard/grade/${groupId}`);
    localStorage.setItem("groupId", groupId);
  };

  if (dashboardLoading || groupsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (dashboardError || groupsError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <h1 className="text-2xl font-bold text-red-600">
          Xato yuz berdi! {dashboardError?.message || groupsError?.message}
        </h1>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-600">
          Hozircha guruhlaringiz yo‘q!
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-[3rem]">
      <div className="max-w-[1300px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-green-400 text-center">
          Salom, {groups[0]?.teacherName}
        </h1>

        <h1 className="lg:text-4xl md:text-3xl text-xl text-green-500 mt-[2rem] mb-[1.5rem]">
          Sizning guruhlaringiz:
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white/80 backdrop-blur-md border-[2px] rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-500"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {group.name}
              </h2>
              <p className="text-gray-700 mb-2 text-lg">
                O‘qituvchi:{" "}
                <span className="font-medium">{group.teacherName}</span>
              </p>
              <p className="text-gray-700 mb-3 text-lg">
                O‘quvchilar:{" "}
                <span className="font-medium">{group.studentCount}</span>
              </p>
              <button
                onClick={() => handleGoToGrade(group.id)}
                className="w-full py-2 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition"
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
