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

  const MenuLinks = ({ closeDrawer }) => (
    <nav className="flex-1 mt-4">
      {menuItems.map((item) => (
        <Link
          key={item.key}
          to={item.key}
          onClick={closeDrawer}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors duration-200
            text-gray-600 hover:bg-emerald-50 hover:text-emerald-600
            ${location.pathname === item.key ? "bg-emerald-100 text-emerald-700 font-semibold" : ""}`}
        >
          <span className="text-lg">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-white border-r shadow-md">
        <div className="h-[4.5rem] px-6 flex items-center border-b">
          <img src={logo} className="h-10 cursor-pointer" alt="Logo" />
        </div>
        <MenuLinks />
        <div className="p-5 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-xl
              text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
          >
            <LogoutOutlined />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        placement="left"
        open={isOpen}
        onClose={onClose}
        width={260}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex flex-col h-full bg-white">
          <div className="h-16 flex items-center px-6 border-b">
            <img src={logo} className="h-10" alt="Logo" />
          </div>
          <MenuLinks closeDrawer={onClose} />
          <div className="p-5 border-t mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 rounded-xl
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
