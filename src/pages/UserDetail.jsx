"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Phone, Users, UserIcon } from "lucide-react"

function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetail()
  }, [id])

  const fetchUserDetail = async () => {
    setLoading(true)
    try {
      // Mock API call - siz o'zingizning API endpointingizni qo'ying
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockData = {
        success: true,
        message: "User data fetched successfully",
        data: {
          id: Number.parseInt(id),
          fullName: `User ${id}`,
          phone: "+998 90 123 45 67",
          groupName: "Frontend Developers",
          groupId: 101,
          imageUrl:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
          role: "Student",
        },
      }

      setUserData(mockData.data)
    } catch (error) {
      console.error("Error fetching user detail:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 p-6">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Orqaga</span>
        </button>

        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 rounded-2xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
          <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl">
            <div className="relative z-10 text-center mb-6">
              <div className="relative inline-block mb-4">
                <img
                  src={userData.imageUrl || "/placeholder.svg"}
                  alt={userData.fullName}
                  className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {userData.role}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{userData.fullName}</h2>
              <p className="text-green-100 text-sm">ID: {userData.id}</p>
            </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetail
