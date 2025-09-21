import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const defaultImage =
  "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

const TeacherNavbar = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    imageUrl: defaultImage,
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://167.86.121.42:8080/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          fullName: res.data.data.fullName || "",
          imageUrl: res.data.data.imageUrl || defaultImage,
        });
      } catch (err) {
        console.error(err);
        setProfile({
          fullName: "Teacher Name",
          imageUrl: defaultImage,
        });
      }
    };
    fetchProfile();
  }, [token]);

  const handleClick = () => {
    navigate("profile");
  };

  return (
    <nav className="w-full bg-white hidden shadow-md p-4 md:flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl hidden md:block font-bold text-green-700">
          Teacher Panel
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-gray-700 font-medium">
            {profile.fullName || "Teacher Name"}
          </span>
          <img
            onClick={handleClick}
            src={profile.imageUrl}
            alt="profile"
            className="w-10 h-10 cursor-pointer rounded-full border-2 border-green-400 object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
