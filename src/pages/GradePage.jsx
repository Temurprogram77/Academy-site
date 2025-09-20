import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      setStudents(res?.data?.data?.students || []);
    } catch (err) {
      setError(`Xato: ${err.response?.status} So‘rov bajarilmadi`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [navigate, token, groupId]);

  const handleClick = async (studentId) => {
    setPosting(true);
    setError(null);
    try {
      await axios.post(
        "http://167.86.121.42:8080/mark",
        {
          studentId,
          homeworkScore: 1,
          activityScore: 1,
          attendanceScore: 1,
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
    <div className="p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h1 className="text-2xl font-bold mb-4">Guruhdagi O‘quvchilar</h1>
      <ul>
        {students.map((student) => (
          <li key={student.id} className="mb-2 flex items-center justify-between">
            <span>{student.name || student.studentName}</span>
            <button
              onClick={() => handleClick(student.id)}
              disabled={posting}
              className={`px-3 py-1 rounded ${
                posting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {posting ? "Yuklanmoqda..." : "Baholash"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GradePage;