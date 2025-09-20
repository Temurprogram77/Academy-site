import { User } from "lucide-react"; // 👈 user icon uchun kutubxona
import { Link } from "react-router-dom";
// yoki: import { FaUser } from "react-icons/fa"; ishlatishingiz ham mumkin

const AdminNavbar = () => {
  const profileImage = localStorage.getItem("profileImage"); // localStorage'dan olish

  return (
    <div className="max-w-full bg-[#fff] py-4 px-6 flex justify-between items-center shadow-md">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <Link to="/admin-dashboard/profile">
      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
        {profileImage ? (
          <img
            src={profileImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="text-gray-600 w-6 h-6" />
        )}
      </div>
      </Link>
    </div>
  );
};

export default AdminNavbar;