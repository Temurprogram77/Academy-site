import { Link, useNavigate } from "react-router-dom";
import dataImages from "../assets/images";
import { PiStudentBold } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { GiTeacher } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";
import { LuSunMoon } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";

const { logo } = dataImages;

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login"); // ✅ Logoutdan keyin login sahifasiga qaytaradi
  };

  return (
    <div className="bg-white h-screen w-72 shadow-md">
      <div className="p-4 border-b-2 border-[#0000001f] w-full flex justify-start">
        <Link to="/admin-dashboard">
          <img src={logo} alt="logo" className="w-[180px]" />
        </Link>
      </div>

      <div className="flex flex-col gap-3 py-6">
        <div className="flex flex-col gap-3 py-6">
          <Link to="/admin-dashboard" className="w-full px-5">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <TiHomeOutline />
              Dashboard
            </div>
          </Link>
          <Link to="/admin-dashboard/teachers" className="w-full px-5">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <GiTeacher />
              Xodimlar
            </div>
          </Link>
          <Link to="/admin-dashboard/parents" className="w-full px-5">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <AiOutlineTeam />
              Ota-onalar
            </div>
          </Link>
          <Link to="/admin-dashboard/students" className="w-full px-5">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <PiStudentBold />
              O'quvchilar
            </div>
          </Link>
          <Link to="/admin-dashboard/rooms" className="w-full px-5">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <MdMeetingRoom />
              Xonalar
            </div>
          </Link>
          <Link to="/admin-dashboard/teams" className="w-full px-5">
            <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
              <RiTeamLine />
              Guruhlar
            </div>
          </Link>
        </div>
        <div className="w-full px-5 cursor-pointer" onClick={handleLogout}>
          <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
            <LuSunMoon />
            Mavzu
          </div>
        </div>
        <div className="w-full px-5 cursor-pointer" onClick={handleLogout}>
          <div className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl bg-[#F3F4F6] hover:text-white duration-300 hover:bg-[#5DB445]">
            <FiLogOut />
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
