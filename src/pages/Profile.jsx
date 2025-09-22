import { useState, useRef, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "sonner";
import { Pen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

const defaultImage =
  "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

// Profilni olish
const fetchProfile = async () => {
  const { data } = await api.get("/user");
  return data.data;
};

// Profilni yangilash
const updateProfile = async (updatedData) => {
  await api.put("/user", updatedData);
};

// Fayl yuklash
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/api/v1/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data?.url || data;
};

const TeacherProfile = () => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    imageUrl: defaultImage,
  });

  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  // Profilni olish (cache bilan)
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minut cache
    cacheTime: 10 * 60 * 1000, // 10 minutgacha saqlanadi
  });

  // Agar profil o‘zgarsa, formData ni yangilash
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        imageUrl: profile.imageUrl || defaultImage,
      });
    }
  }, [profile]);

  // Update mutation
  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profil muvaffaqiyatli yangilandi!");
      queryClient.invalidateQueries(["profile"]);
      window.dispatchEvent(new Event("profileUpdated"));
      setEditing(false);
    },
    onError: () => {
      toast.error("Profilni yangilashda xatolik");
    },
  });

  // Fayl yuklash
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploadedUrl = await uploadFile(file);
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success("Rasm muvaffaqiyatli yuklandi!");
    } catch {
      toast.error("Rasm yuklashda xatolik");
    }
  };

  // Saqlash
  const handleSave = () => {
    const updatedData = {
      fullName: formData.fullName.trim() || profile.fullName,
      phone: formData.phone.trim() || profile.phone,
      imageUrl: formData.imageUrl.trim() || profile.imageUrl,
    };
    mutation.mutate(updatedData);
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
      </div>
    );
  }

  // Error
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-red-500">Profilni yuklashda xatolik</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center text-green-500 mb-6">
        Mening Profilim
      </h1>
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={formData.imageUrl}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-green-300"
          />
          {editing && (
            <>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-lg hover:bg-green-600"
              >
                <Pen size={18} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*"
              />
            </>
          )}
        </div>

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
                disabled={mutation.isLoading}
                className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition"
              >
                {mutation.isLoading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;