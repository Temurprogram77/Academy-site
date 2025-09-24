import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const defaultImage =
  "https://t4.ftcdn.net/jpg/05/89/93/27/360_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

const TeacherNavbar = () => {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get("/user");
      return data.data;
    },
  });

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
            {profile?.fullName || "Teacher Name"}
          </span>
          <img
            onClick={() => navigate("profile")}
            src={profile?.imageUrl || defaultImage}
            alt="profile"
            className="w-10 h-10 cursor-pointer rounded-full border-2 border-green-400 object-cover"
          />
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;
