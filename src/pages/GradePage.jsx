import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";

const fetchStudents = async ({ queryKey }) => {
  const [, token, groupId] = queryKey;
  if (!token || !groupId) throw new Error("Token yoki groupId topilmadi");

  const { data } = await axios.get(`http://167.86.121.42:8080/group/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return (data?.data?.students || []).map((s) => ({
    ...s,
    homeworkScore: "",
    activityScore: "",
    attendanceScore: "",
  }));
};

const postGrade = async ({ studentId, scores, token }) => {
  return axios.post(
    "http://167.86.121.42:8080/mark",
    {
      studentId,
      homeworkScore: Number(scores.homeworkScore),
      activityScore: Number(scores.activityScore),
      attendanceScore: Number(scores.attendanceScore),
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const GradePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");

  const [localScores, setLocalScores] = useState({});

  if (!token || !groupId) {
    navigate("/login");
  }

  const {
    data: students = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["students", token, groupId],
    queryFn: fetchStudents,
    retry: false,
    staleTime: 1000 * 60 * 5,
    onSuccess: () => toast.success("O‘quvchilar ro‘yxati yuklandi ✅"),
    onError: () => toast.error("O‘quvchilarni yuklashda xatolik "),
  });

  const { mutate, isLoading: isPosting } = useMutation({
    mutationFn: ({ studentId, scores }) => postGrade({ studentId, scores, token }),
    onSuccess: (_, { studentId }) => {
      toast.success("Baho saqlandi ✅");
      queryClient.invalidateQueries(["students", token, groupId]);
      queryClient.invalidateQueries(["top-students", token, groupId]);
      setLocalScores((prev) => ({
        ...prev,
        [studentId]: { homeworkScore: "", activityScore: "", attendanceScore: "" },
      }));
    },
    onError: () => toast.error("Baho qo‘yishda muammo "),
  });

  const handleChange = (studentId, field, value) => {
    if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 10)) {
      setLocalScores((prev) => ({
        ...prev,
        [studentId]: { ...prev[studentId], [field]: value },
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Xato: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-7 lg:text-4xl md:text-3xl sm:text-2xl font-bold text-green-400 text-center">
          Guruhdagi O‘quvchilar
        </h1>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-green-500">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-semibold text-white">Ism</th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">Uy Vazifa</th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">Faoliyat</th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">Davomat</th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">Baholash</th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white hidden sm:table-cell">
                  O'rtacha ball
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const scores = localScores[student.id] || {
                  homeworkScore: "",
                  activityScore: "",
                  attendanceScore: "",
                };

                const avg = [scores.homeworkScore, scores.activityScore, scores.attendanceScore]
                  .map(Number)
                  .filter((n) => !isNaN(n));

                const avgScore =
                  avg.length > 0 ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(2) : "-";

                const badgeColor =
                  avgScore === "-"
                    ? "bg-gray-300 text-gray-700"
                    : avgScore >= 8
                    ? "bg-green-500"
                    : avgScore >= 5
                    ? "bg-yellow-500"
                    : "bg-red-500";

                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-800">{student.name || student.studentName}</td>

                    {["homeworkScore", "activityScore", "attendanceScore"].map((field) => (
                      <td key={field} className="px-6 py-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={scores[field]}
                          onChange={(e) => handleChange(student.id, field, e.target.value)}
                          className="w-16 px-2 py-1 border rounded text-center"
                        />
                      </td>
                    ))}

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => mutate({ studentId: student.id, scores })}
                        disabled={
                          isPosting ||
                          !scores.homeworkScore ||
                          !scores.activityScore ||
                          !scores.attendanceScore
                        }
                        className={`px-3 py-1 rounded-md text-white font-medium ${
                          isPosting ||
                          !scores.homeworkScore ||
                          !scores.activityScore ||
                          !scores.attendanceScore
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {isPosting ? "Yuklanmoqda..." : "Saqlash"}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm font-medium ${badgeColor}`}
                      >
                        {avgScore}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradePage;
