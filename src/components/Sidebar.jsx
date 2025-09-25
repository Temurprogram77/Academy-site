import dataImages from "../assets/images";
import { Drawer } from "antd";
import {
  DashboardOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: "/user-dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
    { key: "/user-dashboard/marks", label: "My Marks", icon: <BarChartOutlined /> },
    { key: "/user-dashboard/profile", label: "Profile", icon: <UserOutlined /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const logo = dataImages.logo;
  return (
    <>
      <div className="hidden md:flex flex-col w-72 bg-white border-r shadow-lg">
        <div className=" h-[4.5rem] p-[1rem] border-b flex items-center justify-between mb-6">
          <img src={logo} className="h-12 cursor-pointer" alt="Logo" />
        </div>
        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              to={item.key}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg mx-2 my-1
                text-gray-700 hover:bg-emerald-50 hover:text-emerald-600
                ${location.pathname === item.key ? "bg-emerald-100 text-emerald-700 font-semibold" : ""}
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 rounded-lg
              text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogoutOutlined />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <Drawer placement="left" open={isOpen} onClose={onClose} bodyStyle={{ padding: 0 }}>
        <div className="w-64 flex flex-col h-full bg-white">
          <div className="h-16 flex items-center justify-center border-b">
            <h1 className="text-xl font-bold text-emerald-600">Academy</h1>
          </div>
          <nav className="flex-1 mt-2">
            {menuItems.map((item) => (
              <Link
                key={item.key}
                to={item.key}
                onClick={onClose}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg mx-2 my-1
                  text-gray-700 hover:bg-emerald-50 hover:text-emerald-600
                  ${location.pathname === item.key ? "bg-emerald-100 text-emerald-700 font-semibold" : ""}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3 rounded-lg
                text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
            >
              <LogoutOutlined />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}
