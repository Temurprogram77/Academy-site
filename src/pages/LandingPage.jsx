import { Link } from "react-router-dom";
import dataImages from "../assets/images";

const { logo, main } = dataImages;

const LandingPage = () => {
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
