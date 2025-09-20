import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GradePage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
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
      const res = await axios.get(`http://167.86.121.42:8080/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(
        (res?.data?.data?.students || []).map((s) => ({
          ...s,
          homeworkScore: "",
          activityScore: "",
          attendanceScore: "",
        }))
      );
    } catch (err) {
      setError(`Xato: ${err.response?.status} So‘rov bajarilmadi`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [navigate, token, groupId]);

  const handleChange = (studentId, field, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, [field]: value } : s
      )
    );
  };

  const handleSubmit = async (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setPosting(true);
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
    } catch (err) {
      setError(`Xato: ${err.response?.status} So‘rov bajarilmadi`);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-green-400 via-green-500 to-green-600">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Guruhdagi O‘quvchilar</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 shadow-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ism</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Uyga vazifa</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Faoliyat</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Davomat</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Baholash</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">O'rtacha ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 text-gray-800">{student.name || student.studentName}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={student.homeworkScore}
                      onChange={(e) => handleChange(student.id, "homeworkScore", e.target.value)}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={student.activityScore}
                      onChange={(e) => handleChange(student.id, "activityScore", e.target.value)}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={student.attendanceScore}
                      onChange={(e) => handleChange(student.id, "attendanceScore", e.target.value)}
                      className="w-16 px-2 py-1 border rounded text-center"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleSubmit(student.id)}
                      disabled={posting}
                      className={`px-3 py-1 rounded-md text-white font-medium ${
                        posting
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {posting ? "Yuklanmoqda..." : "Saqlash"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button>
                    {student.score}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GradePage;
