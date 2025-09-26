import React, { useState, useEffect, useRef } from "react";
import { Pencil, X } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // LocalStorage'dan rasm olish
  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setImage(savedImage);
  }, []);

  // API orqali user olish
  useEffect(() => {
    if (!token) return;
    axios
      .get("https://nazorat.sferaacademy.uz/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.data);
        setFormData({
          fullName: res.data.data.fullName,
          phone: res.data.data.phone,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("User API error:", err);
        setLoading(false);
      });
  }, [token]);

  // Rasm yuklash
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file); // API file nomi bilan qabul qiladi

    try {
      const res = await axios.post(
        "https://nazorat.sferaacademy.uz/api/api/v1/files/upload",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // serverdan URL olish (server formatiga qarab o‘zgartiring)
      const imageUrl = res.data?.data?.url || res.data?.url || "";
      if (imageUrl) {
        setImage(imageUrl);
        localStorage.setItem("profileImage", imageUrl);
        toast.success("Rasm muvaffaqiyatli yuklandi ✅");
      } else {
        toast.error("Rasm URL topilmadi ❌");
      }
    } catch (err) {
      console.error("Upload error:", err.response || err);
      toast.error("Rasm yuklashda xatolik ❌");
    }
  };

  // Input handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // User update
  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("phone", formData.phone);
      if (fileInputRef.current.files[0]) {
        form.append("file", fileInputRef.current.files[0]);
      }

      await axios.put("https://nazorat.sferaacademy.uz/api/user", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Ma'lumot muvaffaqiyatli yangilandi ✅");
      setEditing(false);
    } catch (err) {
      console.error("Update error:", err.response || err);
      toast.error("Xatolik yuz berdi ❌");
    }
  };

  if (loading)
    return (
      <div className="mt-80 flex items-center justify-center bg-[#F3F4F6]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#208a00]"></div>
      </div>
    );

  return (
    <div className="p-8 space-y-4 bg-white m-6 rounded-xl">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full flex items-center justify-between gap-10">
        <div className="w-[400px]">
          {/* Avatar */}
          <div className="mx-auto relative w-32 h-32 flex items-center justify-center">
            {image ? (
              <>
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-400 rounded-full hover:bg-gray-100"
              >
                <Pencil className="w-6 h-6 text-gray-500" />
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* User ma'lumotlari */}
          {user ? (
            <div className="space-y-1 w-full flex flex-col gap-2">
              <div className="my-5">
                <div className="flex items-center justify-between py-2">
                  <p className="uppercase text-[14px]">Ismingiz: </p>
                  <h2 className="text-lg font-semibold">{user.fullName}</h2>
                </div>
                <div className="flex items-center justify-between border-t-2 border-[#00000021] py-2">
                  <p className="uppercase text-[14px]">Telefon: </p>
                  <p className="text-gray-600">{user.phone}</p>
                </div>
                <div className="flex items-center justify-between border-t-2 border-[#00000021] py-2">
                  <p className="uppercase text-[14px]">Role: </p>
                  <p className="text-gray-600">{user.role}</p>
                </div>
              </div>
              <div
                className="w-full py-2 rounded-xl text-center bg-[#5DB445] text-white font-semibold cursor-pointer"
                onClick={() => setEditing(true)}
              >
                Tahrirlash
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Ma'lumot topilmadi</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {editing && (
        <>
          <div
            onClick={() => setEditing(false)}
            className="fixed -top-5 left-0 inset-0 bg-black/40 flex items-center justify-center z-40"
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl p-6 w-[400px] shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Profilni tahrirlash</h2>
              <button onClick={() => setEditing(false)}>
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ismingiz"
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Telefon"
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-lg border"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2 rounded-lg bg-[#5DB445] text-white"
              >
                Saqlash
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
