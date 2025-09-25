"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Phone, Users, UserIcon, Pen } from "lucide-react"
import { IoMdCloseCircle } from "react-icons/io"
import axios from "axios"
import { toast } from "sonner"

const defaultImage =
  "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg"

function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef(null)
  const token = localStorage.getItem("token")

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-detail"],
    queryFn: async () => {
      const res = await axios.get("http://167.86.121.42:8080/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
  })

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    imageUrl: defaultImage,
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        fullName: userData.fullName || "",
        phone: userData.phone || "",
        imageUrl: userData.imageUrl || defaultImage,
      })
    }
  }, [userData])

  const uploadFile = async (file) => {
    const data = new FormData()
    data.append("file", file)
    const res = await axios.post(
      "http://167.86.121.42:8080/api/v1/files/upload",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return res.data?.url || res.data
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      const uploadedUrl = await uploadFile(file)
      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl }))
      toast.success("Rasm muvaffaqiyatli yuklandi!")
    } catch {
      toast.error("Rasm yuklashda xatolik (hajmi 1MB dan oshmasin)!")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updatedData = {
        fullName: formData.fullName.trim() || userData.fullName,
        phone: formData.phone.trim() || userData.phone,
        imageUrl: formData.imageUrl.trim() || userData.imageUrl,
      }
      await axios.put("http://167.86.121.42:8080/user", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success("Profil muvaffaqiyatli yangilandi!")
      setEditing(false)
      queryClient.invalidateQueries(["user-detail"])
      queryClient.invalidateQueries(["profile"])
    } catch {
      toast.error("Profilni yangilashda xatolik")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
          <span className="text-green-600 font-medium">Ma'lumotlar yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Foydalanuvchi topilmadi</p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
          >
            Orqaga qaytish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[88vh] bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="relative z-10 text-center mb-6">
              <div className="relative inline-block mb-4">
                <img
                  src={formData.imageUrl}
                  alt={formData.fullName}
                  className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
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
                <div className="absolute -bottom-2 -right-2 bg-green-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {userData.role}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {formData.fullName}
              </h2>
              <p className="text-green-100 text-sm">ID: {userData.id}</p>
            </div>

            {!editing ? (
              <div className="space-y-4">
                <div className="bg-white/95 rounded-xl p-4 shadow-lg flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Telefon raqam</p>
                    <p className="text-gray-800 font-semibold">{userData.phone}</p>
                  </div>
                </div>

                <div className="bg-white/95 rounded-xl p-4 shadow-lg flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Guruh</p>
                    <p className="text-gray-800 font-semibold">{userData.groupName}</p>
                    <p className="text-xs text-gray-400">ID: {userData.groupId}</p>
                  </div>
                </div>

                <div className="bg-white/95 rounded-xl p-4 shadow-lg flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Rol</p>
                    <p className="text-gray-800 font-semibold">{userData.role}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 w-full px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition"
                >
                  Tahrirlash
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSave()
                }}
                className="mt-6 space-y-3"
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
                    disabled={saving}
                    className="px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 transition"
                  >
                    {saving ? "Saqlanmoqda..." : "Saqlash"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail