import { Link, useNavigate, useLocation } from "react-router-dom";
import dataImages from "../assets/images";
import { PiStudentBold } from "react-icons/pi";
import { FiLogOut, FiX } from "react-icons/fi"; // ❌ close icon
import { GiTeacher } from "react-icons/gi";
import { RiTeamLine } from "react-icons/ri";
import { LuSunMoon } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";
import { MdMeetingRoom } from "react-icons/md";
import { AiOutlineTeam } from "react-icons/ai";
const { logo } = dataImages;

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-[#5DB445] text-white"
      : "bg-[#F3F4F6] hover:bg-[#5DB445] hover:text-white";

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-[#0003] duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className={`bg-white lg:overflow-hidden overflow-y-scroll h-screen shadow-md fixed top-0 left-0 z-50 md:w-72 w-full transform transition-transform duration-300
                  ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                  } lg:translate-x-0 lg:static lg:block`}
      >
        <div className="flex flex-col justify-between h-full pb-4 gap-3">
          {/* Logo + Close button */}
          <div className="">
            <div className="flex justify-between items-center p-4 border-b-2 border-[#0000001f]">
              <Link to="/admin-dashboard">
                <img src={logo} alt="logo" className="w-[180px]" />
              </Link>
              {/* Close button faqat mobil uchun */}
              <button
                className="lg:hidden p-1 rounded-md hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-3">
              <Link
                to="/admin-dashboard"
                className="w-full px-5 mt-5"
                onClick={() => setIsOpen(false)} // ✅ link bosilganda sidebar yopilsin
              >
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                    "/admin-dashboard"
                  )}`}
                >
                  <TiHomeOutline />
                  Dashboard
                </div>
              </Link>

              <Link
                to="/admin-dashboard/teachers"
                className="w-full px-5"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                    "/admin-dashboard/teachers"
                  )}`}
                >
                  <GiTeacher />
                  Xodimlar
                </div>
              </Link>

              <Link
                to="/admin-dashboard/parents"
                className="w-full px-5"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                    "/admin-dashboard/parents"
                  )}`}
                >
                  <AiOutlineTeam />
                  Ota-onalar
                </div>
              </Link>

              <Link
                to="/admin-dashboard/students"
                className="w-full px-5"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                    "/admin-dashboard/students"
                  )}`}
                >
                  <PiStudentBold />
                  O'quvchilar
                </div>
              </Link>

              <Link
                to="/admin-dashboard/rooms"
                className="w-full px-5"
                onClick={() => setIsOpen(false)}
              >
                <div
                  className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl duration-300 ${isActive(
                    "/admin-dashboard/rooms"
                  )}`}
                >
                  <MdMeetingRoom />
                  Xonalar
                </div>
              </Link>

              <Link
                to="/admin-dashboard/teams"
                className="w-full px-5"
                onClick={() => setIsOpen(false)}
              >
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
          </div>

          {/* Pastki menyu */}
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
    </>
  );
};

export default AdminSidebar;
