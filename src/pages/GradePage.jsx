import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GradePage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const groupId = localStorage.getItem("groupId");

  const fetchStudents = async () => {
    if (!token || !groupId) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `http://167.86.121.42:8080/group/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(
        (res?.data?.data?.students || []).map((s) => ({
          ...s,
          homeworkScore: "",
          activityScore: "",
          attendanceScore: "",
        }))
      );
      toast.success("O‘quvchilar ro‘yxati yuklandi ✅");
    } catch (err) {
      setError(`Xato: ${err.response?.status || ""} So‘rov bajarilmadi`);
      toast.error("O‘quvchilarni yuklashda xatolik ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [navigate, token, groupId]);

  const handleChange = (studentId, field, value) => {
    if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 10)) {
      setStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, [field]: value } : s))
      );
    }
  };

  const handleSubmit = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setPosting((prev) => ({ ...prev, [studentId]: true }));
    setError(null);

    try {
      await axios.post(
        "http://167.86.121.42:8080/mark",
        {
          studentId,
          homeworkScore: Number(student.homeworkScore),
          activityScore: Number(student.activityScore),
          attendanceScore: Number(student.attendanceScore),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchStudents();
      toast.success(
        `${student.name || student.studentName} uchun baho qo‘yildi! 🎉`
      );
    } catch (err) {
      setError(`Xato: ${err.response?.status || ""} So‘rov bajarilmadi`);
      toast.error("Baho qo‘yishda muammo yuz berdi ❌");
    } finally {
      setPosting((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="mb-7 lg:text-4xl md:text-3xl sm:text-2xl font-bold text-green-400 text-center">
          Guruhdagi O‘quvchilar
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 shadow-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-green-500">
              <tr>
                <th className="px-6 py-4 text-left text-lg font-semibold text-white">
                  Ism
                </th>
                <th className="px-6 py-4 text-center text-sm lg:text-lg font-semibold text-white">
                  Uy Vazifa
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">
                  Faoliyat
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">
                  Davomat
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white">
                  Baholash
                </th>
                <th className="px-6 py-4 text-center text-lg font-semibold text-white hidden sm:table-cell">
                  O'rtacha ball
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const avg = [
                  student.homeworkScore,
                  student.activityScore,
                  student.attendanceScore,
                ]
                  .map(Number)
                  .filter((n) => !isNaN(n));
                const avgScore =
                  avg.length > 0
                    ? (avg.reduce((a, b) => a + b, 0) / avg.length).toFixed(2)
                    : "-";

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
                    <td className="px-6 py-4 text-gray-800">
                      {student.name || student.studentName}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={student.homeworkScore}
                        onChange={(e) =>
                          handleChange(
                            student.id,
                            "homeworkScore",
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={student.activityScore}
                        onChange={(e) =>
                          handleChange(
                            student.id,
                            "activityScore",
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={student.attendanceScore}
                        onChange={(e) =>
                          handleChange(
                            student.id,
                            "attendanceScore",
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleSubmit(student.id)}
                        disabled={
                          posting[student.id] ||
                          !student.homeworkScore ||
                          !student.activityScore ||
                          !student.attendanceScore
                        }
                        className={`px-3 py-1 rounded-md text-white font-medium ${
                          posting[student.id] ||
                          !student.homeworkScore ||
                          !student.activityScore ||
                          !student.attendanceScore
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        }`}
                      >
                        {posting[student.id] ? "Yuklanmoqda..." : "Saqlash"}
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
