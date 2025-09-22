import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";

const AdminNavbar = ({ setIsSidebarOpen }) => {
  const profileImage = localStorage.getItem("profileImage");

  return (
    <div className="max-w-full bg-[#fff] py-4 px-6 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <button className="md:hidden block" onClick={() => setIsSidebarOpen((prev) => !prev)}>
          <HiMenuAlt2 size={28} />
        </button>
        <h1 className="lg:text-2xl text-xl font-bold">Admin Panel</h1>
      </div>
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
