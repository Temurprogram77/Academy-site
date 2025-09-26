import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Crown } from "lucide-react";

const fetchTopStudents = async (token) => {
  const { data } = await axios.get(
    `http://167.86.121.42:8080/user/topStudentsForTeacher`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data?.success) return (data.data || []).sort((a, b) => b.score - a.score);
  return [];
};

const TopStudent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) navigate("/login");

  const {
    data: students = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["top-students", token],
    queryFn: () => fetchTopStudents(token),
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: !!token,
    onError: (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  const getLevelColor = (level) => {
    switch (level) {
      case "YASHIL":
        return "bg-green-200 text-green-800";
      case "QIZIL":
        return "bg-red-200 text-red-800";
      case "SARIQ":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return "Noma'lum";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match)
      return `+${match[1]} ${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
    return phone;
  };

  const getRankStyles = (idx) => {
    switch (idx) {
      case 0:
        return "border-2 border-yellow-400 bg-yellow-50";
      case 1:
        return "border-2 border-gray-400 bg-gray-200";
      case 2:
        return "border-2 border-[#605007] bg-gray-50";
      default:
        return "";
    }
  };

  const getRankIcon = (idx) => {
    switch (idx) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Crown className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Crown className="w-5 h-5 text-amber-600" />;
      case 3:
        return <Crown className="w-5 h-5 text-green-500" />;
      case 4:
        return <Crown className="w-5 h-5 text-blue-500" />;
      default:
        return idx + 1;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[20vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center">
        Xato: {error.response?.status || ""} ma’lumot olishda muammo!
      </p>
    );
  }

  return (
    <div className="my-10">
      <h1 className="text-xl sm:text-2xl text-center font-bold text-green-600 mb-6">
        Eng yaxshi o‘quvchilar
      </h1>
      <div className="overflow-x-auto w-full">
        <div>
          <table className="w-full text-sm sm:text-base border-collapse">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase hidden sm:table-cell">
                  #
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">
                  Ism
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">
                  Telefon
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase hidden sm:table-cell">
                  Ota/ona
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs uppercase">
                  Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student, idx) => (
                  <tr
                    key={student.id || idx}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } ${getRankStyles(idx)}`}
                  >
                    <td className="px-3 sm:px-6 py-4 font-bold hidden sm:table-cell">
                      {getRankIcon(idx)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 font-semibold">
                      {student.name || "No name"}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      {formatPhoneNumber(student.phoneNumber)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                      {student.parentName || "Ota/ona"}
                    </td>
                    <td
                      className={`px-3 sm:px-6 py-2 text-center font-semibold ${getLevelColor(
                        student.level
                      )}`}
                    >
                      {student.score || "Level"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center px-3 sm:px-6 py-4 text-gray-500"
                  >
                    Kechirasiz, top studentlar topilmadi!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopStudent;
