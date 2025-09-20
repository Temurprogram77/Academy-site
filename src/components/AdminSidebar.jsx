import { Link } from "react-router-dom";
import dataImages from "../assets/images";
import { FaUserTie, FaUserGraduate } from "react-icons/fa";
import { GiHouse } from "react-icons/gi";
import { AiOutlineTeam } from "react-icons/ai";
const { logo } = dataImages;

const AdminSidebar = () => {
  return (
    <div className="bg-white h-screen w-72 shadow-md">
      <div className="p-4 border-b w-full flex justify-start">
        <Link to="/admin-dashboard">
          <img src={logo} alt="logo" className="w-[180px]" />
        </Link>
      </div>

      <div className="flex flex-col">
        <Link to="/admin-dashboard" className="w-fit">
          <div>
            <GiHouse />
            Dashboard
          </div>
        </Link>
        <Link to="/admin-dashboard/teachers" className="w-fit">
          <FaUserTie />
          <div>Xodimlar</div>
        </Link>
        <Link to="/admin-dashboard/parents" className="w-fit">
          <AiOutlineTeam />
          <div>Ota-onalar</div>
        </Link>
        <Link to="/admin-dashboard/students" className="w-fit">
          <FaUserGraduate />
          <div>O'quvchilar</div>
        </Link>
        <Link to="/admin-dashboard/rooms" className="w-fit">
          <AiOutlineTeam />
          <div>Xonalar</div>
        </Link>
        <Link to="/admin-dashboard/teams" className="w-fit">
          <div>Guruhlar</div>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
