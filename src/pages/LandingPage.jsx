import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import dataImages from "../assets/images";

const { logo, main } = dataImages;

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      if (role === "ADMIN") navigate("/admin-dashboard");
      else if (role === "TEACHER") navigate("/teacher-dashboard");
      else if (role === "STUDENT") navigate("/user-dashboard");
      else if (role === "PARENT") navigate("/user-dashboard");
    }
  }, [navigate]);

  return (
    <div className="md:mx-auto w-[400px] h-screen mx-4 flex flex-col items-center justify-center">
      <div className="logo mb-5 w-full">
        <img src={logo} alt="logo" className="w-[100px]" />
      </div>
      <h2 className="text-[40px] max-w-[400px] font-semibold text-center leading-9">
        Find out your English level!
      </h2>
      <img className="w-full" src={main} alt="main" />
      <Link to="/login" className="sm:max-w-[420px] w-full">
        <button className="cursor-pointer btn-gradient w-full py-2 text-white font-semibold rounded-3xl">
          Start
        </button>
      </Link>
    </div>
  );
};

export default LandingPage;
