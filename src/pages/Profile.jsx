import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [role, setRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://167.86.121.42:8080/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.data);
        setFormData({
          fullName: res.data.data.fullName,
          phone: res.data.data.phone,
          imageUrl: res.data.data.imageUrl,
        });
      } catch (err) {
        console.error("Profilni olishda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    try {
      await axios.put(
        "http://167.86.121.42:8080/user",
        {
          fullName: formData.fullName,
          phone: formData.phone,
          imageUrl: formData.imageUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(formData);
      setEditing(false);
    } catch (err) {
      console.error("Profilni yangilashda xatolik:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center text-red-500">Profil topilmadi!</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-6">
        Mening Profilim
      </h1>

      <div className="flex flex-col items-center">
        <img
          src={
            profile.imageUrl ||
            "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"
          }
          alt="profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-green-300"
        />
        {!editing ? (
          <div className="mt-6 text-lg text-gray-700 space-y-2 w-full">
            <div className="flex justify-between border-b pb-1">
              <strong>Ism:</strong>
              <span>{profile.fullName}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <strong>Telefon:</strong>
              <span>{profile.phone}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <strong>Rol:</strong>
              <span>{profile.role}</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition w-full"
            >
              Tahrirlash
            </button>
          </div>
        ) : (
          <div className="mt-6 w-full space-y-3">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Ism"
            />
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Telefon"
            />
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Rasm URL"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg border flex items-center gap-2"
              >
                <IoMdCloseCircle /> Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition"
              >
                Saqlash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;