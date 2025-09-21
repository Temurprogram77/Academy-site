import { Link, useNavigate, useLocation } from "react-router-dom";
import dataImages from "../assets/images";
import { PiStudentBold } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { GiTeacher } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";
import { LuSunMoon } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
import { User } from "lucide-react";
const { logo } = dataImages;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔥 Active classni aniqlash funksiyasi
  const isActive = (path) =>
    location.pathname === path
      ? "bg-[#5DB445] text-white"
      : "bg-[#F3F4F6] hover:bg-[#5DB445] hover:text-white";

  return (
    <div className="bg-white h-screen w-72 shadow-md">
      <div className="gap-3 flex flex-col justify-between h-full py-4">
        <div className="flex flex-col gap-3">
          <div className="p-4 border-b-2 border-[#0000001f] w-full flex justify-start">
            <Link to="/admin-dashboard">
              <img src={logo} alt="logo" className="w-[180px]" />
            </Link>
          </div>

          <Link to="/admin-dashboard" className="w-full px-5 mt-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard"
              )}`}
            >
              <TiHomeOutline />
              Dashboard
            </div>
          </Link>

          <Link to="/admin-dashboard/profile" className="w-full px-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard/profile"
              )}`}
            >
              <User size={16} />
              Profile
            </div>
          </Link>

          <Link to="/admin-dashboard/teachers" className="w-full px-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard/teachers"
              )}`}
            >
              <GiTeacher />
              Xodimlar
            </div>
          </Link>

          <Link to="/admin-dashboard/parents" className="w-full px-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard/parents"
              )}`}
            >
              <AiOutlineTeam />
              Ota-onalar
            </div>
          </Link>

          <Link to="/admin-dashboard/students" className="w-full px-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard/students"
              )}`}
            >
              <PiStudentBold />
              O'quvchilar
            </div>
          </Link>

          <Link to="/admin-dashboard/rooms" className="w-full px-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard/rooms"
              )}`}
            >
              <MdMeetingRoom />
              Xonalar
            </div>
          </Link>

          <Link to="/admin-dashboard/teams" className="w-full px-5">
            <div
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                "/admin-dashboard/teams"
              )}`}
            >
              <RiTeamLine />
              Guruhlar
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <div className="w-full px-5 cursor-pointer">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <LuSunMoon />
              Mavzu
            </div>
          </div>

          <div className="w-full px-5 cursor-pointer" onClick={handleLogout}>
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <FiLogOut />
              Chiqish
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
