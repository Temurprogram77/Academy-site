import { Link } from "react-router-dom";
import dataImages from "../assets/images";

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
        <Link to="/admin-dashboard" className="">
          Dashboard
        </Link>
        <Link to="/admin-dashboard/teachers" className="">
          Xodimlar
        </Link>
        <Link to="/admin-dashboard/parents" className="">
          Ota-onalar
        </Link>
        <Link to="/admin-dashboard/students" className="">
          O'quvchilar
        </Link>
        <Link to="/admin-dashboard/rooms" className="">
          Xonalar
        </Link>
        <Link to="/admin-dashboard/teams" className="">
          Guruhlar
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
