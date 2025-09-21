import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const TeacherGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMark, setSelectedMark] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    homeworkScore: "",
    activityScore: "",
    attendanceScore: "",
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const fetchMarks = async () => {
      try {
        const res = await axios.get("http://167.86.121.42:8080/mark/myMarks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const body = res.data.data || [];
        if (body.length > 0) setName(body[0].teacherName);

        const detailedMarks = await Promise.all(
          body.map((g) =>
            axios
              .get(`http://167.86.121.42:8080/mark/${g.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((r) => r.data.data)
              .catch(() => null)
          )
        );

        setGroups(detailedMarks.filter((m) => m !== null));
      } catch (err) {
        setError(
          `Xato: ${err.response?.status || ""} ${
            err.message || "So‘rov bajarilmadi"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, [navigate, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://167.86.121.42:8080/mark/${selectedMark.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroups(groups.filter((g) => g.id !== selectedMark.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `http://167.86.121.42:8080/mark/${selectedMark.id}`,
        {
          studentId: selectedMark.studentId,
          homeworkScore: Number(formData.homeworkScore),
          activityScore: Number(formData.activityScore),
          attendanceScore: Number(formData.attendanceScore),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = await axios.get(
        `http://167.86.121.42:8080/mark/${selectedMark.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGroups(
        groups.map((g) => (g.id === selectedMark.id ? updated.data.data : g))
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Tahrirlashda xatolik:", error);
    }
  };

  const handleInputChange = (field, value) => {
    if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 10)) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "YASHIL":
        return "text-green-600 font-bold";
      case "SARIQ":
        return "text-yellow-500 font-bold";
      case "QIZIL":
        return "text-red-600 font-bold";
      default:
        return "text-gray-500";
    }
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
          Hozircha baho qo‘yganingiz yo‘q!
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-[3rem]">
      <div className="max-w-[1300px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-green-400 text-center">
          Salom, {name}
        </h1>
        <h1 className="lg:text-4xl md:text-3xl text-xl text-green-500 mt-[1rem] mb-[2rem]">
          Siz qo‘ygan baholar:
        </h1>
        {error && (
          <p className="text-red-500 bg-white/30 backdrop-blur-md p-3 rounded-md mb-6">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 mt-[1rem]">
          {groups.map((group) => (
            <div
              key={group.id}
              className="gap-[1rem] flex flex-col md:flex-row md:justify-between md:items-center text-gray-600 font-semibold text-xl rounded-2xl shadow-lg p-5 hover:shadow-2xl transition duration-300"
            >
              <div>
                <p>Ism: {group.studentName}</p>
                <p>Umumiy baho: {group.totalScore}</p>
                <p>
                  Daraja:{" "}
                  <span className={getLevelColor(group.level)}>
                    {group.level}
                  </span>
                </p>
                <p>
                  Sana:{" "}
                  {group.date
                    ? new Date(group.date).toLocaleDateString("uz-UZ")
                    : "Noma’lum"}
                </p>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={async () => {
                    try {
                      const res = await axios.get(
                        `http://167.86.121.42:8080/mark/${group.id}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );
                      setSelectedMark(res.data.data);
                      setFormData({
                        homeworkScore:
                          res.data.data.homeworkScore?.toString() || "",
                        activityScore:
                          res.data.data.activityScore?.toString() || "",
                        attendanceScore:
                          res.data.data.attendanceScore?.toString() || "",
                      });
                      setShowEditModal(true);
                    } catch (err) {
                      console.error("Markni olishda xatolik:", err);
                    }
                  }}
                  className="bg-gradient-to-r from-green-400 to-green-600 w-[60px] h-[40px] flex justify-center items-center text-white rounded-lg hover:opacity-90 transition"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => {
                    setSelectedMark(group);
                    setShowDeleteModal(true);
                  }}
                  className="bg-gradient-to-r from-red-400 to-red-600 w-[60px] h-[40px] flex justify-center items-center text-white rounded-lg hover:opacity-90 transition"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-10 w-[600px] relative shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute text-3xl top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowDeleteModal(false)}
              >
                <IoMdCloseCircle />
              </button>
              <h2 className="text-lg font-bold mb-4">
                Bu bahoni qayta tiklay olmaysiz! Siz bunga aminmisiz?
              </h2>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Yo‘q
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-lg hover:opacity-90"
                >
                  Ha
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-[100]"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 w-[400px] relative shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 text-3xl p-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowEditModal(false)}
              >
                <IoMdCloseCircle />
              </button>
              <h2 className="text-lg font-bold mb-4">Bahoni tahrirlash</h2>
              <div className="space-y-3">
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Homework Score"
                  value={formData.homeworkScore}
                  onChange={(e) =>
                    handleInputChange("homeworkScore", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Activity Score"
                  value={formData.activityScore}
                  onChange={(e) =>
                    handleInputChange("activityScore", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Attendance Score"
                  value={formData.attendanceScore}
                  onChange={(e) =>
                    handleInputChange("attendanceScore", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:opacity-90"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGroups;
