import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";

const fetchMarks = async (token) => {
  const { data } = await axios.get("https://nazorat.sferaacademy.uz/api/mark/myMarks", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.data || [];
};

const deleteMark = async ({ id, token }) => {
  await axios.delete(`https://nazorat.sferaacademy.uz/api/mark/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const editMark = async ({ mark, formData, token }) => {
  await axios.put(
    `https://nazorat.sferaacademy.uz/api/mark/${mark.id}`,
    {
      studentId: mark.studentId,
      homeworkScore: Number(formData.homeworkScore),
      activityScore: Number(formData.activityScore),
      attendanceScore: Number(formData.attendanceScore),
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const MarksPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  const [selectedMark, setSelectedMark] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    homeworkScore: "",
    activityScore: "",
    attendanceScore: "",
  });

  if (!token) {
    navigate("/login", { replace: true });
  }

  const {
    data: marks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["marks", token],
    queryFn: () => fetchMarks(token),
    retry: false,
    staleTime: 1000 * 60 * 2,
    enabled: !!token,
    onError: (err) => {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, token }) => deleteMark({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["marks", token]);
      queryClient.invalidateQueries(["top-students", token]);
      toast.success("Baho muvaffaqiyatli o‘chirildi!");
      setShowDeleteModal(false);
    },
    onError: () => {
      toast.error("Baho o‘chirilmadi!");
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ mark, formData, token }) => editMark({ mark, formData, token }),
    onSuccess: () => {
      queryClient.invalidateQueries(["marks", token]);
      queryClient.invalidateQueries(["top-students", token]);
      toast.success("Baho muvaffaqiyatli yangilandi!");
      setShowEditModal(false);
    },
    onError: () => {
      toast.error("Baho yangilanmadi!");
    },
  });

  const handleInputChange = (field, value) => {
    if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 10)) {
      setFormData({ ...formData, [field]: value });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500 bg-white/30 backdrop-blur-md p-3 rounded-md">
          Xato: {error?.message}
        </p>
      </div>
    );
  }

  if (!marks.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <h1 className="text-2xl font-bold text-gray-600">
          Hozircha baho qo‘yganingiz yo‘q!
        </h1>
      </div>
    );
  }

  return (
    <div className="mt-[3rem] max-w-[1300px] mx-auto px-4">
      <h1 className="text-4xl font-bold text-green-400 text-center">
        Salom, {marks[0]?.teacherName}
      </h1>
      <h2 className="lg:text-4xl md:text-3xl text-xl text-green-500 mt-4 mb-6">
        Siz qo‘ygan baholar:
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {marks.map((mark) => (
          <div
            key={mark.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-gray-600 font-semibold text-xl rounded-2xl shadow-lg p-5 hover:shadow-2xl transition duration-300"
          >
            <div>
              <p>Ism: {mark.studentName}</p>
              <p>Umumiy baho: {mark.totalScore ?? mark.score ?? "—"}</p>
              <p>
                Daraja:{" "}
                <span className={getLevelColor(mark.level)}>{mark.level}</span>
              </p>
              <p>
                Sana:{" "}
                {mark.date
                  ? new Date(mark.date).toLocaleDateString("uz-UZ")
                  : "Noma’lum"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedMark(mark);
                  setFormData({
                    homeworkScore: mark.homeworkScore?.toString() || "",
                    activityScore: mark.activityScore?.toString() || "",
                    attendanceScore: mark.attendanceScore?.toString() || "",
                  });
                  setShowEditModal(true);
                }}
                className="bg-gradient-to-r from-green-400 to-green-600 w-[60px] h-[40px] flex justify-center items-center text-white rounded-lg hover:opacity-90 transition"
              >
                <FaPencilAlt />
              </button>

              <button
                onClick={() => {
                  setSelectedMark(mark);
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
                onClick={() =>
                  deleteMutation.mutate({ id: selectedMark.id, token })
                }
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
              {["homeworkScore", "activityScore", "attendanceScore"].map(
                (field) => (
                  <input
                    key={field}
                    type="number"
                    min="0"
                    max="10"
                    placeholder={field}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                )
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Bekor qilish
              </button>
              <button
                onClick={() =>
                  editMutation.mutate({ mark: selectedMark, formData, token })
                }
                className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:opacity-90"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksPage; 