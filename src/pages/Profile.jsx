import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";

const defaultImage =
  "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

const TeacherProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    imageUrl: defaultImage,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    imageUrl: defaultImage,
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
        setProfile({
          fullName: res.data.data.fullName || "",
          phone: res.data.data.phone || "",
          imageUrl: res.data.data.imageUrl || defaultImage,
        });
        setFormData({
          fullName: res.data.data.fullName || "",
          phone: res.data.data.phone || "",
          imageUrl: res.data.data.imageUrl || defaultImage,
        });
      } catch (err) {
        console.error(err);
        toast.error("Profilni yuklashda xatolik");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    const updatedData = {
      fullName: formData.fullName.trim() || profile.fullName,
      phone: formData.phone.trim() || profile.phone,
      imageUrl: formData.imageUrl.trim() || profile.imageUrl,
    };

    try {
      await axios.put("http://167.86.121.42:8080/user", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(updatedData);
      setFormData(updatedData);
      setEditing(false);
      toast.success("Profil muvaffaqiyatli tahrirlandi!");

      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      console.error(err);
      toast.error("Profilni yangilashda xatolik");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-6">
        Mening Profilim
      </h1>
      <div className="flex flex-col items-center">
        <img
          src={profile.imageUrl}
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
              <span>{role}</span>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition w-full"
            >
              Tahrirlash
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="mt-6 w-full space-y-3"
          >
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
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg border flex items-center gap-2"
              >
                <IoMdCloseCircle /> Bekor qilish
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition"
              >
                Saqlash
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
