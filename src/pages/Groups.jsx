import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";

const api = axios.create({
  baseURL: "http://167.86.121.42:8080",
});

const getToken = () => localStorage.getItem("token");

const getTeacherDashboard = async () => {
  const token = getToken();
  if (!token) throw new Error("Token mavjud emas");
  const { data } = await api.get("/user/teacher-dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data;
};

const getTeacherGroups = async ({ queryKey }) => {
  const [, searchQuery] = queryKey;
  const token = getToken();
  if (!token) throw new Error("Token mavjud emas");
  const { data } = await api.get("/group", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      page: 0,
      size: 10,
      ...(searchQuery ? { name: searchQuery.toLowerCase() } : {}),
    },
  });
  return data?.data?.body || [];
};

const TeacherGroups = () => {
  const navigate = useNavigate();    
  const token = getToken();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: getTeacherDashboard,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const {
    data: groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ["teacher-groups", searchQuery],
    queryFn: getTeacherGroups,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const handleGoToGrade = (groupId) => {
    localStorage.setItem("groupId", groupId);
    navigate(`/teacher-dashboard/grade/${groupId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(search.trim());
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

  return (
    <div className="mt-[3rem]">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-[3rem] mt-[2rem] gap-4">
          <h1 className="lg:text-4xl md:text-3xl text-xl text-green-500">
            Sizning guruhlaringiz:
          </h1>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-[1rem] outline-none w-full md:w-[20rem] rounded-[7px] shadow-sm"
              placeholder="Guruh nomi bo‘yicha qidiring..."
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              Qidirish
            </button>
          </form>
        </div>

        {!groups || groups.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <h1 className="text-2xl font-bold text-gray-600">
              {searchQuery
                ? "Bunday guruh topilmadi!"
                : "Hozircha guruhlaringiz yo‘q!"}
            </h1>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TeacherGroups;