import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";

const TeacherGroups = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedMark, setSelectedMark] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    homeworkScore: 0,
    activityScore: 0,
    attendanceScore: 0,
  });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://167.86.121.42:8080/mark/myMarks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const body = res.data.data || [];
        setGroups(body);
        if (body.length > 0) setName(body[0].teacherName);
      })
      .catch((err) => {
        setError(`Xato: ${err.response?.status} ${"So‘rov bajarilmadi"}`);
      })
      .finally(() => setLoading(false));
  }, [navigate, token]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://167.86.121.42:8080/mark/${selectedMark.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

      setGroups(
        groups.map((g) =>
          g.id === selectedMark.id
            ? {
                ...g,
                homeworkScore: Number(formData.homeworkScore),
                activityScore: Number(formData.activityScore),
                attendanceScore: Number(formData.attendanceScore),
              }
            : g
        )
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
        [field]: value === "" ? "" : Number(value),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }
console.log(groups);

  return (
    <div className="mt-[3rem]">
      <div className=" max-w-[1300px] mx-auto px-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[1rem]">
          {groups.map((group) => {
            const { id, studentId, teacherId, ...rest } = group;

            return (
              <div
                key={id}
                className="bg-green-300 gap-[1rem] text-gray-100 font-semibold text-xl rounded-2xl shadow-lg p-5 hover:shadow-2xl transition duration-300"
              >
             <p> O'quvchining ismi: {group.studentName}</p>
              <p>O'qituvchining ismi: {group.teacherName}</p>
              <p>O'quvchining darajasi: {group.level}</p>


                <div className="flex text-[1rem] gap-3 mt-4">
                  <button
                    onClick={() => {
                      setSelectedMark(group);
                      setFormData({
                        homeworkScore: group.homeworkScore || 0,
                        activityScore: group.activityScore || 0,
                        attendanceScore: group.attendanceScore || 0,
                      });
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-green-500 font-serif text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMark(group);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    O‘chirish
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded-2xl p-10 w-[600px] relative shadow-xl">
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
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Ha
                </button>
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white rounded-2xl p-6 w-[400px] relative shadow-xl">
              <button
                className="absolute top-2 text-3xl p-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setShowEditModal(false)}
              >
                <IoMdCloseCircle />
              </button>
              <h2 className="text-lg font-bold mb-4">Bahoni tahrirlash</h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Homework Score"
                  value={formData.homeworkScore}
                  onChange={(e) =>
                    handleInputChange("homeworkScore", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Activity Score"
                  value={formData.activityScore}
                  onChange={(e) =>
                    handleInputChange("activityScore", e.target.value)
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  type="text"
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
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500"
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